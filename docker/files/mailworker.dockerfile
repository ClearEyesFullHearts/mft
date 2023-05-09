# The instructions for the first stage
FROM node:18-alpine as build-stage

RUN apk add --no-cache python3 make g++

COPY ./package*.json ./
COPY ./shared/config/package*.json ./shared/config/
COPY ./apps/mail-worker/package*.json ./apps/mail-worker/
COPY ./shared/middleware/package*.json ./shared/middleware/
COPY ./shared/secret_env/package*.json ./shared/secret_env/
RUN npm install

# The instructions for second stage
FROM node:18-alpine as production-stage

RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

WORKDIR /usr/src/app
COPY --from=build-stage node_modules node_modules
# COPY --from=build-stage ./apps/mail-worker/node_modules ./apps/mail-worker/node_modules
# COPY --from=build-stage ./shared/middleware/node_modules ./shared/middleware/node_modules

COPY ./shared/middleware/ ./shared/middleware/
COPY ./shared/secret_env/ ./shared/secret_env/
COPY ./shared/config/ ./shared/config/
COPY ./apps/mail-worker/ ./apps/mail-worker/

WORKDIR /usr/src/app/apps/mail-worker