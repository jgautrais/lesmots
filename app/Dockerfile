# syntax=docker/dockerfile:1

# Base Node.js image
FROM node:22-slim AS base

RUN apt-get update && apt-get install -y \
    supervisor \
    nginx \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# -------------------------------------------
# Install stage - install dependencies
# -------------------------------------------
FROM base AS install

COPY package.json package-lock.json ./
RUN npm ci

# -------------------------------------------
# Local development target
# -------------------------------------------
FROM install AS local

COPY . .

EXPOSE 80 5173

# Local nginx and supervisor config with Vite dev server
COPY docker/nginx.local.conf /etc/nginx/sites-available/default
COPY docker/supervisord.local.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

# -------------------------------------------
# Build stage - build for production
# -------------------------------------------
FROM install AS build

COPY . .

RUN npm run build

# -------------------------------------------
# Production release target
# -------------------------------------------
FROM base AS release

COPY --from=build /var/www/html/build /var/www/html/build
COPY --from=build /var/www/html/node_modules /var/www/html/node_modules
COPY --from=build /var/www/html/package.json /var/www/html/package.json

# Copy nginx and supervisor production config
COPY docker/nginx.conf /etc/nginx/sites-available/default
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN chown -R node:node /var/www/html

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
