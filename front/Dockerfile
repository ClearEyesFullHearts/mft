# étape de build
FROM node:lts-alpine as build-stage
WORKDIR /usr/src/app
ARG DOCKER_ENV
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:$DOCKER_ENV

# étape de production
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]