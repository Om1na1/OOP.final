import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated, getUser, hasRole } from '../utils/auth';
import './Home.css';

const Home = () => {
  const authenticated = isAuthenticated();
  const user = getUser();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Library Management System</h1>
        <p>Manage your library efficiently with our comprehensive system</p>
        
        {!authenticated ? (
          <div className="auth-buttons">
            <Link to="/login" className="btn-primary">Login</Link>
            <Link to="/signup" className="btn-secondary">Sign Up</Link>
          </div>
        ) : (
          <div className="user-welcome">
            <p>Welcome back, <strong>{user?.username}</strong>!</p>
            <div className="quick-links">
              <Link to="/books" className="quick-link">Browse Books</Link>
              {(hasRole('admin') || hasRole('librarian')) && (
                <>
                  <Link to="/members" className="quick-link">Manage Members</Link>
                  <Link to="/transactions" className="quick-link">View Transactions</Link>
                  <Link to="/reports" className="quick-link">Reports</Link>
                </>
              )}
              {hasRole('member') && (
                <Link to="/my-books" className="quick-link">My Books</Link>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>📚 Book Management</h3>
            <p>Add, edit, and manage your library's book collection</p>
          </div>
          <div className="feature-card">
            <h3>👥 Member Management</h3>
            <p>Track and manage library members efficiently</p>
          </div>
          <div className="feature-card">
            <h3>📖 Transaction Tracking</h3>
            <p>Monitor book borrows, returns, and due dates</p>
          </div>
          <div className="feature-card">
            <h3>📊 Reports</h3>
            <p>Generate reports on overdue books and transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

