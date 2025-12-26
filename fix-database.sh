#!/bin/bash

echo "=========================================="
echo "Fixing PostgreSQL Database Configuration"
echo "=========================================="

# Method 1: Try to set password using sudo
echo "Attempting to set PostgreSQL password..."
sudo -u postgres psql <<EOF 2>/dev/null
ALTER USER postgres WITH PASSWORD 'postgres';
\q
EOF

if [ $? -eq 0 ]; then
    echo "✅ Password set successfully"
else
    echo "⚠️  Could not set password automatically"
    echo ""
    echo "Please run these commands manually:"
    echo "  sudo -u postgres psql"
    echo "  ALTER USER postgres WITH PASSWORD 'postgres';"
    echo "  \\q"
fi

# Create database
echo ""
echo "Creating database..."
sudo -u postgres psql <<EOF 2>/dev/null
CREATE DATABASE library_db;
GRANT ALL PRIVILEGES ON DATABASE library_db TO postgres;
\q
EOF

if [ $? -eq 0 ]; then
    echo "✅ Database created successfully"
else
    echo "⚠️  Database may already exist or creation failed"
    echo ""
    echo "Please run these commands manually:"
    echo "  sudo -u postgres psql"
    echo "  CREATE DATABASE library_db;"
    echo "  GRANT ALL PRIVILEGES ON DATABASE library_db TO postgres;"
    echo "  \\q"
fi

echo ""
echo "=========================================="
echo "Testing connection..."
echo "=========================================="

PGPASSWORD=postgres psql -h localhost -U postgres -d library_db -c "SELECT 1;" 2>&1 | head -3

if [ $? -eq 0 ]; then
    echo "✅ Database connection successful!"
    echo ""
    echo "You can now start the Spring Boot application:"
    echo "  ./mvnw spring-boot:run"
else
    echo "❌ Connection failed. Please check:"
    echo "  1. PostgreSQL is running: sudo systemctl status postgresql"
    echo "  2. Password is correct in application.properties"
    echo "  3. Database 'library_db' exists"
fi

