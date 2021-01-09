# build stage
FROM node:lts-alpine as develop-stage
WORKDIR /app
ENV PATH app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm install
RUN npm install -g @vue/cli
COPY . .

FROM develop-stage as build-stage
RUN npm run-script build:prod


# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY entrypoint.sh /usr/share/nginx/
RUN chmod +x /usr/share/nginx/entrypoint.sh
ENTRYPOINT ["/usr/share/nginx/entrypoint.sh"]

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]