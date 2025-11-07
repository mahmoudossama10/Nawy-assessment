# syntax=docker/dockerfile:1.6

FROM node:20-alpine AS base
WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL="http://backend:4000"
ARG API_BASE_URL="http://backend:4000"
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV API_BASE_URL=${API_BASE_URL}

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["npm", "run", "start"]

