#######################
### NODE BASE IMAGE ###
#######################
FROM node:lts-alpine AS platform-base

RUN apk --update --no-cache add nano bash

WORKDIR /app

########################
### NODE LOCAL IMAGE ###
########################
FROM platform-base AS platform-local

ENV NODE_ENV=development

COPY docker/node/docker-entrypoint-local.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

##########################
### NODE BUILDER IMAGE ###
##########################
# This image is used for SPA in production
# This image is used to build sources of your app and get the /dist (or equivalent) folder
FROM platform-base AS builder

COPY package.json ./
COPY yarn.lock ./

RUN yarn --frozen-lockfile

ENV NODE_ENV=production

COPY . .

RUN yarn build

##############################
### FRONT NGINX PROD IMAGE ###
##############################
# Get the /dist folder from build and add it to the front nginx
# This image is used for SPA in production
FROM nginx:stable AS platform-webserver-production

RUN apt update && apt install -y logrotate cron

COPY docker/nginx/production/logrotate-nginx.conf /etc/logrotate.d/nginx
COPY docker/nginx/production/docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod 644 /etc/logrotate.d/nginx
RUN chmod +x /docker-entrypoint.sh

RUN mkdir /app
RUN mkdir /static-logs
RUN touch /static-logs/access.log
RUN touch /static-logs/error.log

ADD docker/nginx/production/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /app
