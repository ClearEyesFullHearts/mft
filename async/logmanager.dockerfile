# The instructions for the first stage
FROM node:18-alpine as build-stage

RUN apk add --no-cache python3 make g++

COPY ./package*.json ./
COPY ./async/log-manager/package*.json ./async/log-manager/
COPY ./async/middleware/package*.json ./async/middleware/
RUN npm install

# The instructions for second stage
FROM node:18-alpine as production-stage

RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

WORKDIR /usr/src/app
COPY --from=build-stage node_modules node_modules
COPY --from=build-stage ./async/log-manager/node_modules ./async/log-manager/node_modules
COPY --from=build-stage ./async/middleware/node_modules ./async/middleware/node_modules

COPY ./async/middleware/ ./async/middleware/
COPY ./async/log-manager/ ./async/log-manager/
COPY ./async/mft.yaml ./async/log-manager/src/mft.yaml

WORKDIR /usr/src/app/async/log-manager