# Usa Node.js 22 en Alpine
FROM node:22-alpine

WORKDIR /app

# Copia todo el código fuente
COPY . .

# Instala dependencias y construye la app
RUN npm install && npm run build

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
