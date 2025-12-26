import React, { useState, useEffect } from 'react';
import { transactionAPI, bookAPI, memberAPI } from '../services/api';
import { getUser, hasRole } from '../utils/auth';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowData, setBorrowData] = useState({ bookId: '', memberId: '' });
  const user = getUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transRes, booksRes, membersRes] = await Promise.all([
        transactionAPI.getAll(),
        bookAPI.getAll(),
        memberAPI.getAll(),
      ]);
      setTransactions(transRes.data);
      setBooks(booksRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (e) => {
    e.preventDefault();
    try {
      await transactionAPI.borrow(borrowData.bookId, borrowData.memberId);
      setShowBorrowModal(false);
      setBorrowData({ bookId: '', memberId: '' });
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error borrowing book. Please try again.');
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm('Are you sure you want to return this book?')) return;
    try {
      await transactionAPI.return(id);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error returning book. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const statusClass = {
      BORROWED: 'borrowed',
      RETURNED: 'returned',
      OVERDUE: 'overdue',
    };
    return <span className={`status-badge ${statusClass[status] || ''}`}>{status}</span>;
  };

  const isOverdue = (dueDate, status) => {
    if (status !== 'BORROWED') return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) return <div className="loading">Loading transactions...</div>;

  const canBorrow = hasRole('admin') || hasRole('librarian');

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h1>Transactions</h1>
        {canBorrow && (
          <button className="btn-primary" onClick={() => setShowBorrowModal(true)}>
            Borrow Book
          </button>
        )}
      </div>

      <div className="transactions-table">
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Member</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Fine</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const overdue = isOverdue(transaction.dueDate, transaction.status);
              return (
                <tr key={transaction.id} className={overdue ? 'overdue-row' : ''}>
                  <td>{transaction.book?.title || 'N/A'}</td>
                  <td>
                    {transaction.member?.firstName} {transaction.member?.lastName}
                  </td>
                  <td>{transaction.borrowDate || 'N/A'}</td>
                  <td className={overdue ? 'overdue' : ''}>
                    {transaction.dueDate || 'N/A'}
                  </td>
                  <td>{transaction.returnDate || 'Not returned'}</td>
                  <td>{getStatusBadge(transaction.status)}</td>
                  <td>${transaction.fineAmount || 0}</td>
                  <td>
                    {transaction.status === 'BORROWED' && (
                      <button
                        className="btn-return"
                        onClick={() => handleReturn(transaction.id)}
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showBorrowModal && (
        <div className="modal-overlay" onClick={() => { setShowBorrowModal(false); setBorrowData({ bookId: '', memberId: '' }); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Borrow Book</h2>
            <form onSubmit={handleBorrow}>
              <div className="form-group">
                <label>Book *</label>
                <select
                  value={borrowData.bookId}
                  onChange={(e) => setBorrowData({ ...borrowData, bookId: e.target.value })}
                  required
                >
                  <option value="">Select a book</option>
                  {books.filter(b => b.availableCopies > 0).map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} - {book.availableCopies} available
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Member *</label>
                <select
                  value={borrowData.memberId}
                  onChange={(e) => setBorrowData({ ...borrowData, memberId: e.target.value })}
                  required
                >
                  <option value="">Select a member</option>
                  {members.filter(m => m.isActive).map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Borrow</button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => { setShowBorrowModal(false); setBorrowData({ bookId: '', memberId: '' }); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;

