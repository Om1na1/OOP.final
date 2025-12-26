import React, { useState, useEffect } from 'react';
import { reportAPI } from '../services/api';
import './Reports.css';

const Reports = () => {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverdueBooks();
  }, []);

  const loadOverdueBooks = async () => {
    try {
      const response = await reportAPI.getOverdue();
      setOverdueBooks(response.data.overdueBooks || []);
    } catch (error) {
      console.error('Error loading overdue books:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysOverdue = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = now - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div className="reports-container">
      <h1>Reports</h1>

      <div className="report-section">
        <h2>Overdue Books Report</h2>
        <div className="report-summary">
          <p><strong>Total Overdue Books:</strong> {overdueBooks.length}</p>
        </div>

        {overdueBooks.length > 0 ? (
          <div className="overdue-table">
            <table>
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Member</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Days Overdue</th>
                  <th>Fine Amount</th>
                </tr>
              </thead>
              <tbody>
                {overdueBooks.map((transaction) => {
                  const daysOverdue = calculateDaysOverdue(transaction.dueDate);
                  return (
                    <tr key={transaction.id}>
                      <td>{transaction.book?.title || 'N/A'}</td>
                      <td>
                        {transaction.member?.firstName} {transaction.member?.lastName}
                      </td>
                      <td>{transaction.borrowDate || 'N/A'}</td>
                      <td className="overdue">{transaction.dueDate || 'N/A'}</td>
                      <td className="overdue">{daysOverdue} days</td>
                      <td>${transaction.fineAmount || (daysOverdue * 1.0).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <p>No overdue books at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;

