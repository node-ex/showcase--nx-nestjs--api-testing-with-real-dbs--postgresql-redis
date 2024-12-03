#!/usr/bin/env bash

set -e

docker container run \
    --rm \
    --tty \
    --interactive \
    --env PGPASSWORD=postgres \
    --network showcase--api-tests-with-real-dbs--network--default \
    postgres:16.3-alpine3.20 \
    psql \
    --host showcase--api-tests-with-real-dbs--postgres \
    --port 5432 \
    --username postgres \
    --dbname postgres
