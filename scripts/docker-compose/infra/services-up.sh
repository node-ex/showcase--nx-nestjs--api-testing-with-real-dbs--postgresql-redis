#!/usr/bin/env bash

set -e

docker compose \
    --file docker-compose.infra.yaml \
    up \
    $@
