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

### Key generate
You must run inside the container :  
`php artisan key:generate`

## API
### Linter
In `api` container, run `pint`

### Code Analysis
In `api` container, run `composer phpstan`, config file is in `phpstan.neon`

### Authentification
Create OAuth client with  following command: `php artisan passport:client --client`

Make POST request to `oauth/token` endpoint with following body:
```json
{
    "grant_type": "client_credentials",
    "client_id": "client-id",
    "client_secret": "client-secret"
}
```
Use OAuth token for further requests

### Create Words Pool
To create words pools, use the command `php artisan create:wordsPool {--day=}`  
By default, the words pool will be generated for two days after the current day.  
With the option `day`, you can specify the exact day for which you want the words pool to be generated, in the format `YYYY-MM-DD`.