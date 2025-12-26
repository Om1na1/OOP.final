# Quick Fix for PostgreSQL Password Error

## The Problem
Your Spring Boot app is trying to connect with password "postgres" but your PostgreSQL has a different password.

## Solution: Update application.properties

You have two options:

### Option 1: Find Your PostgreSQL Password

Try connecting to PostgreSQL to see what password works:

```bash
# Try connecting (it will prompt for password)
psql -U postgres -h localhost

# Or try common passwords:
# - (empty/no password)
# - postgres
# - your system password
```

### Option 2: Set PostgreSQL Password to "postgres"

Run this in your terminal (you'll need sudo password):

```bash
sudo -u postgres psql
```

Then in PostgreSQL:
```sql
ALTER USER postgres WITH PASSWORD 'postgres';
\q
```

### Option 3: Update application.properties

Edit `src/main/resources/application.properties` and change line 6:

**Current:**
```properties
spring.datasource.password=postgres
```

**Change to your actual password:**
```properties
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

### Option 4: Use Environment Variable (No File Changes)

You can override the password without changing the file:

```bash
export SPRING_DATASOURCE_PASSWORD=your_actual_password
./mvnw spring-boot:run
```

## After Fixing

1. Make sure the database exists:
```bash
sudo -u postgres psql -c "CREATE DATABASE library_db;" 2>/dev/null || echo "Database may already exist"
```

2. Test connection:
```bash
PGPASSWORD=your_password psql -h localhost -U postgres -d library_db -c "SELECT 1;"
```

3. Start Spring Boot:
```bash
./mvnw spring-boot:run
```

