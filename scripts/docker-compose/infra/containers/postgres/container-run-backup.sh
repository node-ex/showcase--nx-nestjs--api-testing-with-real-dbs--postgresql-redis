#!/usr/bin/env bash

set -e

POSTGRES_DOCKER_IMAGE_NAME="postgres:16.3-alpine3.20"
NETWORK="showcase--api-tests-with-real-dbs--network--default"
HOST="showcase--api-tests-with-real-dbs--postgres"
PORT="5432"
USERNAME="postgres"
PASSWORD="postgres"
DATABASE="postgres"
BACKUP_FOLDER="./backups/db"
BACKUP_FILE_NAME="backup_db_postgres_$(date +%F_%H-%M-%S).sql"
BACKUP_FILE_PATH="${BACKUP_FOLDER}/${BACKUP_FILE_NAME}"

mkdir -p "$BACKUP_FOLDER"

echo "Backing up PostgreSQL database: ${DATABASE}"
docker container run \
    --rm \
    --tty \
    --interactive \
    --network "$NETWORK" \
    --env PGPASSWORD="$PASSWORD" \
    $POSTGRES_DOCKER_IMAGE_NAME \
    pg_dump \
    --host "$HOST" \
    --port "$PORT" \
    --username "$USERNAME" \
    "$DATABASE" >"$BACKUP_FILE_PATH"

echo "Backup completed successfully and saved to: ${BACKUP_FILE_PATH}"
