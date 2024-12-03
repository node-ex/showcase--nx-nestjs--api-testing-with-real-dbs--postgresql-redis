#!/usr/bin/env bash

set -e

docker container exec \
  --interactive \
  --tty \
  showcase--api-tests-with-real-dbs--redis \
  sh
