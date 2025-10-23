# Data Nadhi Dev

Development infrastructure for Data Nadhi.

## Description

This repository contains the complete development environment setup including:
- Docker Compose configuration for all Data Nadhi services (MongoDB, PostgreSQL, Redis, MinIO, Temporal)
- Database migration scripts for MongoDB and PostgreSQL
- Service initialization scripts
- Sample data for testing

## Dev Container

This repository includes a dev container configuration with all required dependencies pre-configured.

**To use:**
1. Open the repository in VS Code
2. Click "Reopen in Container" when prompted
3. All development tools will be available

## Starting Services

```bash
docker-compose up -d
```

This starts all required services: MongoDB, PostgreSQL, Redis, MinIO, Temporal, and their UIs.

## Database Migrations

```bash
# MongoDB migrations
npm run mongo:migrate:up

# PostgreSQL migrations
npm run pg:migrate
```

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
