# syntax=docker/dockerfile:1.6

FROM node:20-alpine AS base
WORKDIR /app

ARG DATABASE_URL="postgresql://postgres:postgres@localhost:5432/apartments?schema=public"
ENV DATABASE_URL=${DATABASE_URL}

COPY package*.json tsconfig.json prisma.config.ts ./
COPY prisma ./prisma

RUN npm install

RUN npx prisma generate

COPY src ./src

RUN npm run build

EXPOSE 4000
ENV NODE_ENV=production

CMD ["sh", "-c", "npx prisma migrate deploy && npx ts-node prisma/seed.ts && node dist/index.js"]

