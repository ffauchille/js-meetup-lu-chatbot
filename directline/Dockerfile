FROM node:8.1-alpine as build

LABEL maintainer="Florent FAUCHILLE <florentfauchille@gmail.com>"

COPY . /app

WORKDIR /app

RUN npm install && npm run build

FROM node:8.1-alpine

ARG CHATBOT_API_HOST=http://js-meetup-dialog:3978
ARG HTTP_ALLOW_ORIGINS=*

ENV CHATBOT_API_HOST ${CHATBOT_API_HOST}
ENV HTTP_ALLOW_ORIGINS ${HTTP_ALLOW_ORIGINS}

WORKDIR /app

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/built /app/built

CMD [ "node", "built/app.js" ]
