#!/bin/bash

# Database setup script for Library Management System

echo "Setting up PostgreSQL database for Library Management System..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Installing..."
    sudo apt-get update
    sudo apt-get install -y postgresql postgresql-contrib
fi

# Start PostgreSQL service
echo "Starting PostgreSQL service..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
echo "Creating database and user..."
sudo -u postgres psql <<EOF
-- Create database
CREATE DATABASE library_db;

-- Create user (if not exists)
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'postgres') THEN
        CREATE USER postgres WITH PASSWORD 'postgres';
    END IF;
END
\$\$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE library_db TO postgres;

-- Connect to database and grant schema privileges
\c library_db
GRANT ALL ON SCHEMA public TO postgres;

\q
EOF

echo "Database setup complete!"
echo "Database: library_db"
echo "User: postgres"
echo "Password: postgres"
echo ""
echo "You can now start the Spring Boot application with: ./mvnw spring-boot:run"

