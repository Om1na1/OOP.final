# Frontend Setup Guide

## Quick Start

### 1. Install Dependencies

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

### 2. Start the Frontend

```bash
npm start
```

The React app will start on http://localhost:3000

### 3. Start the Backend

In a separate terminal, start the Spring Boot backend:

```bash
cd ..
./mvnw spring-boot:run
```

The backend will run on http://localhost:8080

## First Time Setup

### Backend Setup (if not done already)

1. Set up PostgreSQL database:
```bash
./setup-database.sh
```

2. Start the backend:
```bash
./mvnw spring-boot:run
```

### Frontend Setup

1. Install Node.js dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

## Testing the Application

1. **Register a new user:**
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Create an account (choose role: admin, librarian, or member)

2. **Login:**
   - Use your credentials to login

3. **Test Features:**
   - Browse books (public)
   - Add/edit books (admin/librarian)
   - Manage members (admin/librarian)
   - Borrow/return books (all authenticated users)
   - View reports (admin/librarian)

## Troubleshooting

### CORS Errors
If you see CORS errors, make sure:
- Backend is running on port 8080
- Frontend is running on port 3000
- CORS is configured in `CorsConfig.java`

### Connection Errors
- Verify backend is running: `curl http://localhost:8080/api/books`
- Check browser console for detailed error messages
- Verify API URL in `frontend/src/services/api.js`

### Port Already in Use
If port 3000 is in use:
- React will automatically suggest another port
- Or change it in `package.json` scripts

## Production Build

To create a production build:

```bash
cd frontend
npm run build
```

The build folder will contain optimized production files.

