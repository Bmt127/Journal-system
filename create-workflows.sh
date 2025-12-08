#!/bin/bash

mkdir -p .github/workflows

# Journal-service
cat > .github/workflows/journal.yml << 'EOF'
name: journal-ci

on:
  push:
    paths:
      - "journal-service/**"
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Login to KTH Cloud Registry
        uses: docker/login-action@v3
        with:
          registry: registry.cloud.cbh.kth.se
          username: ${{ secrets.JOURNAL_ROBOT_USER }}
          password: ${{ secrets.JOURNAL_ROBOT_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./journal-service
          file: ./journal-service/Dockerfile
          platforms: linux/amd64
          push: true
          tags: registry.cloud.cbh.kth.se/deploy-941d48d5-fec5-4da7-8181-72ab9f09a5fa/journal-silent-echo:latest
EOF


# User-service
cat > .github/workflows/user.yml << 'EOF'
name: user-ci

on:
  push:
    paths:
      - "user-service/**"
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Login to KTH Cloud Registry
        uses: docker/login-action@v3
        with:
          registry: registry.cloud.cbh.kth.se
          username: ${{ secrets.USER_ROBOT_USER }}
          password: ${{ secrets.USER_ROBOT_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./user-service
          file: ./user-service/Dockerfile
          platforms: linux/amd64
          push: true
          tags: registry.cloud.cbh.kth.se/deploy-941d48d5-fec5-4da7-8181-72ab9f09a5fa/user-hidden-arc:latest
EOF


# Search-service
cat > .github/workflows/search.yml << 'EOF'
name: search-ci

on:
  push:
    paths:
      - "search-service/**"
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Login to KTH Cloud Registry
        uses: docker/login-action@v3
        with:
          registry: registry.cloud.cbh.kth.se
          username: ${{ secrets.SEARCH_ROBOT_USER }}
          password: ${{ secrets.SEARCH_ROBOT_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./search-service
          file: ./search-service/Dockerfile
          platforms: linux/amd64
          push: true
          tags: registry.cloud.cbh.kth.se/deploy-941d48d5-fec5-4da7-8181-72ab9f09a5fa/search-rapid-spark:latest
EOF


# Message-service
cat > .github/workflows/message.yml << 'EOF'
name: message-ci

on:
  push:
    paths:
      - "message-service/**"
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Login to KTH Cloud Registry
        uses: docker/login-action@v3
        with:
          registry: registry.cloud.cbh.kth.se
          username: ${{ secrets.MESSAGE_ROBOT_USER }}
          password: ${{ secrets.MESSAGE_ROBOT_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./message-service
          file: ./message-service/Dockerfile
          platforms: linux/amd64
          push: true
          tags: registry.cloud.cbh.kth.se/deploy-941d48d5-fec5-4da7-8181-72ab9f09a5fa/message-velvet-stream:latest
EOF


# Image-service
cat > .github/workflows/image.yml << 'EOF'
name: image-ci

on:
  push:
    paths:
      - "image-service/**"
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Login to KTH Cloud Registry
        uses: docker/login-action@v3
        with:
          registry: registry.cloud.cbh.kth.se
          username: ${{ secrets.IMAGE_ROBOT_USER }}
          password: ${{ secrets.IMAGE_ROBOT_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./image-service
          file: ./image-service/Dockerfile
          platforms: linux/amd64
          push: true
          tags: registry.cloud.cbh.kth.se/deploy-941d48d5-fec5-4da7-8181-72ab9f09a5fa/image-dawn-lattice:latest
EOF


# Frontend
cat > .github/workflows/frontend.yml << 'EOF'
name: frontend-ci

on:
  push:
    paths:
      - "frontend/**"
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Login to KTH Cloud Registry
        uses: docker/login-action@v3
        with:
          registry: registry.cloud.cbh.kth.se
          username: ${{ secrets.FRONTEND_ROBOT_USER }}
          password: ${{ secrets.FRONTEND_ROBOT_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          file: ./frontend/Dockerfile
          platforms: linux/amd64
          push: true
          tags: registry.cloud.cbh.kth.se/deploy-941d48d5-fec5-4da7-8181-72ab9f09a5fa/frontend-lucid-garden:latest
EOF

echo "a	lla workflows är skapade i .github/workflows/"

