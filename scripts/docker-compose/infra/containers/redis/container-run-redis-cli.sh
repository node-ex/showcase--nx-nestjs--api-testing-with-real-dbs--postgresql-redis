#!/usr/bin/env bash

set -e

docker container run \
    --rm \
    --tty \
    --interactive \
    --network showcase--api-tests-with-real-dbs--network--default \
    redis:7.4.0-alpine3.20 \
        redis-cli \
            -h showcase--api-tests-with-real-dbs--redis \
            -p 6379
