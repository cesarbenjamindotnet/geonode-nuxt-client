FROM node:22-alpine

WORKDIR /app

COPY . .

# Asegúrate de instalar dependencias
RUN npm install

# Usa variables en tiempo de ejecución
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# El build se ejecuta en tiempo de despliegue,
# y usará las variables de entorno definidas en Cloud Run
RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
