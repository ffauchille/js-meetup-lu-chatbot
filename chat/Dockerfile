FROM node:8 as build

COPY . /app/
WORKDIR /app

RUN npm install && npm run build

FROM nginx:stable-alpine

COPY --from=build /app/botchat* /usr/share/nginx/html/
COPY --from=build /app/index.html /usr/share/nginx/html/