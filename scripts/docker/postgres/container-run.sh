#!/usr/bin/env bash

set -e

docker container run \
  --name temp--postgres \
  --rm \
  --init \
  --detach \
  --publish host_ip=0.0.0.0,published=5434,target=5432 \
  postgres:16.3-alpine3.20
