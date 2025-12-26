import React, { useState, useEffect } from 'react';
import { bookAPI } from '../services/api';
import { hasRole } from '../utils/auth';
import './Books.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    totalCopies: '',
    availableCopies: '',
    category: '',
    publisher: '',
    publicationDate: '',
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await bookAPI.getAll();
      setBooks(response.data);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadBooks();
      return;
    }
    try {
      const response = await bookAPI.search(searchTerm);
      setBooks(response.data);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookData = {
        ...formData,
        totalCopies: parseInt(formData.totalCopies),
        availableCopies: editingBook ? parseInt(formData.availableCopies) : parseInt(formData.totalCopies),
      };

      if (editingBook) {
        await bookAPI.update(editingBook.id, bookData);
      } else {
        await bookAPI.create(bookData);
      }
      setShowModal(false);
      resetForm();
      loadBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Error saving book. Please try again.');
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      totalCopies: book.totalCopies || '',
      availableCopies: book.availableCopies || '',
      category: book.category || '',
      publisher: book.publisher || '',
      publicationDate: book.publicationDate || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await bookAPI.delete(id);
      loadBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Error deleting book. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      totalCopies: '',
      availableCopies: '',
      category: '',
      publisher: '',
      publicationDate: '',
    });
    setEditingBook(null);
  };

  const canEdit = hasRole('admin') || hasRole('librarian');

  if (loading) return <div className="loading">Loading books...</div>;

  return (
    <div className="books-container">
      <div className="books-header">
        <h1>Books</h1>
        {canEdit && (
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            Add New Book
          </button>
        )}
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search books by title, author, or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>ISBN:</strong> {book.isbn}</p>
            <p><strong>Category:</strong> {book.category || 'N/A'}</p>
            <p><strong>Available:</strong> {book.availableCopies} / {book.totalCopies}</p>
            {canEdit && (
              <div className="book-actions">
                <button className="btn-edit" onClick={() => handleEdit(book)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(book.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Author *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>ISBN *</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Total Copies *</label>
                  <input
                    type="number"
                    value={formData.totalCopies}
                    onChange={(e) => setFormData({ ...formData, totalCopies: e.target.value })}
                    required
                    min="1"
                  />
                </div>
                {editingBook && (
                  <div className="form-group">
                    <label>Available Copies *</label>
                    <input
                      type="number"
                      value={formData.availableCopies}
                      onChange={(e) => setFormData({ ...formData, availableCopies: e.target.value })}
                      required
                      min="0"
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Publisher</label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Publication Date</label>
                <input
                  type="date"
                  value={formData.publicationDate}
                  onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
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

export default Books;

