# Library Management System - Frontend

React frontend application for the Library Management System.

## Features

- User authentication (Login/Signup)
- Book management (Browse, Search, Add, Edit, Delete)
- Member management (Admin/Librarian only)
- Transaction management (Borrow/Return books)
- Reports (Overdue books)
- Role-based access control

## Prerequisites

- Node.js 14+ and npm
- Backend API running on http://localhost:8080

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm start
```

The application will open at http://localhost:3000

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.js
│   │   └── PrivateRoute.js
│   ├── pages/          # Page components
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   ├── Books.js
│   │   ├── Members.js
│   │   ├── Transactions.js
│   │   ├── Reports.js
│   │   └── MyBooks.js
│   ├── services/       # API services
│   │   └── api.js
│   ├── utils/          # Utility functions
│   │   └── auth.js
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
└── package.json
```

## API Configuration

The frontend is configured to connect to the backend at `http://localhost:8080/api`.

To change the API URL, update the `API_URL` constant in `src/services/api.js`.

## Authentication

- JWT tokens are stored in localStorage
- Tokens are automatically included in API requests
- Users are redirected to login on token expiration

## Role-Based Access

- **Admin**: Full access to all features
- **Librarian**: Can manage books, members, transactions, and reports
- **Member**: Can browse books and view their own transactions

