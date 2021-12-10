# syntax=docker/dockerfile:1
FROM python:3.9-bullseye
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
WORKDIR /app/backend

COPY ./requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

RUN apt update -y && apt install cron -y
RUN service cron start

COPY . .
