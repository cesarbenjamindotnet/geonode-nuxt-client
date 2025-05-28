# 🏗️ Stage 1: build
FROM node:22-alpine AS builder

WORKDIR /app

# Copia los archivos necesarios para el build
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# ⚠️ NO uses variables de entorno aquí para runtimeConfig
# Nuxt las debe obtener en tiempo de ejecución (desde Cloud Run)

RUN npm run build


# 🏁 Stage 2: producción
FROM node:22-alpine

WORKDIR /app

# Copia solo lo necesario del build anterior
COPY --from=builder /app/.output .output
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .

# Instala dependencias necesarias para correr
RUN npm install --omit=dev  # o `--production` en versiones más viejas

# Configuración para Nuxt en Cloud Run
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Inicia Nuxt
# CMD ["node", ".output/server/index.mjs"]
CMD ["npm", "run", "start"]