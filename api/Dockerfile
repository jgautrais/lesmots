### BACKEND BASE
FROM php:8.3-fpm-alpine AS api-base

ARG DOCKER_UID
ARG DOCKER_GID

# Basics
RUN apk --update --no-cache add bash nano

# Add easy extension installer
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

# Install required extensions
RUN chmod +x /usr/local/bin/install-php-extensions

# Install default required extensions
RUN install-php-extensions apcu calendar igbinary pcntl zip

# Install http extension
RUN install-php-extensions http

# Install MySQL
RUN install-php-extensions pdo_mysql mysqli

# Install GD extension
RUN install-php-extensions gd

# Change UID
RUN apk --no-cache add shadow && \
    usermod -u ${DOCKER_UID} www-data && \
    groupmod -g ${DOCKER_GID} www-data


# Configure opcache
ADD docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Install Composer from image
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

USER www-data

### BACKEND LOCAL
FROM api-base AS api-local

USER root
# Setup entrypoint
COPY docker/php/docker-entrypoint /usr/local/bin/backend-entrypoint
RUN chmod +x /usr/local/bin/backend-entrypoint

USER www-data

### BACKEND PRODUCTION
FROM api-base as api-production

USER root

COPY --chown=www-data:www-data . .

USER www-data

RUN composer install --no-dev

###########################
### BACKEND CRON IMAGE ####
###########################
FROM api-base AS api-cron-base

USER root

RUN apk --update --no-cache add logrotate moreutils

COPY docker/cron/crontasks /etc/crontabs/www-data
COPY docker/cron/logrotate-cron.conf /etc/logrotate.d/cron

RUN touch /var/log/cron.log
RUN chown www-data:www-data /var/log/cron.log
RUN chmod 644 /etc/logrotate.d/cron

CMD ["crond", "-f"]

#################################
### BACKEND CRON LOCAL IMAGE ####
#################################
FROM api-cron-base AS api-cron-local

######################################
### BACKEND CRON PRODUCTION IMAGE ###
######################################
FROM api-cron-base AS api-cron-production

COPY --from=api-production /var/www/html /var/www/html


##################################
### WEBSERVER NGINX BASE IMAGE ###
##################################
FROM nginx:stable AS webserver-base

###################################
### WEBSERVER NGINX LOCAL IMAGE ###
###################################
FROM webserver-base AS webserver-local

ADD docker/nginx/local/conf.d-default.conf /etc/nginx/conf.d/default.conf
ADD docker/nginx/local/nginx.conf /etc/nginx/nginx.conf

########################################
### WEBSERVER NGINX PRODUCTION IMAGE ###
########################################
FROM webserver-base AS webserver-production

RUN apt update && apt install -y logrotate cron

COPY docker/nginx/production/logrotate-nginx.conf /etc/logrotate.d/nginx
COPY docker/nginx/production/docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod 644 /etc/logrotate.d/nginx
RUN chmod +x /docker-entrypoint.sh

RUN mkdir /static-logs
RUN touch /static-logs/access.log
RUN touch /static-logs/error.log

ADD docker/nginx/production/conf.d-default.conf /etc/nginx/conf.d/default.conf
ADD docker/nginx/production/nginx.conf /etc/nginx/nginx.conf

COPY --from=backend-production /var/www/html/public /var/www/html/public

# Uncomment next line if need to create a symbolic link between your public laravel storage and your webserver
# RUN ls -s /var/www/html/backend_storage/app/public /var/www/html/public/storage



