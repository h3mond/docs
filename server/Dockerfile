FROM node

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY ./ ./

RUN npm ci

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
