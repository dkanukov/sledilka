FROM python:3.12.2-slim-bullseye


WORKDIR /streaming

COPY requirements.txt .
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
RUN pip3 install -r requirements.txt

COPY . .

CMD [ "python3", "app.py"]