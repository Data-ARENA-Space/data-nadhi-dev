# data-nadhi-dev

Dev Setup for local development with MongoDB and PostgreSQL databases.

## Prerequisites

- Docker and Docker Compose
- Node.js
- VS Code with Dev Containers extension

## Services

The development environment requires these services running on your host machine:

- MongoDB (v7) - Managed via docker-compose
- PostgreSQL (v16) - Managed via docker-compose
- Redis (v7) - Managed via docker-compose

The dev container will connect to these services through the Docker network `datanadhi-net`. The services must be started using docker-compose on your host machine before launching the dev container.

## Getting Started

1. Clone the repository:
   ```bash
   git clone git@github.com:Data-ARENA-Space/data-nadhi-dev.git
   cd data-nadhi-dev
   ```

2. Start the database services from your host machine:
   ```bash
   docker-compose up -d
   ```
   This will start MongoDB, PostgreSQL, and Redis services. These must be started from your host machine, not from within the dev container.

3. Open in VS Code with Dev Containers:
   - Open VS Code
   - Install the "Dev Containers" extension if you haven't already
   - Open the command palette (F1 or Ctrl/Cmd + Shift + P)
   - Select "Dev Containers: Open Folder in Container"
   - Select the cloned repository folder

4. Install dependencies:
   ```bash
   npm install
   ```

Note: The database services (MongoDB, PostgreSQL, Redis) must be running on your host machine before starting the dev container. The dev container will connect to these services through the Docker network.

## Database Migrations

### PostgreSQL Migrations

- Run migrations:
  ```bash
  npm run pg:migrate
  ```

- Rollback last migration:
  ```bash
  npm run pg:rollback
  ```

- Rollback all migrations:
  ```bash
  npm run pg:rollback:all
  ```

### MongoDB Migrations

- Run migrations:
  ```bash
  npm run mongo:migrate:up
  ```

- Rollback migrations:
  ```bash
  npm run mongo:migrate:down
  ```

## Database Connections

When connecting to databases from within the dev container:

- MongoDB: `mongodb://mongo:27017`
- PostgreSQL: `postgresql://postgres:postgres@postgres:5432/datanadhi_dev`
- Redis: `redis://redis:6379`

## Project Structure

```
├── docker-compose.yml      # Docker services configuration
├── scripts/
│   ├── init-mongo.js      # MongoDB initialization script
│   ├── init-pg.js         # PostgreSQL initialization script
│   └── run-pg-migrations-new.js  # PostgreSQL migration runner
├── mongo-migrations/       # MongoDB migration files
├── pg-migrations/         # PostgreSQL migration files (.up.sql & .down.sql)
└── package.json
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Create a pull request

## License

TBD