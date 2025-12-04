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
      removeCurrentUser();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Invalid token format:', error);
    return false;
  }
};

// Decode JWT token to get user info - UPDATED for your backend
const decodeToken = (token) => {
  if (!token || typeof token !== 'string') return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    
    console.log('JWT Payload:', payload); // Debug log
    
    // Your backend JWT contains: fullName, email, role, id
    return {
      name: payload.fullName || payload.name || 'User',
      fullName: payload.fullName,
      email: payload.email || payload.sub,
      role: payload.role || 'USER', // Your backend sends role in uppercase
      id: payload.id || payload.sub
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if string is a JWT token
const isJWTToken = (str) => {
  return typeof str === 'string' && str.includes('eyJ') && str.split('.').length === 3;
};

// User management - UPDATED for your backend
export const getCurrentUser = () => {
  try {
    // First, try to get user info from JWT token (most reliable)
    const token = getToken();
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        // Also store in localStorage for consistency
        localStorage.setItem('user', JSON.stringify(decoded));
        return decoded;
      }
    }
    
    // Fallback to localStorage user
    const userString = localStorage.getItem('user');
    if (!userString || userString === "undefined" || userString === "null") {
      return null;
    }
    
    let user = JSON.parse(userString);
    
    // If user.name is a JWT token, decode it
    if (user && user.name && isJWTToken(user.name)) {
      const decoded = decodeToken(user.name);
      if (decoded) {
        return {
          ...user,
          name: decoded.name,
          fullName: decoded.fullName,
          email: decoded.email || user.email,
          role: decoded.role || user.role,
          id: decoded.id || user.id
        };
      }
    }
    
    return user;
  } catch (err) {
    console.error("❌ Error parsing user from localStorage:", err);
    return null;
  }
};

export const setCurrentUser = (userData) => {
  try {
    // Always store the user data as-is
    localStorage.setItem('user', JSON.stringify(userData));
  } catch (error) {
    console.error('Error setting current user:', error);
  }
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

// Get full name - NEW FUNCTION
export const getFullName = () => {
  const user = getCurrentUser();
  return user ? user.fullName || user.name : null;
};

// Get username - UPDATED for your backend
export const getUsername = () => {
  const user = getCurrentUser();
  if (!user) return 'User';
  
  // Use fullName from JWT (your backend now provides this)
  if (user.fullName) return user.fullName;
  
  // Fallback to name
  if (user.name) return user.name;
  
  // Fallback to extracting from email
  if (user.email) {
    const emailParts = user.email.split('@')[0];
    return emailParts.charAt(0).toUpperCase() + emailParts.slice(1);
  }
  
  return 'User';
};

// Get display name for greeting
export const getDisplayName = () => {
  const user = getCurrentUser();
  if (!user) return 'User';
  
  // First priority: fullName from JWT
  if (user.fullName) return user.fullName;
  
  // Second priority: name field
  if (user.name && !user.name.includes('eyJ')) return user.name;
  
  // Third priority: extract from email
  if (user.email) {
    const emailParts = user.email.split('@')[0];
    return emailParts.charAt(0).toUpperCase() + emailParts.slice(1);
  }
  
  return 'User';
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
  return userRole && userRole.toUpperCase() === role.toUpperCase();
};

export const hasAnyRole = (roles) => {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  const upperCaseUserRole = userRole.toUpperCase();
  const upperCaseRoles = roles.map(r => r.toUpperCase());
  
  return upperCaseRoles.includes(upperCaseUserRole);
};

// Check permissions for specific endpoints
export const canAccess = (endpoint) => {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  // Define role-based permissions (using uppercase)
  const permissions = {
    'ADMIN': ['/api/users', '/api/customers', '/api/leads', '/api/tasks', '/api/sales', '/api/dashboard'],
    'MANAGER': ['/api/customers', '/api/leads', '/api/tasks', '/api/sales', '/api/dashboard'],
    'SALES': ['/api/customers', '/api/leads', '/api/tasks', '/api/sales'],
    'USER': ['/api/tasks'] // Basic users might only access their tasks
  };
  
  const upperCaseRole = userRole.toUpperCase();
  return permissions[upperCaseRole]?.some(path => endpoint.startsWith(path)) || false;
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
      console.log('🔑 Token payload from backend:', tokenPayload);
    } catch (e) {
      console.error('❌ Failed to decode token payload:', e);
    }
  }
  
  console.log('🔍 Auth Debug Info:', {
    token: token ? `${token.substring(0, 20)}...` : 'No token',
    tokenValid: tokenValid,
    tokenPayload: tokenPayload,
    user: user,
    username: getUsername(),
    fullName: getFullName(),
    userRole: getUserRole(),
    userEmail: getUserEmail(),
    userId: getUserId(),
    isAuthenticated: isAuthenticated(),
    localStorageContents: {
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user')
    }
  });
  
  return { 
    token, 
    user, 
    userRole: getUserRole(), 
    userId: getUserId(),
    username: getUsername(),
    fullName: getFullName(),
    userEmail: getUserEmail(),
    tokenValid,
    tokenPayload 
  };
};

// Auto-debug on import in development
if (process.env.NODE_ENV === 'development') {
  debugAuth();
}