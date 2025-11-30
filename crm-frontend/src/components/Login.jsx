import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { setToken, setCurrentUser } from '../utils/auth';
import './Login.css';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  // Demo accounts for testing
  const demoAccounts = [
    { email: 'admin@crm.com', password: 'admin123', role: 'ADMIN', name: 'Admin User' },
    { email: 'manager@crm.com', password: 'manager123', role: 'MANAGER', name: 'Manager User' },
    { email: 'sales@crm.com', password: 'sales123', role: 'SALES', name: 'Sales Representative' },
    { email: 'user@crm.com', password: 'user123', role: 'USER', name: 'Regular User' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if using demo account
      const demoAccount = demoAccounts.find(
        account => account.email === formData.email && account.password === formData.password
      );

      if (demoAccount) {
        // Simulate API response for demo accounts
        const mockResponse = {
          data: {
            token: 'demo-jwt-token-' + demoAccount.role.toLowerCase(),
            email: demoAccount.email,
            role: demoAccount.role,
            name: demoAccount.name
          }
        };
        
        setToken(mockResponse.data.token);
        setCurrentUser({ 
          email: mockResponse.data.email, 
          role: mockResponse.data.role,
          name: mockResponse.data.name
        });
        onLogin({ 
          email: mockResponse.data.email, 
          role: mockResponse.data.role,
          name: mockResponse.data.name
        });
      } else {
        // Real API call for other accounts
        const response = await authAPI.login(formData);
        const { token, email, role, name } = response.data;
        
        setToken(token);
        setCurrentUser({ email, role, name });
        onLogin({ email, role, name });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password. Try demo accounts below.');
      setShowDemoAccounts(true);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (account) => {
    setFormData({
      email: account.email,
      password: account.password
    });
    setError('');
    setShowDemoAccounts(false);
  };

  const toggleDemoAccounts = () => {
    setShowDemoAccounts(!showDemoAccounts);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="login-content">
        <div className="login-card">
          {/* Header Section */}
          <div className="login-header">
            <div className="logo">
              <i className="fas fa-chart-line"></i>
              <span>CRM Pro</span>
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your account to continue</p>
          </div>

          {/* Demo Accounts Toggle */}
          <div className="demo-toggle">
            <button 
              type="button"
              className="btn-demo-toggle"
              onClick={toggleDemoAccounts}
            >
              <i className={`fas ${showDemoAccounts ? 'fa-eye-slash' : 'fa-key'} me-2`}></i>
              {showDemoAccounts ? 'Hide Demo Accounts' : 'Show Demo Accounts'}
            </button>
          </div>

          {/* Demo Accounts */}
          {showDemoAccounts && (
            <div className="demo-accounts">
              <h4 className="demo-title">Demo Accounts</h4>
              <p className="demo-subtitle">Click any account to auto-fill credentials</p>
              <div className="accounts-grid">
                {demoAccounts.map((account, index) => (
                  <button
                    key={index}
                    className="demo-account-card"
                    onClick={() => fillDemoAccount(account)}
                    type="button"
                  >
                    <div className="account-role">{account.role}</div>
                    <div className="account-email">{account.email}</div>
                    <div className="account-password">Password: {account.password}</div>
                    <div className="account-hint">Click to use this account</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="error-alert">
              <div className="alert-content">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError('')}
                ></button>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <i className="fas fa-envelope me-2"></i>
                Email Address
              </label>
              <div className="input-with-icon">
                <input
                  type="email"
                  className="form-input"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter your email address"
                />
                <i className="input-icon fas fa-user"></i>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <i className="fas fa-lock me-2"></i>
                Password
              </label>
              <div className="input-with-icon">
                <input
                  type="password"
                  className="form-input"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter your password"
                />
                <i className="input-icon fas fa-key"></i>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox-input" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#forgot" className="forgot-link">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit" 
              className="btn-login"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" role="status"></span>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>or</span>
          </div>

          {/* Social Login */}
          <div className="social-login">
            <button type="button" className="btn-social btn-google">
              <i className="fab fa-google me-2"></i>
              Continue with Google
            </button>
            <button type="button" className="btn-social btn-microsoft">
              <i className="fab fa-microsoft me-2"></i>
              Continue with Microsoft
            </button>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p className="footer-text">
              Don't have an account?{' '}
              <button 
                className="btn-link"
                onClick={onSwitchToRegister}
                disabled={loading}
              >
                Create an account
              </button>
            </p>
            <div className="security-notice">
              <i className="fas fa-shield-alt me-2"></i>
              <span>Your data is securely encrypted</span>
            </div>
          </div>
        </div>

        {/* Features Sidebar */}
        <div className="features-sidebar">
          <div className="features-content">
            <h3>Powerful CRM Features</h3>
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="feature-content">
                  <h4>Customer Management</h4>
                  <p>Track and manage all customer interactions</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-bullseye"></i>
                </div>
                <div className="feature-content">
                  <h4>Lead Tracking</h4>
                  <p>Convert leads into customers efficiently</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-tasks"></i>
                </div>
                <div className="feature-content">
                  <h4>Task Management</h4>
                  <p>Stay organized with smart task tracking</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="feature-content">
                  <h4>Sales Analytics</h4>
                  <p>Make data-driven decisions with insights</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial">
              <div className="testimonial-content">
                <i className="fas fa-quote-left"></i>
                <p>This CRM has transformed how we manage customer relationships. Highly recommended!</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">SD</div>
                <div className="author-info">
                  <strong>Sarah Davis</strong>
                  <span>Sales Director</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;