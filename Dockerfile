# develop stage
FROM node:20.8-alpine as develop-stage
WORKDIR /app
COPY package*.json ./
RUN yarn global add @quasar/cli
COPY . .
COPY .env.prod .env

# build stage
FROM develop-stage as build-stage
RUN yarn --ignore-engines
RUN export NODE_OPTIONS=--openssl-legacy-provider && quasar build

# production stage
FROM  nginx:stable-alpine3.17-slim as production-stage
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]