#!/bin/bash

services=("user-service" "journal-service" "message-service" "search-service" "image-service" "frontend")

for s in "${services[@]}"; do
  echo "Skapar $s/Dockerfile.cloud"

  case $s in

    frontend)
      cat << 'DOCKER' > $s/Dockerfile.cloud
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["serve","-s","dist","-l","8080"]
DOCKER
    ;;

    search-service)
      cat << 'DOCKER' > $s/Dockerfile.cloud
FROM quay.io/quarkus/ubi-quarkus-mandrel-builder-image:23.1-java21 AS build
WORKDIR /workspace
COPY mvnw mvnw
COPY .mvn .mvn
COPY pom.xml .
COPY src src
RUN chmod +x mvnw
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/target/quarkus-app/ ./
EXPOSE 8080
CMD ["java","-jar","quarkus-run.jar"]
DOCKER
    ;;

    *)
      cat << 'DOCKER' > $s/Dockerfile.cloud
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src ./src
RUN chmod +x mvnw
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
CMD ["java","-jar","app.jar"]
DOCKER
    ;;
  esac

done

echo "KLART! Alla Dockerfile.cloud är skapade."
