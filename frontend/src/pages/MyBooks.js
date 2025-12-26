import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import { getUser } from '../utils/auth';
import './MyBooks.css';

const MyBooks = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    // For members, we need to find their member record first
    // For now, we'll show all transactions - in a real app, you'd filter by member
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await transactionAPI.getAll();
      // Filter by current user if we had member ID
      setTransactions(response.data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm('Are you sure you want to return this book?')) return;
    try {
      await transactionAPI.return(id);
      loadTransactions();
    } catch (error) {
      alert(error.response?.data?.message || 'Error returning book. Please try again.');
    }
  };

  const isOverdue = (dueDate, status) => {
    if (status !== 'BORROWED') return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) return <div className="loading">Loading your books...</div>;

  const activeBorrows = transactions.filter(t => t.status === 'BORROWED');

  return (
    <div className="my-books-container">
      <h1>My Books</h1>

      {activeBorrows.length === 0 ? (
        <div className="no-books">
          <p>You don't have any borrowed books at the moment.</p>
        </div>
      ) : (
        <div className="books-grid">
          {activeBorrows.map((transaction) => {
            const overdue = isOverdue(transaction.dueDate, transaction.status);
            return (
              <div key={transaction.id} className={`book-card ${overdue ? 'overdue' : ''}`}>
                <h3>{transaction.book?.title || 'Unknown Book'}</h3>
                <p><strong>Author:</strong> {transaction.book?.author || 'N/A'}</p>
                <p><strong>Borrowed:</strong> {transaction.borrowDate || 'N/A'}</p>
                <p className={overdue ? 'overdue-text' : ''}>
                  <strong>Due Date:</strong> {transaction.dueDate || 'N/A'}
                </p>
                {overdue && (
                  <p className="overdue-warning">⚠️ This book is overdue!</p>
                )}
                <button
                  className="btn-return"
                  onClick={() => handleReturn(transaction.id)}
                >
                  Return Book
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBooks;

