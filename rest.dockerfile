# The instructions for the first stage
FROM node:lts-alpine as build-stage

RUN apk add --no-cache python3 make g++

COPY ./rest/package*.json ./
RUN npm install

# The instructions for second stage
FROM node:lts-alpine as production-stage

RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

WORKDIR /usr/src/app
COPY --from=build-stage node_modules node_modules

COPY ./rest/ .
COPY ./async/mft.yaml ./async/mft.yaml

EXPOSE 3000
