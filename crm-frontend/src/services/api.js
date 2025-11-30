// api.js
import axios from 'axios';
// canAccess, getToken, getUserRole are still imported but not used for client-side blocking
import { getToken, getUserRole, logout } from '../utils/auth'; 

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
   baseURL: API_BASE_URL,
    headers: {
   'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
(config) => {
 const token = getToken();
 if (token) {
 config.headers.Authorization = `Bearer ${token}`;
 
console.log(`🌍 Request Proceeding: ${config.method?.toUpperCase()} ${config.url}`, {
 userRole: getUserRole(),
 endpoint: config.url
 });
 } else {
 console.warn('⚠️ No token found for API request');
 }

 return config;
 },
 (error) => {
 return Promise.reject(error);
}
);

// Enhanced Response Interceptor with Better Error Handling (Unchanged)
api.interceptors.response.use(
 (response) => {
 console.log(`✅ API Success: ${response.status} ${response.config.url}`);
 return response;
},
  (error) => {
    const { config, response } = error;
    
    console.error('❌ API Error:', {
      url: config?.url,
      method: config?.method,
      status: response?.status,
      statusText: response?.statusText,
      userRole: getUserRole(),
      endpoint: config?.url
    });

    if (response) {
      switch (response.status) {
        case 401:
          console.warn('🛑 401 Unauthorized - Token invalid or expired');
          logout();
          break;
          
        case 403:
          console.error('🚫 403 Forbidden - Permission denied', {
            endpoint: config?.url,
            userRole: getUserRole(),
            requiredRole: response.data?.requiredRole || 'Unknown',
            message: response.data?.message || 'No permission'
          });
          
          // Show user-friendly error message
          if (typeof window !== 'undefined' && !config._retry) {
            const userMessage = `Access denied. You don't have permission to access this resource. 
                               Your role: ${getUserRole() || 'None'}`;
            alert(userMessage);
          }
          break;
          
        case 404:
          console.error('🔍 404 Not Found - Endpoint may not exist');
          break;
          
        case 500:
          console.error('💥 500 Server Error - Backend issue');
          break;
          
        default:
          console.error(`❌ HTTP ${response.status} Error`);
      }
    } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
      console.error('🌐 Network Error - Backend may be down');
    }

    return Promise.reject(error);
  }
);

// Permission-aware API methods (RESTRICTIONS REMOVED)
const createPermissionAwareAPI = (basePath, allowedRoles = ['admin', 'manager', 'sales', 'user']) => ({
  getAll: (params = {}) => {
    return api.get(basePath, { params });
  },
  
  getById: (id) => {
    return api.get(`${basePath}/${id}`);
  },
  
  create: (data) => {
    return api.post(basePath, data);
  },
  
  update: (id, data) => {
    return api.put(`${basePath}/${id}`, data);
  },
  
  delete: (id) => {
    return api.delete(`${basePath}/${id}`);
  }
});

// Auth API (Unchanged)
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  getProfile: () => api.get('/users/me'),
  refreshToken: () => api.post('/auth/refresh'),
};

// User API - Admin only (RESTRICTIONS REMOVED)
export const userAPI = {
  getAll: (params = {}) => {
    return api.get('/users', { params });
  },
  
  getById: (id) => {
    return api.get(`/users/${id}`);
  },
  
  create: (data) => {
    return api.post('/users', data);
  },
  
  update: (id, data) => {
    return api.put(`/users/${id}`, data);
  },
  
  delete: (id) => {
    return api.delete(`/users/${id}`);
  },
  
  updateRole: (id, role) => {
    return api.patch(`/users/${id}/role`, null, { params: { role } });
  },
  
  getByRole: (role) => {
    return api.get(`/users/role/${role}`);
  },
  
  checkEmail: (email) => api.get('/users/check-email', { params: { email } }),
  
  getStatistics: () => {
    return api.get('/users/statistics');
  },
  
  getSalesReps: () => api.get('/users/sales-representatives'),
};

// Customer API - (RESTRICTIONS REMOVED)
export const customerAPI = {
  getAll: (params = {}) => {
    return api.get('/customers', { params });
  },
  
  getById: (id) => {
    return api.get(`/customers/${id}`);
  },
  
  create: (data) => {
    return api.post('/customers', data);
  },
  
  update: (id, data) => {
    return api.put(`/customers/${id}`, data);
  },
  
  delete: (id) => {
    return api.delete(`/customers/${id}`);
  },
  
  getByStatus: (status) => {
    return api.get(`/customers/status/${status}`);
  },
  
  getBySalesRep: (salesRepId) => {
    return api.get(`/customers/sales-rep/${salesRepId}`);
  },
  
  getStatistics: () => {
    return api.get('/customers/statistics');
  },
  
  search: (query) => {
    return api.get('/customers/search', { params: { q: query } });
  },
  
  bulkAssign: (customerIds, salesRepId) => {
    return api.post('/customers/bulk-assign', { customerIds, salesRepId });
  },
  
  getUnassigned: () => {
    return api.get('/customers/unassigned');
  },
  
  getAssigned: () => {
    return api.get('/customers/assigned');
  },
};

// Lead API (RESTRICTIONS REMOVED)
export const leadAPI = {
  getAll: () => {
    return api.get('/leads');
  },
  
  getById: (id) => {
    return api.get(`/leads/${id}`);
  },
  
  create: (data) => {
    return api.post('/leads', data);
  },
  
  update: (id, data) => {
    return api.put(`/leads/${id}`, data);
  },
  
  delete: (id) => {
    return api.delete(`/leads/${id}`);
  },
  
  updateStatus: (id, status) => {
    return api.patch(`/leads/${id}/status`, { status });
  },
  
  getByStatus: (status) => {
    return api.get(`/leads/status/${status}`);
  },
  
  getStatistics: () => {
    return api.get('/leads/statistics');
  },
  
  convertToCustomer: (id) => {
    return api.post(`/leads/${id}/convert`);
  },
  
  getBySalesRep: (salesRepId) => {
    return api.get(`/leads/sales-rep/${salesRepId}`);
  },
  
  getNeedingFollowUp: () => {
    return api.get('/leads/needing-followup');
  },
};

// Task API (RESTRICTIONS REMOVED)
export const taskAPI = {
  getAll: (params = {}) => {
    return api.get('/tasks', { params });
  },
  
  getById: (id) => {
    return api.get(`/tasks/${id}`);
  },
  
  create: (data) => {
    return api.post('/tasks', data);
  },
  
  update: (id, data) => {
    return api.put(`/tasks/${id}`, data);
  },
  
  delete: (id) => {
    return api.delete(`/tasks/${id}`);
  },
  
};

// Sale API (RESTRICTIONS REMOVED)
export const saleAPI = {
  getAll: (params = {}) => {
    return api.get('/sales', { params });
  },
  
  getById: (id) => {
    return api.get(`/sales/${id}`);
  },
  
  create: (data) => {
    return api.post('/sales', data);
  },
  
  update: (id, data) => {
    return api.put(`/sales/${id}`, data);
  },
  
  delete: (id) => {
    return api.delete(`/sales/${id}`);
  },
  
};

// Dashboard API - Available to all authenticated users (Unchanged)
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivities: () => api.get('/dashboard/recent-activities'),
  getSalesChart: (period) => api.get('/dashboard/sales-chart', { params: { period } }),
  getLeadConversion: () => api.get('/dashboard/lead-conversion'),
};

export const checkPermission = (endpoint) => {
  return true;
};

export default api;