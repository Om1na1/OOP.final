# Complete Setup Guide - Library Management System

## Project Structure

```
demo/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── package.json
├── src/                  # Spring Boot backend
│   └── main/java/com/example/demo/
│       ├── config/       # Configuration classes
│       ├── controller/  # REST controllers
│       ├── model/        # Entity models
│       ├── repository/   # JPA repositories
│       ├── security/     # Security configuration
│       └── service/      # Business logic
└── pom.xml
```

## Complete Setup Instructions

### Step 1: Database Setup

1. **Install PostgreSQL** (if not installed):
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

2. **Create Database**:
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

### Step 2: Backend Setup

1. **Build the backend**:
```bash
./mvnw clean package -DskipTests
```

2. **Start the backend**:
```bash
./mvnw spring-boot:run
```

Backend will run on: http://localhost:8080

### Step 3: Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the frontend**:
```bash
npm start
```

Frontend will run on: http://localhost:3000

## Testing the Complete System

### 1. Create Test Users

**Admin User:**
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

**Librarian:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "librarian",
    "email": "librarian@library.com",
    "password": "librarian123",
    "role": ["librarian"]
  }'
```

**Member:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "member",
    "email": "member@library.com",
    "password": "member123",
    "role": ["member"]
  }'
```

### 2. Test via Frontend

1. Open http://localhost:3000
2. Sign up or login with one of the test users
3. Test all features:
   - Browse and search books
   - Add/edit books (admin/librarian)
   - Manage members (admin/librarian)
   - Borrow/return books
   - View reports (admin/librarian)

## Features Implemented

### Backend (Spring Boot)
- ✅ User authentication with JWT
- ✅ Role-based access control (Admin, Librarian, Member)
- ✅ CRUD operations for Books
- ✅ CRUD operations for Members
- ✅ Transaction management (Borrow/Return)
- ✅ Overdue books tracking
- ✅ Reports generation
- ✅ CORS configuration for frontend

### Frontend (React)
- ✅ User authentication (Login/Signup)
- ✅ Book browsing and search
- ✅ Book management (Add/Edit/Delete)
- ✅ Member management
- ✅ Transaction management
- ✅ Reports viewing
- ✅ Role-based UI access
- ✅ Responsive design

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login

### Books
- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get book by ID
- `GET /api/books/search?keyword={keyword}` - Search books
- `POST /api/books` - Create book (Admin/Librarian)
- `PUT /api/books/{id}` - Update book (Admin/Librarian)
- `DELETE /api/books/{id}` - Delete book (Admin/Librarian)

### Members
- `GET /api/members` - Get all members (Admin/Librarian)
- `GET /api/members/{id}` - Get member by ID
- `POST /api/members` - Create member
- `PUT /api/members/{id}` - Update member
- `DELETE /api/members/{id}` - Delete member

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions/borrow?bookId={id}&memberId={id}` - Borrow book
- `POST /api/transactions/return/{id}` - Return book
- `GET /api/transactions/member/{memberId}` - Get member transactions

### Reports
- `GET /api/reports/overdue` - Get overdue books (Admin/Librarian)

## Troubleshooting

### Backend Issues
- **Database connection error**: Check PostgreSQL is running and credentials are correct
- **Port 8080 in use**: Change port in `application.properties`
- **Compilation errors**: Run `./mvnw clean compile`

### Frontend Issues
- **npm install fails**: Check Node.js version (14+)
- **CORS errors**: Verify backend CORS configuration
- **API connection fails**: Check backend is running on port 8080

### Common Solutions
- Clear browser cache
- Restart both backend and frontend
- Check console logs for detailed errors
- Verify database is accessible

## Next Steps

1. **Deploy Backend**: Deploy to Heroku, AWS, or other hosting
2. **Deploy Frontend**: Deploy to Netlify, Vercel, or other hosting
3. **Add Features**: 
   - Email notifications
   - Advanced search filters
   - Export reports to PDF/Excel
   - Book reservations
   - Fine payment system

## Support

For issues or questions, check:
- Backend logs: Check console output when running `./mvnw spring-boot:run`
- Frontend logs: Check browser console (F12)
- Database logs: Check PostgreSQL logs

