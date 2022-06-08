# pull official base image
FROM node:17.9.1-alpine3.15

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json .
COPY package-lock.json .

# add app
COPY . .

RUN npm ci

RUN mkdir ./node_modules/.cache && chmod -R 777 ./node_modules/.cache

EXPOSE 3000

# start app
CMD ["npm", "start"]
