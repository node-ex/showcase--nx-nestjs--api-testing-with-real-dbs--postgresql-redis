#!/usr/bin/env bash

set -e

./scripts/docker-compose/infra/services-up.sh --detach $@

POSTGRES_CONTAINER_NAME="showcase--api-tests-with-real-dbs--postgres"

while [ "$(docker inspect --format='{{.State.Health.Status}}' "$POSTGRES_CONTAINER_NAME")" != "healthy" ]; do
    sleep 5
done

npm run typeorm-ds -- migration:run
