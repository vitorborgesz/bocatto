FROM node:22-alpine

WORKDIR /app

# Copia só os manifestos primeiro: se o código mudar mas as dependências não,
# o Docker reaproveita esta camada em cache e o build fica rápido.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3333
# Em desenvolvimento, o docker-compose.yml substitui este comando
# (aplica as migrations e sobe com nodemon).
CMD ["npm", "start"]
