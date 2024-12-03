#!/usr/bin/env bash

set -e

docker container run \
  --name temp--redis \
  --rm \
  --init \
  --detach \
  --publish host_ip=0.0.0.0,published=6381,target=6379 \
  redis:7.4.0-alpine3.20
