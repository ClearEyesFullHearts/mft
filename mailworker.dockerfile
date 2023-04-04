# The instructions for the first stage
FROM node:18-alpine as build-stage

RUN apk add --no-cache python3 make g++

COPY ./package*.json ./
COPY ./async/mail-worker/package*.json ./async/mail-worker/
COPY ./async/middleware/package*.json ./async/middleware/
RUN npm install

# The instructions for second stage
FROM node:18-alpine as production-stage

RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

WORKDIR /usr/src/app
COPY --from=build-stage node_modules node_modules
COPY --from=build-stage ./async/mail-worker/node_modules ./async/mail-worker/node_modules
COPY --from=build-stage ./async/middleware/node_modules ./async/middleware/node_modules

COPY ./async/middleware/ ./async/middleware/
COPY ./async/mail-worker/ ./async/mail-worker/
COPY ./async/mft.yaml ./async/mail-worker/src/mft.yaml

WORKDIR /usr/src/app/async/mail-worker