#!/bin/bash
set -e

echo "========================================="
echo "Building Library Management System"
echo "========================================="

# Build frontend
echo "Step 1: Building React frontend..."
cd frontend
npm install
npm run build
cd ..

# Copy frontend build to Spring Boot static resources
echo "Step 2: Copying frontend build to static resources..."
mkdir -p src/main/resources/static
cp -r frontend/build/* src/main/resources/static/

# Build backend with Maven
echo "Step 3: Building Spring Boot backend..."
./mvnw clean package -DskipTests

echo "========================================="
echo "Build completed successfully!"
echo "========================================="
