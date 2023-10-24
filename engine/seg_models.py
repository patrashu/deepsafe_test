import math
import json
from typing import Any

import torch
import torch.nn.functional as F
from torch import nn, Tensor, optim
from torchvision.models import segmentation
from lightning.pytorch import LightningModule
from transformers import AutoConfig, AutoModelForSemanticSegmentation, SegformerForSemanticSegmentation
import segmentation_models_pytorch as smp


def _dice_score(preds: torch.Tensor, targets: torch.Tensor, smooth: float = 1e-7) -> torch.float32:
    """TODO: check this function
    args:
        preds: torch.float32[B, H, W] or [B, C, H, W]
        targets: torch.int64[]
        smooth: float
    """
    assert preds.shape == targets.shape, f"preds.shape: {preds.shape}, targets.shape: {targets.shape}"
    intersection = torch.sum(preds * targets)
    return (2.0 * intersection + smooth) / (torch.sum(preds) + torch.sum(targets) + smooth)


def _calculate_scores(outputs: torch.Tensor, targets: torch.Tensor, mode: str = "binary", threshold: float = 0.5):
    """ lets assume we have multilabel prediction for 3 classes
    output = torch.rand([10, 3, 256, 256])
    target = torch.rand([10, 3, 256, 256]).round().long()

    first compute statistics for true positives, false positives, false negative and
        true negative "pixels"
        tp, fp, fn, tn = smp.metrics.get_stats(output, target, mode='multilabel', threshold=0.5)

    then compute metrics with required reduction (see metric docs)
        iou_score = smp.metrics.iou_score(tp, fp, fn, tn, reduction="micro")
        f1_score = smp.metrics.f1_score(tp, fp, fn, tn, reduction="micro")
        f2_score = smp.metrics.fbeta_score(tp, fp, fn, tn, beta=2, reduction="micro")
        accuracy = smp.metrics.accuracy(tp, fp, fn, tn, reduction="macro")
        recall = smp.metrics.recall(tp, fp, fn, tn, reduction="micro-imagewise")
    """
    tp, fp, fn, tn = smp.metrics.get_stats(outputs, targets, mode='multilabel', threshold=0.5)
    iou_score = smp.metrics.iou_score(tp, fp, fn, tn, reduction="micro")
    f1_score = smp.metrics.f1_score(tp, fp, fn, tn, reduction="micro")
    f2_score = smp.metrics.fbeta_score(tp, fp, fn, tn, beta=2, reduction="micro")
    accuracy = smp.metrics.accuracy(tp, fp, fn, tn, reduction="macro")
    recall = smp.metrics.recall(tp, fp, fn, tn, reduction="micro-imagewise")
    precision = smp.metrics.positive_predictive_value(tp, fp, fn, tn, reduction="micro-imagewise")
    dice_score = _dice_score(outputs, targets)

    return {
        "iou_score": iou_score, "f1_score": f1_score, "f2_score": f2_score,
        "accuracy": accuracy, "recall": recall, "precision": precision, "dice": dice_score
    }


class Segformer:
    def __init__(
        self,
        backbone_name: str = "nvidia/mit-b0",
        id2label: dict[int, str] = {0: "background", 1: "crack"},
        num_labels: int = 2,
        image_size: int = 512,
    ) -> None:
        """
        Args:
            backbone_name: original pretrained_model_name_or_path
        """
        id2label: dict[int, str] = {0: "background", 1: "crack"}
        label2id: dict[str, int] = {v: k for k, v in id2label.items()}

        self.config = AutoConfig.from_pretrained(
            pretrained_model_name_or_path=backbone_name,
            label2id=label2id,
            id2label=id2label,
            image_size=image_size,
            num_labels=num_labels,
        )
        self.model = AutoModelForSemanticSegmentation.from_pretrained(
            pretrained_model_name_or_path=backbone_name,
            config=self.config,
        )


