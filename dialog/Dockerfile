#
# ---- Base Node ----
FROM alpine:3.5 AS base
# install node
RUN apk add --no-cache nodejs-current
# set working directory
WORKDIR /root/chatbot
# copy project file
COPY package.json .

#
# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm install --loglevel=warn

#
# ---- Release ----
FROM base AS release

ARG MEETUP_API_KEY
ARG MEETUP_ENDPOINT=https://api.meetup.com
ARG HOST_PUBLIC_ADDRESS=http://localhost:3979/

ENV DIRECTLINE_HOST http://js-meetup-directline:8081
ENV NLU_HOST http://js-meetup-rasa-nlu:5000
ENV HOST_PUBLIC_ADDRESS=${HOST_PUBLIC_ADDRESS}
ENV MEETUP_API_KEY=${MEETUP_API_KEY}
ENV MEETUP_ENDPOINT=${MEETUP_ENDPOINT}
ENV JAVASCRIPT_LUXEMBOURG_ID=18338469

# copy production node_modules
COPY --from=dependencies /root/chatbot/node_modules ./node_modules
# copy app sources
COPY . .
# expose port and define CMD
EXPOSE 3978
CMD npm run start