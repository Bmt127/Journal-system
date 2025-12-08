#!/bin/bash

REG="registry.cloud.cbh.kth.se/bemnet"

services=(
  "search-service"
  "image-service"
  "journal-service"
  "message-service"
  "user-service"
)

echo "== Building backend microservices =="

for srv in "${services[@]}"; do
  echo "Building: $srv"
  cd $srv

  if [ -f "pom.xml" ]; then
    ./mvnw package -DskipTests
  fi

  docker build -t $REG/$srv:latest .

  docker push $REG/$srv:latest

  cd ..
  echo "Done: $srv"
done

echo "== All backend services built and pushed =="