class SegmentationModel(LightningModule):
    def __init__(
        self,
        model_name: str,
        backbone_name: str,
        is_scheduler: bool = False,
        **kwargs: dict
    ) -> None:
        """
        Args:
            model_name: DeepLabV3, DeepLabVPlus, PSPNet, Unet, UnetPlusPlus
            backbone_name: pretrained_model_name (huggingface) and encoder_name (smp) to backbone_name
            loss_func_name: SoftBCEWithLogitsLoss, SoftCrossEntropyLoss, FocalLoss, DiceLoss, JaccardLoss
            is_scheduler: bool
            kwargs: 
                smp: encorder_: "imagenet", classes=1, 
        """
        super().__init__()
        self.save_hyperparameters()
        # scaling the learning rate by the batch size or number of gpus
        # self.lr = kwargs.get("lr", 1e-4) * math.sqrt(kwargs.get("devices", 3))
        self.model_name = model_name
        self.lr = kwargs.get("lr", 1e-4)
        self.log_on_epoch = kwargs.get("log_on_epoch", False)
        self.is_scheduler = is_scheduler
        if model_name in ["segformer"]:
            self.model = Segformer(backbone_name=backbone_name, **kwargs.get("model_params", {})).model
            # num_classes or num_labels 1 is BCEWithLogits > 1 is CrossEntropy
            self.loss_func = nn.CrossEntropyLoss(ignore_index=self.model.config.semantic_loss_ignore_index)
        elif model_name in ["Unet", "UnetPlusPlus", "DeepLabV3", "DeepLabV3Plus"]:
            self.model = getattr(smp, model_name)(encoder_name=backbone_name, **kwargs.get("model_params", {}))
            # self.loss_func = getattr(smp.losses, kwargs.get("loss_function", loss_func_name))(**kwargs.get("loss_params", {}))
            self.loss_func = nn.CrossEntropyLoss()
        else:
            self.model = getattr(segmentation, model_name)(**kwargs)

    def forward(self, x: torch.Tensor) -> torch.FloatTensor:
        return self.model(x)

    def configure_optimizers(self) -> dict[str, Any]:
        optimizer = optim.Adam(self.parameters(), lr=self.lr)
        return_dict = {"optimizer": optimizer}
        if self.hparams.is_scheduler:
            scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, self.trainer.max_epochs, 0)
            return_dict["lr_scheduler"] = scheduler
        return return_dict

    def training_step(self, batch: torch.Tensor, batch_idx: int) -> dict[str, torch.Tensor]:
        """
        Args:
            images, labels [B, C, H, W], labels[B, Class, H, W]
            pixel_values: torch.FloatTensor
            labels: torch.LongTensor
            but segformer in transformers image[B, C, H, W] and label [B, H, W] 0-255
            segformer returns label [B, Class, H/4, W/4]
            again unsqueeze(1)
            transformers.SegformerModel return num_labels > 1 [B, Class, H/4, W/4] num_labels == 1 [B, H/4, W/4]
        """
        images, labels = batch
        labels = labels.squeeze(1)  # [B, 1, H, W] -> [B, H, W]
        if self.model.__module__.startswith("transformers"):
            outputs = self.model(images, labels)
            loss = outputs.loss
            outputs = outputs.logits  # dtype torch.float
            outputs = F.interpolate(
                outputs,
                size=images.shape[2:],  # (height, width)
                mode="bilinear",
                align_corners=False
            )
        elif self.model.__module__.startswith("segmentation_models_pytorch"):
            outputs = self.model(images)
            loss = self.loss_func(outputs, labels)
        else:
            outputs = self(images)["out"]

        outputs = outputs.argmax(1)  # [B, C, H, W] -> [B, H, W].dtype[torch.int64]
        acc = _calculate_scores(outputs, labels)        
        self.log("train_loss", loss, prog_bar=True, on_step=True, on_epoch=self.log_on_epoch, sync_dist=True)
        self.log("train_iou", acc["iou_score"], on_step=True, on_epoch=self.log_on_epoch, sync_dist=True)
        self.log("train_f1", acc["f1_score"], on_step=True, on_epoch=self.log_on_epoch, sync_dist=True)
        self.log("train_f2", acc["f2_score"], on_step=True, on_epoch=self.log_on_epoch, sync_dist=True)
        self.log("train_acc", acc["accuracy"], on_step=True, on_epoch=self.log_on_epoch, sync_dist=True)
        self.log("train_recall", acc["recall"], on_step=True, on_epoch=self.log_on_epoch, sync_dist=True)
        self.log("train_precision", acc["precision"], on_step=True, on_epoch=self.log_on_epoch, sync_dist=True)
        self.log("train_dice", acc["dice"], on_step=True, on_epoch=self.log_on_epoch, sync_dist=True)

        return {"loss": loss, "pred": outputs}

    def validation_step(self, batch: torch.Tensor, batch_idx: int) -> dict[str, torch.Tensor]:
        images, labels = batch
        labels = labels.squeeze(1)
        if self.model.__module__.startswith("transformers"):
            outputs = self.model(images)
            outputs = outputs.logits
            outputs = F.interpolate(
                outputs,
                size=images.shape[2:],
                mode="bilinear",
                align_corners=False
            )
            loss = self.loss_func(outputs, labels)
        elif self.model.__module__.startswith("segmentation_models_pytorch"):
            outputs = self.model(images)
            loss = self.loss_func(outputs, labels)
        else:
            outputs = self(images)["out"]

        outputs = outputs.argmax(1)
        acc = _calculate_scores(outputs, labels)
        self.log("valid_loss", loss, prog_bar=True, on_step=True, on_epoch=True, sync_dist=True)
        self.log("valid_iou", acc["iou_score"], on_step=True, on_epoch=True, sync_dist=True)
        self.log("valid_f1", acc["f1_score"], on_step=True, on_epoch=self.log_on_epoch, sync_dist=True)
        self.log("valid_f2", acc["f2_score"], on_step=True, on_epoch=self.log_on_epoch, sync_dist=True)
        self.log("valid_acc", acc["accuracy"], on_step=True, on_epoch=self.log_on_epoch, sync_dist=True)
        self.log("valid_recall", acc["recall"], on_step=True, on_epoch=self.log_on_epoch, sync_dist=True)
        self.log("valid_precision", acc["precision"], on_step=True, on_epoch=self.log_on_epoch, sync_dist=True)
        self.log("valid_dice", acc["dice"], on_step=True, on_epoch=self.log_on_epoch, sync_dist=True)

        return {"pred": outputs}
        
    def predict_step(self, batch: torch.FloatTensor, batch_idx: int, dataloader_idx: int = 0):
        images, raw_image = batch
        if self.model.__module__.startswith("transformers"):
            outputs = self.model(images)
            outputs = outputs.logits
        elif self.model.__module__.startswith("segmentation_models_pytorch"):
            outputs = self.model(images)

        outputs = F.interpolate(
            outputs,
            size=raw_image.shape[2:],
            mode="bilinear",
            align_corners=False
        )
        outputs = outputs.argmax(1)
        return outputs.to(torch.uint8).detach(), raw_image


if __name__ == "__main__":
    model = SegmentationModel("segformer", "resnet18")
    images = torch.randn((1, 3, 224, 224))
    labels = torch.ones((1, 3, 224, 224))
    outputs = model(images)