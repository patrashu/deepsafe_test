import os
import platform
import cv2
import copy
import json
import argparse
import base64
import numpy as np
from enum import Enum
from io import BytesIO
from typing import Any

import uvicorn
from fastapi import security, FastAPI, Body
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

from PIL import Image
from ultralytics import YOLO

import torch
from torch import nn as nn
from torchvision import transforms
from torchvision.transforms.functional import to_pil_image, pil_to_tensor
from torchvision.utils import draw_segmentation_masks
import lightning as L
from seg_models import SegmentationModel



class Base64Bytes(BaseModel):
    @classmethod
    def encode(cls, data: bytes) -> 'Base64Bytes':
        return cls(data=base64.b64encode(data))


class ModelName(str, Enum):
    deeplabv3plus = "deeplabv3plus"
    yolov8 = "yolov8n"


class ImageRequest(BaseModel):
    ml_model_name: str
    image_file: Base64Bytes


class ImageResponse(BaseModel):
    ml_model_name: str
    image_file: str
    results: dict[str, list]

class VideoRequest(BaseModel):
    path: str


class PanoramaRequest(BaseModel):
    image_files: list[Base64Bytes]


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:2630"],  # React 앱이 실행되는 주소 다른 허용하려는 주소를 추가할 수 있습니다.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if platform.system() == "Windows":
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
else:
    device = "cpu"

parser = argparse.ArgumentParser(add_help=False)
parser.add_argument("--checkpoint-path", default="segformer.ckpt", type=str)
parser.add_argument("--batch-size", default=1, type=int)
parser.add_argument("--config", default="segformer-mit-b0-384.json", type=str)
parser.add_argument("--devices", default=2, type=int)
parser.add_argument("--profiler", default=None, type=str)
args = parser.parse_args()

with open(args.config, 'rt') as f:
    t_args = argparse.Namespace()
    t_args.__dict__.update(json.load(f))
    args = parser.parse_args(namespace=t_args)

seg_model = SegmentationModel.load_from_checkpoint(
    **dict(args._get_kwargs(), map_location=device)
)
seg_model.to(device)

yolo_model = YOLO('yolov8n-seg.pt')
yolo_model.to(device)

def get_original(data: str = None):
    cam = cv2.VideoCapture(data)
    while True:
        ret, frame = cam.read()
        if not ret:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

def get_yolo_inference(data: str = None):
    cam = cv2.VideoCapture(data)
    while True:
        ret, frame = cam.read()
        if not ret:
            break
        else:
            results = yolo_model(frame)
            pred_image = results[0].plot()
            ret, buffer = cv2.imencode('.jpg', pred_image)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

def get_seg_inference(data: str = None):
    cam = cv2.VideoCapture(data)
    while True:
        ret, frame = cam.read()
        if not ret:
            break
        else:
            frame_copy = copy.deepcopy(frame)
            image_size = frame.shape[:2]
            image = transforms.ToTensor()(frame)
            image = transforms.Resize((384, 384))(image)
            image = transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])(image)
            image = image.unsqueeze(0)
            image = image.to(device)

            output = seg_model(image)
            output = nn.functional.interpolate(
                output.logits.detach().cpu(),
                size=image_size, # (height, width)
                mode='bilinear',
                align_corners=False
            )
            predicted = output.argmax(1).to(torch.uint8)
            predicted[predicted != 0] = 255

            img = Image.fromarray(frame_copy)
            img = pil_to_tensor(img)
            concat_img = to_pil_image(
                draw_segmentation_masks(
                    img.to(torch.uint8), predicted.to(torch.bool), alpha=.6, colors=(255, 0, 0)
                )
            )

            concat_img = np.array(concat_img)
            ret, buffer = cv2.imencode('.jpg', concat_img)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


@app.post("/predict", response_model=ImageResponse)
async def predict(data: ImageRequest):
    image = Image.open(BytesIO(data.image_file))
    ml_model_name = data.ml_model_name

    results = yolo_model(image)
    pred_boxes = results[0].boxes.xyxy[0].cpu().numpy().tolist()
    pred_masks = np.array(results[0].masks.xy).tolist()

    pred_image = results[0].plot()
    pred_image = Image.fromarray(pred_image).convert('RGB')
    fp = BytesIO()
    pred_image.save(fp, format='JPEG')
    pred_image = base64.b64encode(fp.getvalue())

    results = {
        "ml_model_name": ml_model_name,
        "image_file": pred_image,
        "results": {
            "boxes": pred_boxes,
            "masks": pred_masks,
        },
    }
    return results

@app.post("/predict_segmentation")
async def predict_segmentation(data: ImageRequest):
    image = Image.open(BytesIO(data.image_file))
    img_copy = copy.deepcopy(image)
    ml_model_name = data.ml_model_name
    image_size = image.size

    image = transforms.ToTensor()(image)
    image = transforms.Resize((384, 384))(image)
    image = transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])(image)
    image = image.unsqueeze(0)
    image = image.to(device)

    output = seg_model(image)
    output = nn.functional.interpolate(
        output.logits.detach().cpu(),
        size=image_size[::-1], # (height, width)
        mode='bilinear',
        align_corners=False
    )
    predicted = output.argmax(1).to(torch.uint8)

    predicted[predicted != 0] = 255
    pred_copy = copy.deepcopy(predicted)
    predicted = to_pil_image(predicted)
    predicted = predicted.resize(image_size)

    fp = BytesIO()
    predicted.save(fp, format='JPEG')
    predicted = base64.b64encode(fp.getvalue())
    img_copy = pil_to_tensor(img_copy)
    concat_img = to_pil_image(
        draw_segmentation_masks(
            img_copy.to(torch.uint8), pred_copy.to(torch.bool), alpha=.6, colors=(255, 0, 0)
        )
    )

    fp = BytesIO()
    concat_img.save(fp, format='JPEG')
    concat_img = base64.b64encode(fp.getvalue())
    results = {
        "ml_model_name": ml_model_name,
        "image_file": predicted,
        "concat_file": concat_img,
    }
    return results


@app.get("/video_streaming_original")
async def video_streaming_original():
    return StreamingResponse(get_original("../../public/crack1.mp4"), media_type="multipart/x-mixed-replace;boundary=frame")


@app.get("/video_streaming_inference")
async def video_streaming_inference():
    return StreamingResponse(get_seg_inference("../../public/crack1.mp4"), media_type="multipart/x-mixed-replace;boundary=frame")


@app.get("/")
async def hello():
    return {"message": "Hello World"}


@app.post("/panorama")
async def panorama(data: ImageRequest):
    import torch
    from kornia.contrib import ImageStitcher
    from kornia.feature import LoFTR
    import torch.nn.functional as F
    import torchvision.transforms.functional as TF
    import matplotlib.pyplot as plt
    import cv2
    import kornia as K

    def load_images(fnames):
        return [
            F.interpolate(
                    K.io.load_image(fn, K.io.ImageLoadType.RGB32)[None, ...].to(device), (700, 700)
            )
            for fn in fnames
        ]

    imgs = load_images(["./img/h01.jpg", "./img/h02.jpg", "./img/h03.jpg"])
    matcher = LoFTR(pretrained='indoor')
    IS = ImageStitcher(matcher, estimator='ransac').to(device)

    with torch.no_grad():
        out = IS(*imgs)

    out = K.tensor_to_image(out.detach().cpu())
    out = (out * 255).astype(np.uint8)

    out = Image.fromarray(out)

    fp = BytesIO()
    out.save(fp, format='JPEG')
    out = base64.b64encode(fp.getvalue())

    results = {
        "image_file": out,
        "concat_file": out,
    }

    return results


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
