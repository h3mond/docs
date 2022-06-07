FROM node

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY ./ ./

RUN chown -R node:node /app

RUN npm i -g ts-node
RUN npm ci --silent

CMD ["npm", "run", "dev"]
