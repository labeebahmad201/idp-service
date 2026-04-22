# IdP Service (NestJS)

Identity Provider service scaffolded with NestJS.

Current scope in this commit:

- NestJS project bootstrap
- Base app module/controller/service
- Test scaffolding and lint/format config

Planned next scope:

- User table and migrations
- Signup endpoint
- Internal authentication and claims endpoints for the Authorization Server

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 14+

## Install

```bash
npm install
```

## Run

```bash
# copy env defaults and adjust as needed
cp .env.example .env
# DB_SYNC defaults to false (recommended)
# set DB_SYNC=true only for local schema auto-sync during development

# development
npm run start:dev

# production mode
npm run start:prod
```

## API docs

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs-json`

## Test

```bash
npm run test
npm run test:e2e
```
