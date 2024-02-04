### BACKEND BASE
FROM php:8.3-fpm-alpine AS api-base

# Basics
RUN apk --update --no-cache add bash nano

# Install Nginx
RUN apk add nginx
ADD docker/conf.d-default.conf /etc/nginx/http.d/default.conf
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

# Add easy extension installer
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions

# Install required extensions
RUN install-php-extensions apcu calendar igbinary pcntl zip http pdo_mysql mysqli gd opcache

# Configure opcache
ADD docker/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Install Composer from image
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

### BACKEND LOCAL
FROM api-base AS api-local

# Setup entrypoint
COPY docker/local/docker-entrypoint /usr/local/bin/backend-entrypoint
RUN chmod +x /usr/local/bin/backend-entrypoint
ENTRYPOINT ["/usr/local/bin/backend-entrypoint"]
CMD ["php-fpm"]

### BACKEND PRODUCTION
FROM api-base as api-production

RUN pwd && ls
COPY --chown=www-data:www-data ../api .
RUN composer install --no-dev

# Setup entrypoint
COPY docker/production/docker-entrypoint /usr/local/bin/backend-entrypoint
RUN chmod +x /usr/local/bin/backend-entrypoint
ENTRYPOINT ["/usr/local/bin/backend-entrypoint"]

