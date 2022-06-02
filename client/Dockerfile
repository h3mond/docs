# pull official base image
FROM node

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json .
COPY package-lock.json .

# add app
COPY . .

RUN npm i

RUN mkdir ./node_modules/.cache && chmod -R 777 ./node_modules/.cache

EXPOSE 3000

# start app
CMD ["npm", "start"]
