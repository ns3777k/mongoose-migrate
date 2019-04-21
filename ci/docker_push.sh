#!/usr/bin/env bash

IMAGE="ns3777k/mongoose-migrate:${TRAVIS_TAG}"
echo $IMAGE

#echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
#docker push
