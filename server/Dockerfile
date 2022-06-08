FROM node:17.9.1-alpine3.15

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY ./ ./

RUN chown -R node:node /app

RUN apt-get install libreoffice-core --no-install-recommends

RUN npm i -g ts-node
RUN npm ci

EXPOSE 3001

CMD ["npm", "run", "dev"]
