# The instructions for the first stage
FROM node:18-alpine as build-stage

RUN apk add --no-cache python3 make g++

COPY ./mail-worker/package*.json ./
RUN npm install

# The instructions for second stage
FROM node:18-alpine as production-stage

RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

WORKDIR /usr/src/app
COPY --from=build-stage node_modules node_modules

COPY ./mail-worker/ .
COPY ./mft.yaml ./src/mft.yaml