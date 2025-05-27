# Etapa 1: Build
FROM node:22-alpine as build-stage

WORKDIR /app
COPY . .

RUN npm install && npm run build

# Etapa 2: Producción
FROM node:22-alpine

WORKDIR /app

COPY --from=build-stage /app ./

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
