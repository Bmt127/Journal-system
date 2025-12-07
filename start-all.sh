#!/bin/bash

GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"

echo -e "${GREEN}Starting ALL microservices...${NC}"

mkdir -p logs
rm -f pids.txt

# Start user-service
echo -e "${YELLOW}Starting user-service on port 8091...${NC}"
(
  cd user-service || exit
  mvn spring-boot:run > ../logs/user.log 2>&1 &
  echo $! >> ../pids.txt
)

# Start message-service
echo -e "${YELLOW}Starting message-service on port 8082...${NC}"
(
  cd message-service || exit
  mvn spring-boot:run > ../logs/message.log 2>&1 &
  echo $! >> ../pids.txt
)

# Start journal-service
echo -e "${YELLOW}Starting journal-service on port 8084...${NC}"
(
  cd journal-service || exit
  mvn spring-boot:run > ../logs/journal.log 2>&1 &
  echo $! >> ../pids.txt
)

# Start search-service (Quarkus)
echo -e "${YELLOW}Starting search-service (Quarkus) on port 8086...${NC}"
(
  cd search-service || exit
  ./mvnw quarkus:dev > ../logs/search.log 2>&1 &
  echo $! >> ../pids.txt
)

# Start image-service
echo -e "${YELLOW}Starting image-service on port 3001...${NC}"
IMAGE_SERVICE_PATH="image-service/src/server.js"

if [ -f "$IMAGE_SERVICE_PATH" ]; then
  node "$IMAGE_SERVICE_PATH" > logs/image.log 2>&1 &
  echo $! >> pids.txt
else
  echo -e "${RED}ERROR: $IMAGE_SERVICE_PATH not found${NC}"
fi

echo -e "${GREEN}All services started!${NC}"
echo "Logs available in logs/"
