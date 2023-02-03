# Les Mots
An app where the goal is to find all the french words with given 9 random letters

## Installation Guide

### Environment files
 
`cp .env.example .env`
Fill all `.env` variables with necessary values.

### Starting containers

You just have to run :
`docker-compose up -d`

After your containers are running, you may connect into the container `api` through :  
`docker-compose exec api bash`

#### Key generate

You must run inside the container :  
`php artisan key:generate`