# --- BUILD STAGE ---
FROM quay.io/quarkus/ubi-quarkus-mandrel-builder-image:23.1-java21 AS build
WORKDIR /workspace

COPY mvnw mvnw
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN ./mvnw -q -DskipTests package

# --- RUN STAGE ---
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /workspace/target/quarkus-app/ ./

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "quarkus-run.jar"]
