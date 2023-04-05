# The instructions for the first stage
FROM node:18-alpine as build-stage

RUN apk add --no-cache python3 make g++

COPY ./package*.json ./
COPY ./apps/log-manager/package*.json ./apps/log-manager/
COPY ./shared/middleware/package*.json ./shared/middleware/
RUN npm install

# The instructions for second stage
FROM node:18-alpine as production-stage

RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

WORKDIR /usr/src/app
COPY --from=build-stage node_modules node_modules
# COPY --from=build-stage ./apps/log-manager/node_modules ./apps/log-manager/node_modules
# COPY --from=build-stage ./shared/middleware/node_modules ./shared/middleware/node_modules

COPY ./shared/middleware/ ./shared/middleware/
COPY ./apps/log-manager/ ./apps/log-manager/
COPY ./apps/mft.yaml ./apps/log-manager/src/mft.yaml

WORKDIR /usr/src/app/apps/log-manager