# The instructions for the first stage
FROM node:18-alpine as build-stage

RUN apk add --no-cache python3 make g++

COPY ./package*.json ./
COPY ./apps/rest-api/package*.json ./apps/rest-api/
COPY ./shared/config/package*.json ./shared/config/
COPY ./shared/middleware/package*.json ./shared/middleware/
COPY ./shared/datalayer/package*.json ./shared/datalayer/
RUN npm install

# The instructions for second stage
FROM node:18-alpine as production-stage

RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

WORKDIR /usr/src/app
COPY --from=build-stage node_modules node_modules
# COPY --from=build-stage ./apps/rest-api/node_modules ./apps/rest-api/node_modules
# COPY --from=build-stage ./shared/middleware/node_modules ./shared/middleware/node_modules

COPY ./shared/middleware/ ./shared/middleware/
COPY ./shared/config/ ./shared/config/
COPY ./shared/datalayer/ ./shared/datalayer/
COPY ./apps/rest-api/ ./apps/rest-api/
COPY ./apps/mft.yaml ./apps/rest-api/server/mft.yaml

WORKDIR /usr/src/app/apps/rest-api

EXPOSE 3000
