# The instructions for the first stage
FROM node:lts-alpine as build-stage

RUN apk add --no-cache python make g++

COPY package*.json ./
RUN npm install

# The instructions for second stage
FROM node:lts-alpine as production-stage

WORKDIR /usr/src/app
COPY --from=build-stage node_modules node_modules

COPY . .

EXPOSE 3000

CMD [ "node", "app.js" ]