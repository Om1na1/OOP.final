# Library Management System

A comprehensive Spring Boot REST API for managing library operations including books, members, and transactions.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Role-Based Access**: Three roles - Admin, Librarian, and Member
- **Book Management**: CRUD operations for books with search functionality
- **Member Management**: CRUD operations for library members
- **Transaction Management**: Track book borrow and return dates
- **Overdue Reports**: Generate reports of overdue books

## Technology Stack

- Spring Boot 4.0.1
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL
- Maven

## Prerequisites

- Java 17 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher

## Database Setup

1. Install PostgreSQL if not already installed:
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

2. Start PostgreSQL service:
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

3. Create database and user (run the setup script or manually):
```bash
# Option 1: Run the setup script (requires sudo)
./setup-database.sh

# Option 2: Manual setup
sudo -u postgres psql
CREATE DATABASE library_db;
ALTER USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE library_db TO postgres;
\c library_db
GRANT ALL ON SCHEMA public TO postgres;
\q
```

4. Update `application.properties` if your PostgreSQL credentials are different:
   - Default: `username=postgres`, `password=postgres`, `database=library_db`

## Installation & Running

1. Clone the repository:
```bash
git clone <repository-url>
cd demo
```

2. Build the project:
```bash
./mvnw clean install
```

3. Run the application:
```bash
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login and get JWT token

### Books (Public)
- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get book by ID
- `GET /api/books/search?keyword={keyword}` - Search books
- `GET /api/books/category/{category}` - Get books by category

### Books (Admin/Librarian only)
- `POST /api/books` - Create a new book
- `PUT /api/books/{id}` - Update a book
- `DELETE /api/books/{id}` - Delete a book

### Members (Admin/Librarian only)
- `GET /api/members` - Get all members
- `GET /api/members/{id}` - Get member by ID
- `POST /api/members` - Create a new member
- `PUT /api/members/{id}` - Update a member
- `DELETE /api/members/{id}` - Delete a member

### Transactions (Admin/Librarian/Member)
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/{id}` - Get transaction by ID
- `POST /api/transactions/borrow?bookId={id}&memberId={id}` - Borrow a book
- `POST /api/transactions/return/{id}` - Return a book
- `GET /api/transactions/member/{memberId}` - Get transactions by member
- `GET /api/transactions/member/{memberId}/active` - Get active borrows by member

### Reports (Admin/Librarian only)
- `GET /api/reports/overdue` - Get overdue books report

## Usage Examples

### 1. Register a new user
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

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 3. Create a book (requires authentication)
```bash
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Spring Boot in Action",
    "author": "Craig Walls",
    "isbn": "978-1617292545",
    "totalCopies": 5,
    "category": "Technology"
  }'
```

### 4. Borrow a book
```bash
curl -X POST "http://localhost:8080/api/transactions/borrow?bookId=1&memberId=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing

Run tests with:
```bash
./mvnw test
```

## Project Structure

```
src/
├── main/
│   ├── java/com/example/demo/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── model/           # Entity models
│   │   ├── repository/      # JPA repositories
│   │   ├── security/        # Security configuration
│   │   └── service/         # Business logic
│   └── resources/
│       └── application.properties
└── test/
```

## License

This project is for educational purposes.

