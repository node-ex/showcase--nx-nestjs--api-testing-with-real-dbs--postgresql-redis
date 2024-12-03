#!/usr/bin/env bash

set -e

# NOTE: Don't forget to set this to the correct backup file name
BACKUP_FILE_NAME="backup_db_postgres.sql"

POSTGRES_DOCKER_IMAGE_NAME="postgres:16.3-alpine3.20"
NETWORK="showcase--api-tests-with-real-dbs--network--default"
HOST="showcase--api-tests-with-real-dbs--postgres"
PORT="5432"
USERNAME="postgres"
PASSWORD="postgres"
DATABASE="postgres"
TEMPORARY_DATABASE="temp_restore"
BACKUP_FOLDER="./backups/db"
BACKUP_FILE_PATH="${BACKUP_FOLDER}/${BACKUP_FILE_NAME}"

if [ ! -f "$BACKUP_FILE_PATH" ]; then
    echo "Backup file '$BACKUP_FILE_PATH' does not exist. Exiting."
    exit 1
fi

echo "Creating the temporary database: ${TEMPORARY_DATABASE}"

docker container run \
    --rm \
    --tty \
    --interactive \
    --network "$NETWORK" \
    --env PGPASSWORD="$PASSWORD" \
    $POSTGRES_DOCKER_IMAGE_NAME \
    psql \
    --host "$HOST" \
    --port "$PORT" \
    --username "$USERNAME" \
    --command "CREATE DATABASE $TEMPORARY_DATABASE;"

echo "Dropping the database: ${DATABASE}"

docker container run \
    --rm \
    --tty \
    --interactive \
    --network "$NETWORK" \
    --env PGPASSWORD="$PASSWORD" \
    $POSTGRES_DOCKER_IMAGE_NAME \
    psql \
    --host "$HOST" \
    --port "$PORT" \
    --username "$USERNAME" \
    --dbname "$TEMPORARY_DATABASE" \
    --command "DROP DATABASE IF EXISTS ${DATABASE};"

echo "Creating the empty database: ${DATABASE}"

docker container run \
    --rm \
    --tty \
    --interactive \
    --network "$NETWORK" \
    --env PGPASSWORD="$PASSWORD" \
    $POSTGRES_DOCKER_IMAGE_NAME \
    psql \
    --host "$HOST" \
    --port "$PORT" \
    --username "$USERNAME" \
    --dbname "$TEMPORARY_DATABASE" \
    --command "CREATE DATABASE $DATABASE;"

echo "Dropping the temporary database: ${TEMPORARY_DATABASE}"

docker container run \
    --rm \
    --tty \
    --interactive \
    --network "$NETWORK" \
    --env PGPASSWORD="$PASSWORD" \
    $POSTGRES_DOCKER_IMAGE_NAME \
    psql \
    --host "$HOST" \
    --port "$PORT" \
    --username "$USERNAME" \
    --command "DROP DATABASE IF EXISTS ${TEMPORARY_DATABASE};"

echo "Restoring PostgreSQL database from backup file: ${BACKUP_FILE_PATH}"

docker container run \
    --rm \
    --interactive \
    --network "$NETWORK" \
    --env PGPASSWORD="$PASSWORD" \
    $POSTGRES_DOCKER_IMAGE_NAME \
    psql \
    --host "$HOST" \
    --port "$PORT" \
    --username "$USERNAME" \
    --dbname "$DATABASE" <"$BACKUP_FILE_PATH"

echo "Restore completed successfully from: ${BACKUP_FILE_PATH}"
