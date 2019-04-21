#!/usr/bin/env bash

PROJECT="mongoose-migrate"
IMAGE="ns3777k/${PROJECT}"
TAG="${TRAVIS_TAG}"

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker tag "${PROJECT}" "${IMAGE}:${TAG}"
docker push "${IMAGE}:${TAG}"

docker tag "${PROJECT}" "${IMAGE}:latest"
docker push "${IMAGE}:latest"
