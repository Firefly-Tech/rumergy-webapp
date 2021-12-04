FROM node:14.18-alpine as build

WORKDIR /app/frontend
COPY package*.json ./
RUN npm ci --silent
COPY . .

ARG REACT_APP_API_HOST
ENV REACT_APP_API_HOST=${REACT_APP_API_HOST}

RUN npm run build

