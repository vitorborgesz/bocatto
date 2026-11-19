FROM node:22-alpine

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Copia só os manifestos primeiro para aproveitar o cache das dependências.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 4100
# Servidor de desenvolvimento (hot reload). Para produção: npm run build && npm start.
CMD ["npm", "run", "dev"]
