export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const hasRole = (role) => {
  const user = getUser();
  if (!user || !user.roles) return false;
  return user.roles.some(r => r.includes(role.toUpperCase()));
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

