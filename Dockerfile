FROM node:20-alpine
WORKDIR /app

# Instalamos dependencias
COPY package.json yarn.lock ./
RUN yarn install

# Copiamos el resto del código
COPY . .

# Construimos (necesario para producción)
RUN yarn build

EXPOSE 3000

# Este comando es el default, pero el docker-compose lo sobrescribirá
CMD ["node", "dist/main"]
