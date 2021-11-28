FROM node:14.18-alpine as build

WORKDIR /app/frontend
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

