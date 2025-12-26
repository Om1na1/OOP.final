#!/bin/bash

echo "=========================================="
echo "Starting Library Management System"
echo "=========================================="

# Check if PostgreSQL is running
echo "Checking PostgreSQL..."
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "⚠️  PostgreSQL is not running. Please start it first:"
    echo "   sudo systemctl start postgresql"
    exit 1
fi

# Check if database exists
echo "Checking database..."
DB_EXISTS=$(PGPASSWORD=postgres psql -h localhost -U postgres -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='library_db'" 2>/dev/null)

if [ "$DB_EXISTS" != "1" ]; then
    echo "⚠️  Database 'library_db' does not exist. Creating it..."
    PGPASSWORD=postgres psql -h localhost -U postgres -c "CREATE DATABASE library_db;" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Database created successfully"
    else
        echo "❌ Failed to create database. Please create it manually:"
        echo "   sudo -u postgres psql"
        echo "   CREATE DATABASE library_db;"
        echo "   \\q"
        exit 1
    fi
else
    echo "✅ Database exists"
fi

# Start backend
echo ""
echo "Starting Backend (Spring Boot)..."
cd "$(dirname "$0")"
./mvnw spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend starting (PID: $BACKEND_PID)"
echo "Logs: tail -f backend.log"

# Wait for backend to start
echo "Waiting for backend to start..."
for i in {1..30}; do
    if curl -s http://localhost:8080/api/books > /dev/null 2>&1; then
        echo "✅ Backend is running on http://localhost:8080"
        break
    fi
    sleep 2
done

# Start frontend
echo ""
echo "Starting Frontend (React)..."
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install --legacy-peer-deps
fi

echo "Starting React development server..."
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend starting (PID: $FRONTEND_PID)"
echo "Logs: tail -f frontend.log"

echo ""
echo "=========================================="
echo "✅ Services are starting!"
echo "=========================================="
echo "Backend:  http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo ""
echo "To stop services:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "To view logs:"
echo "  tail -f backend.log"
echo "  tail -f frontend.log"

