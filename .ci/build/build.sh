#!/bin/bash
cd .ci
sudo docker build -t $image_name:$tag --build-arg -f $docker_path/build.Dockerfile ../
sudo docker logout registry.gitlab.com
echo "$CI_REGISTRY_PW" | sudo docker login registry.gitlab.com -u "$CI_REGISTRY_USER" --password-stdin
sudo docker images
sudo docker push $image_name:$tag
