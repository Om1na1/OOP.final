#!/bin/bash

# API Testing script for Library Management System

BASE_URL="http://localhost:8080"

echo "=== Library Management System API Tests ==="
echo ""

# Test 1: Register Admin User
echo "1. Registering admin user..."
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@library.com",
    "password": "admin123",
    "role": ["admin"]
  }')
echo "Response: $ADMIN_RESPONSE"
echo ""

# Test 2: Register Librarian
echo "2. Registering librarian..."
LIBRARIAN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "librarian",
    "email": "librarian@library.com",
    "password": "librarian123",
    "role": ["librarian"]
  }')
echo "Response: $LIBRARIAN_RESPONSE"
echo ""

# Test 3: Register Member
echo "3. Registering member..."
MEMBER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "member",
    "email": "member@library.com",
    "password": "member123",
    "role": ["member"]
  }')
echo "Response: $MEMBER_RESPONSE"
echo ""

# Test 4: Login as Admin
echo "4. Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }')
echo "Response: $LOGIN_RESPONSE"
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: ${TOKEN:0:50}..."
echo ""

# Test 5: Create a Book
echo "5. Creating a book..."
BOOK_RESPONSE=$(curl -s -X POST "$BASE_URL/api/books" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Spring Boot in Action",
    "author": "Craig Walls",
    "isbn": "978-1617292545",
    "totalCopies": 5,
    "category": "Technology"
  }')
echo "Response: $BOOK_RESPONSE"
echo ""

# Test 6: Get All Books
echo "6. Getting all books..."
BOOKS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/books")
echo "Response: $BOOKS_RESPONSE"
echo ""

# Test 7: Create a Member
echo "7. Creating a member..."
MEMBER_CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/members" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "dateOfBirth": "1990-01-01"
  }')
echo "Response: $MEMBER_CREATE_RESPONSE"
echo ""

# Test 8: Get Overdue Books Report
echo "8. Getting overdue books report..."
OVERDUE_RESPONSE=$(curl -s -X GET "$BASE_URL/api/reports/overdue" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $OVERDUE_RESPONSE"
echo ""

echo "=== API Tests Complete ==="

