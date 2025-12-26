import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout, hasRole } from '../utils/auth';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Library Management System
        </Link>
        <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/books" className="navbar-link">Books</Link>
              {(hasRole('admin') || hasRole('librarian')) && (
                <>
                  <Link to="/members" className="navbar-link">Members</Link>
                  <Link to="/transactions" className="navbar-link">Transactions</Link>
                  <Link to="/reports" className="navbar-link">Reports</Link>
                </>
              )}
              {hasRole('member') && (
                <Link to="/my-books" className="navbar-link">My Books</Link>
              )}
              <div className="navbar-user">
                <span>Welcome, {user.username}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/signup" className="navbar-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

