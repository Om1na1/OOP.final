import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Books from './pages/Books';
import Members from './pages/Members';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import MyBooks from './pages/MyBooks';
import { isAuthenticated } from './utils/auth';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={isAuthenticated() ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
              path="/signup"
              element={isAuthenticated() ? <Navigate to="/" replace /> : <Signup />}
            />
            <Route path="/books" element={<Books />} />
            <Route
              path="/members"
              element={
                <PrivateRoute requiredRole="librarian">
                  <Members />
                </PrivateRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <Transactions />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute requiredRole="librarian">
                  <Reports />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-books"
              element={
                <PrivateRoute>
                  <MyBooks />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

