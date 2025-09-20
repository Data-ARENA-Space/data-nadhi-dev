# Base Node.js devcontainer
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:20

# Install CLI tools for Postgres + Redis
RUN apt-get update && apt-get install -y postgresql-client redis-tools && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /workspaces/data-nadhi-dev