# Quick Start Guide

## Prerequisites Check
- ✅ Java 17 installed
- ✅ Maven installed (or use ./mvnw)
- ⚠️ PostgreSQL needs to be set up

## Step 1: Set Up PostgreSQL Database

Run the setup script (requires sudo):
```bash
./setup-database.sh
```

Or manually:
```bash
sudo -u postgres psql
CREATE DATABASE library_db;
ALTER USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE library_db TO postgres;
\c library_db
GRANT ALL ON SCHEMA public TO postgres;
\q
```

## Step 2: Start the Application

```bash
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`

## Step 3: Test the API

Once the application is running, you can test it with:

```bash
./test-api.sh
```

Or manually test endpoints:

### Register a user:
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@library.com",
    "password": "admin123",
    "role": ["admin"]
  }'
```

### Login:
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Save the token from the response and use it in subsequent requests.

### Create a book (requires authentication):
```bash
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Spring Boot in Action",
    "author": "Craig Walls",
    "isbn": "978-1617292545",
    "totalCopies": 5,
    "category": "Technology"
  }'
```

## Troubleshooting

### Database Connection Error
If you see database connection errors:
1. Make sure PostgreSQL is running: `sudo systemctl status postgresql`
2. Verify database exists: `sudo -u postgres psql -l | grep library_db`
3. Check credentials in `application.properties`

### Port Already in Use
If port 8080 is already in use, change it in `application.properties`:
```
server.port=8081
```

## Next Steps

1. Set up Git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Library Management System"
```

2. Deploy to a hosting platform (Heroku, AWS, etc.)

