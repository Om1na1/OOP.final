# Database Connection Fix

## Problem
The error shows: `FATAL: password authentication failed for user "postgres"`

This means the password in `application.properties` doesn't match your PostgreSQL password.

## Solution Options

### Option 1: Set PostgreSQL Password to "postgres" (Recommended)

Run these commands in your terminal:

```bash
sudo -u postgres psql
```

Then in the PostgreSQL prompt:
```sql
ALTER USER postgres WITH PASSWORD 'postgres';
CREATE DATABASE library_db;
GRANT ALL PRIVILEGES ON DATABASE library_db TO postgres;
\c library_db
GRANT ALL ON SCHEMA public TO postgres;
\q
```

### Option 2: Update application.properties with Your Password

If you know your PostgreSQL password, update `src/main/resources/application.properties`:

```properties
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

### Option 3: Use Environment Variables

You can override the password using environment variables:

```bash
export SPRING_DATASOURCE_PASSWORD=your_password
./mvnw spring-boot:run
```

Or create a `.env` file (if using Spring Boot 2.4+):
```
SPRING_DATASOURCE_PASSWORD=your_password
```

### Option 4: Use Peer Authentication (Linux)

If you're on Linux and want to use peer authentication, you can modify `pg_hba.conf`:

1. Find `pg_hba.conf`:
```bash
sudo find /etc -name pg_hba.conf
# or
sudo find /var/lib -name pg_hba.conf
```

2. Edit it to use `peer` or `trust` for local connections:
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                peer
host    all             all             127.0.0.1/32            md5
```

3. Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

## Quick Fix Script

After setting the password, test the connection:

```bash
PGPASSWORD=postgres psql -h localhost -U postgres -d library_db -c "SELECT 1;"
```

If this works, your Spring Boot app should connect successfully.

## Verify Database Exists

Check if the database exists:
```bash
sudo -u postgres psql -l | grep library_db
```

If it doesn't exist, create it:
```bash
sudo -u postgres psql -c "CREATE DATABASE library_db;"
```

