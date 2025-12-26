#!/bin/bash
set -e

echo "========================================="
echo "Building Library Management System"
echo "========================================="

# Set up Java 17 environment for Render
echo "Setting up Java environment..."
export JAVA_HOME=/opt/render/project/.render/java/jdk-17
export PATH=$JAVA_HOME/bin:$PATH

# Verify Java version
echo "Java version:"
java -version

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
