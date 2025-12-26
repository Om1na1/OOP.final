# Multi-stage build for Spring Boot + React application
# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY pom.xml ./
COPY src ./src
# Copy frontend build to static resources
COPY --from=frontend-build /app/frontend/build ./src/main/resources/static
RUN mvn clean package -DskipTests

# Stage 3: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

# Expose port (Render will set PORT env variable)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
