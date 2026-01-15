# Les Mots
An app where the goal is to find all the french words with given 9 random letters

## Installation Guide
### Environment files
```bash
cp .env.example .env
```
Fill all `.env` variables with necessary values.

### Starting containers
You just have to run:
```bash
docker compose up -d
```

After your containers are running, you may connect into the container `app` through:
```bash
docker compose exec app bash
```

### Database migrations
You must run inside the container:
```bash
node ace migration:run
```

## Development
### Linter
In `app` container, run:
```bash
npm run lint
```

### Type checking
In `app` container, run:
```bash
npm run typecheck
```

### Running tests
In `app` container, run:
```bash
npm run test
```

## Commands
### Create Words Pool
To create words pools, use the command:
```bash
node ace create:words-pool --day=YYYY-MM-DD
```
By default, the words pool will be generated for two days after the current day.
With the option `--day`, you can specify the exact day for which you want the words pool to be generated, in the format `YYYY-MM-DD`.
