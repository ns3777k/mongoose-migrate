#!/usr/bin/env bash

PROJECT="mongoose-migrate"
IMAGE="ns3777k/${PROJECT}"

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker tag "${PROJECT}" "${IMAGE}:${TRAVIS_TAG}"
docker push "${IMAGE}:${TRAVIS_TAG}"

docker tag "${PROJECT}" "${IMAGE}:latest"
docker push "${IMAGE}:latest"
