// utils/auth.js

// Token management
export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

// Enhanced token validation
export const isValidToken = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  try {
    // Check if it's a JWT token
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode payload to check expiration and role
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp && payload.exp < currentTime) {
      console.warn('🕒 Token expired');
      removeToken();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Invalid token format:', error);
    return false;
  }
};

// User management
export const getCurrentUser = () => {
  try {
    const userString = localStorage.getItem('user');
    if (!userString || userString === "undefined" || userString === "null") {
      return null;
    }
    return JSON.parse(userString);
  } catch (err) {
    console.error("❌ Error parsing user from localStorage:", err);
    return null;
  }
};

export const setCurrentUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeCurrentUser = () => {
  localStorage.removeItem('user');
};

// Enhanced authentication status
export const isAuthenticated = () => {
  const token = getToken();
  const isValid = token && isValidToken(token);
  
  if (token && !isValid) {
    console.warn('⚠️ Token exists but is invalid');
  }
  
  return isValid;
};

// Get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

// Get user email
export const getUserEmail = () => {
  const user = getCurrentUser();
  return user ? user.email : null;
};

// Get user ID
export const getUserId = () => {
  const user = getCurrentUser();
  return user ? user.id : null;
};

// Complete logout
export const logout = () => {
  removeToken();
  removeCurrentUser();
  window.location.href = '/login';
};

// Check if user has specific role
export const hasRole = (role) => {
  const userRole = getUserRole();
  return userRole === role;
};

export const hasAnyRole = (roles) => {
  const userRole = getUserRole();
  return roles.includes(userRole);
};

// Check permissions for specific endpoints
export const canAccess = (endpoint) => {
  const userRole = getUserRole();
  
  // Define role-based permissions
  const permissions = {
    'admin': ['/api/users', '/api/customers', '/api/leads', '/api/tasks', '/api/sales', '/api/dashboard'],
    'manager': ['/api/customers', '/api/leads', '/api/tasks', '/api/sales', '/api/dashboard'],
    'sales': ['/api/customers', '/api/leads', '/api/tasks', '/api/sales'],
    'user': ['/api/tasks'] // Basic users might only access their tasks
  };
  
  return permissions[userRole]?.some(path => endpoint.startsWith(path)) || false;
};

// Enhanced debug function
export const debugAuth = () => {
  const token = getToken();
  const user = getCurrentUser();
  const tokenValid = token ? isValidToken(token) : false;
  
  // Decode token payload if it's a JWT
  let tokenPayload = null;
  if (token && token.split('.').length === 3) {
    try {
      tokenPayload = JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('❌ Failed to decode token payload:', e);
    }
  }
  
  console.log('🔍 Enhanced Auth Debug Info:', {
    token: token ? `${token.substring(0, 20)}...` : 'No token',
    tokenValid: tokenValid,
    tokenPayload: tokenPayload,
    user: user,
    userRole: getUserRole(),
    userId: getUserId(),
    isAuthenticated: isAuthenticated(),
    localStorageContents: {
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user')
    }
  });
  
  // Check permissions for common endpoints
  const endpoints = ['/api/users', '/api/customers', '/api/leads', '/api/tasks', '/api/sales'];
  endpoints.forEach(endpoint => {
    console.log(`🔐 ${endpoint}: ${canAccess(endpoint) ? '✅ Access granted' : '❌ Access denied'}`);
  });
  
  return { 
    token, 
    user, 
    userRole: getUserRole(), 
    userId: getUserId(),
    tokenValid,
    tokenPayload 
  };
};

// Auto-debug on import in development
if (process.env.NODE_ENV === 'development') {
  debugAuth();
}