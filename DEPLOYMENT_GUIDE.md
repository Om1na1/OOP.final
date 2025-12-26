# Deployment Guide for Library Management System

This guide covers multiple deployment options for your Spring Boot + React application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Option 1: Deploy to Render (Recommended - Free Tier Available)](#option-1-deploy-to-render)
3. [Option 2: Deploy to Railway](#option-2-deploy-to-railway)
4. [Option 3: Deploy to Heroku](#option-3-deploy-to-heroku)
5. [Option 4: Docker Deployment (Self-Hosted)](#option-4-docker-deployment)
6. [Option 5: Traditional VPS Deployment](#option-5-traditional-vps-deployment)

---

## Prerequisites

- Git repository (you're already pushing to GitHub)
- PostgreSQL database (will be provided by hosting platforms)
- Java 17 runtime
- Node.js for building the frontend

---

## Option 1: Deploy to Render (Recommended - Free Tier Available)

Render offers free hosting for web services and PostgreSQL databases.

### Step 1: Prepare Your Application

1. **Create a build script** that builds both frontend and backend:

Create `build.sh` in your project root:
```bash
#!/bin/bash
# Build frontend
cd frontend
npm install
npm run build
cd ..

# Copy frontend build to Spring Boot static resources
mkdir -p src/main/resources/static
cp -r frontend/build/* src/main/resources/static/

# Build backend
./mvnw clean package -DskipTests
```

2. **Create a start script** `start.sh`:
```bash
#!/bin/bash
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

### Step 2: Configure application.properties

Update `src/main/resources/application.properties` to use environment variables:
```properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
server.port=${PORT:8080}
```

### Step 3: Deploy to Render

1. Go to [render.com](https://render.com) and sign up
2. Create a new **PostgreSQL** database:
   - Click "New +" → "PostgreSQL"
   - Choose a name (e.g., `library-db`)
   - Select free tier
   - Note the connection details

3. Create a new **Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: library-management-system
     - **Environment**: Docker or Native
     - **Build Command**: `chmod +x build.sh && ./build.sh`
     - **Start Command**: `java -jar target/demo-0.0.1-SNAPSHOT.jar`
     - **Instance Type**: Free

4. Add environment variables:
   - `DATABASE_URL`: (from your PostgreSQL database)
   - `DB_USERNAME`: (from your PostgreSQL database)
   - `DB_PASSWORD`: (from your PostgreSQL database)
   - `JWT_SECRET`: (generate a secure random string)

5. Deploy! Render will automatically build and deploy your app.

---

## Option 2: Deploy to Railway

Railway offers a generous free tier and simple deployment.

### Steps:

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add a PostgreSQL database:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

5. Configure environment variables in Railway dashboard:
   - `JWT_SECRET`: your-secret-key
   - Railway auto-provides `DATABASE_URL`

6. Add a `Procfile` to your project root:
```
web: java -jar target/demo-0.0.1-SNAPSHOT.jar
```

7. Railway will auto-detect and deploy your Spring Boot app

---

## Option 3: Deploy to Heroku

### Steps:

1. Install Heroku CLI: `curl https://cli-assets.heroku.com/install.sh | sh`
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Add PostgreSQL: `heroku addons:create heroku-postgresql:mini`
5. Set environment variables:
```bash
heroku config:set JWT_SECRET=your-secret-key
```

6. Create `Procfile`:
```
web: java -jar target/demo-0.0.1-SNAPSHOT.jar
```

7. Deploy:
```bash
git push heroku main
```

---

## Option 4: Docker Deployment

### Create Dockerfile for Backend

Create `Dockerfile` in project root:
```dockerfile
# Multi-stage build
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM maven:3.8-openjdk-17 AS backend-build
WORKDIR /app
COPY pom.xml ./
COPY src ./src
COPY --from=frontend-build /app/frontend/build ./src/main/resources/static
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=backend-build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: library_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/library_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      JWT_SECRET: your-secret-key-here
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### Deploy with Docker:

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Option 5: Traditional VPS Deployment

If you have a VPS (DigitalOcean, AWS EC2, Linode, etc.):

### 1. Install Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 17
sudo apt install openjdk-17-jdk -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install Nginx (for reverse proxy)
sudo apt install nginx -y
```

### 2. Setup PostgreSQL

```bash
sudo -u postgres psql
CREATE DATABASE library_db;
CREATE USER library_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE library_db TO library_user;
\q
```

### 3. Deploy Application

```bash
# Clone your repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Copy frontend to static resources
mkdir -p src/main/resources/static
cp -r frontend/build/* src/main/resources/static/

# Build backend
./mvnw clean package -DskipTests

# Run application (use systemd for production)
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

### 4. Configure Nginx as Reverse Proxy

Create `/etc/nginx/sites-available/library-app`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/library-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Create Systemd Service

Create `/etc/systemd/system/library-app.service`:

```ini
[Unit]
Description=Library Management System
After=syslog.target network.target

[Service]
User=your-user
WorkingDirectory=/path/to/your-repo
ExecStart=/usr/bin/java -jar /path/to/your-repo/target/demo-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
Restart=always
RestartSec=10

Environment="SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/library_db"
Environment="SPRING_DATASOURCE_USERNAME=library_user"
Environment="SPRING_DATASOURCE_PASSWORD=your_password"
Environment="JWT_SECRET=your-secret-key"

[Install]
WantedBy=multi-user.target
```

Start service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable library-app
sudo systemctl start library-app
sudo systemctl status library-app
```

---

## Important Configuration Notes

### CORS Configuration
Make sure your `CorsConfig.java` allows your production domain:

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "https://your-production-domain.com"
));
```

### Environment Variables Needed

- `DATABASE_URL` or separate `DB_HOST`, `DB_PORT`, `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET` (generate with: `openssl rand -base64 32`)
- `PORT` (optional, defaults to 8080)

### Frontend API Configuration

Update your frontend API base URL for production. In your React app, use environment variables:

Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://your-backend-url.com
```

Update axios configuration to use `process.env.REACT_APP_API_URL`

---

## Recommended Quick Start: Render

For the easiest deployment, I recommend **Render** because:
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Easy PostgreSQL setup
- ✅ GitHub integration
- ✅ Auto-deploy on push

Would you like me to help you set up deployment for a specific platform?
