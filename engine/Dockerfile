FROM python:3.10.12

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN apt-get update && apt-get install -y build-essential
RUN apt-get -y install libgl1-mesa-glx
RUN pip install -r /app/requirements.txt

COPY ./main.py /app/
COPY ./seg_models.py /app/
COPY ./segformer-mit-b0-384.json /app/
COPY ./segformer.ckpt /app/
COPY ./img/ /app/img/

CMD ["python", "main.py"]
