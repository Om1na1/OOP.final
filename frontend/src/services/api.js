import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  signin: (data) => api.post('/auth/signin', data),
};

// Book API
export const bookAPI = {
  getAll: () => api.get('/books'),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
  search: (keyword) => api.get(`/books/search?keyword=${keyword}`),
  getByCategory: (category) => api.get(`/books/category/${category}`),
};

// Member API
export const memberAPI = {
  getAll: () => api.get('/members'),
  getById: (id) => api.get(`/members/${id}`),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
};

// Transaction API
export const transactionAPI = {
  getAll: () => api.get('/transactions'),
  getById: (id) => api.get(`/transactions/${id}`),
  borrow: (bookId, memberId) => api.post(`/transactions/borrow?bookId=${bookId}&memberId=${memberId}`),
  return: (id) => api.post(`/transactions/return/${id}`),
  getByMember: (memberId) => api.get(`/transactions/member/${memberId}`),
  getActiveByMember: (memberId) => api.get(`/transactions/member/${memberId}/active`),
};

// Report API
export const reportAPI = {
  getOverdue: () => api.get('/reports/overdue'),
};

export default api;

