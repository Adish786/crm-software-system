import React, { useState } from 'react';
import { authAPI } from '../services/api';
import './Register.css';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'SALES',
    phone: '',
    company: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
    
    setMessage('');
  };

  const checkPasswordStrength = (password) => {
    let strength = '';
    if (password.length === 0) {
      strength = '';
    } else if (password.length < 6) {
      strength = 'weak';
    } else if (password.length < 8) {
      strength = 'medium';
    } else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      strength = 'strong';
    } else {
      strength = 'medium';
    }
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await authAPI.register(formData);
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'SALES',
      phone: '',
      company: ''
    });
    setPasswordStrength('');
    setMessage('');
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return { text: 'Weak', color: '#e74c3c', width: '33%' };
      case 'medium': return { text: 'Medium', color: '#f39c12', width: '66%' };
      case 'strong': return { text: 'Strong', color: '#27ae60', width: '100%' };
      default: return { text: '', color: '#bdc3c7', width: '0%' };
    }
  };

  const strengthInfo = getPasswordStrengthText();

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="register-content">
        <div className="register-card">
          {/* Header Section */}
          <div className="register-header">
            <div className="logo">
              <i className="fas fa-chart-line"></i>
              <span>CRM Pro</span>
            </div>
            <h1 className="register-title">Create Account</h1>
            <p className="register-subtitle">Join thousands of teams using our CRM</p>
          </div>

          {/* Message Alert */}
          {message && (
            <div className={`message-alert ${message.includes('successful') ? 'success' : 'error'}`}>
              <div className="alert-content">
                <i className={`fas ${message.includes('successful') ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
                <span>{message}</span>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setMessage('')}
                ></button>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  <i className="fas fa-user me-2"></i>
                  Full Name *
                </label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    className="form-input"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Enter your full name"
                  />
                  <i className="input-icon fas fa-user-circle"></i>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <i className="fas fa-envelope me-2"></i>
                  Email Address *
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
                    placeholder="your.email@company.com"
                  />
                  <i className="input-icon fas fa-at"></i>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  <i className="fas fa-phone me-2"></i>
                  Phone Number
                </label>
                <div className="input-with-icon">
                  <input
                    type="tel"
                    className="form-input"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="+1 (555) 123-4567"
                  />
                  <i className="input-icon fas fa-mobile-alt"></i>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="company" className="form-label">
                  <i className="fas fa-building me-2"></i>
                  Company
                </label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    className="form-input"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Your company name"
                  />
                  <i className="input-icon fas fa-briefcase"></i>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                <i className="fas fa-user-tag me-2"></i>
                Role *
              </label>
              <div className="select-with-icon">
                <select
                  className="form-select"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="SALES">Sales Representative</option>
                  <option value="ADMIN">Administrator</option>
                  <option value="MANAGER">Manager</option>
                  <option value="USER">User</option>
                </select>
                <i className="select-icon fas fa-chevron-down"></i>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <i className="fas fa-lock me-2"></i>
                  Password *
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
                    placeholder="Create a strong password"
                  />
                  <i className="input-icon fas fa-key"></i>
                </div>
                
                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-meter">
                      <div 
                        className="strength-bar"
                        style={{
                          width: strengthInfo.width,
                          backgroundColor: strengthInfo.color
                        }}
                      ></div>
                    </div>
                    <div className="strength-text">
                      Password strength: <span style={{ color: strengthInfo.color }}>{strengthInfo.text}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <i className="fas fa-lock me-2"></i>
                  Confirm Password *
                </label>
                <div className="input-with-icon">
                  <input
                    type="password"
                    className="form-input"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Confirm your password"
                  />
                  <i className="input-icon fas fa-redo"></i>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="password-match">
                    {formData.password === formData.confirmPassword ? (
                      <div className="match-success">
                        <i className="fas fa-check-circle me-1"></i>
                        Passwords match
                      </div>
                    ) : (
                      <div className="match-error">
                        <i className="fas fa-times-circle me-1"></i>
                        Passwords don't match
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="form-group terms-group">
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox-input" required />
                <span className="checkmark"></span>
                I agree to the <a href="#terms" className="terms-link">Terms of Service</a> and <a href="#privacy" className="terms-link">Privacy Policy</a>
              </label>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-clear"
                onClick={clearForm}
                disabled={loading}
              >
                <i className="fas fa-eraser me-2"></i>
                Clear Form
              </button>
              
              <button 
                type="submit" 
                className="btn-register"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" role="status"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus me-2"></i>
                    Create Account
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>Already have an account?</span>
          </div>

          {/* Login Redirect */}
          <div className="login-redirect">
            <button
              type="button"
              className="btn-login-redirect"
              onClick={onSwitchToLogin}
              disabled={loading}
            >
              <i className="fas fa-sign-in-alt me-2"></i>
              Sign in to your account
            </button>
          </div>

          {/* Security Notice */}
          <div className="security-notice">
            <i className="fas fa-shield-alt me-2"></i>
            <span>Your information is secured with enterprise-grade encryption</span>
          </div>
        </div>

        {/* Benefits Sidebar */}
        <div className="benefits-sidebar">
          <div className="benefits-content">
            <h3>Start Your CRM Journey</h3>
            
            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <i className="fas fa-rocket"></i>
                </div>
                <div className="benefit-content">
                  <h4>Get Started in Minutes</h4>
                  <p>Set up your account and start managing customers immediately</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="benefit-content">
                  <h4>Boost Sales Performance</h4>
                  <p>Track leads, manage pipelines, and close more deals</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="benefit-content">
                  <h4>Team Collaboration</h4>
                  <p>Work together seamlessly with your sales team</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <div className="benefit-content">
                  <h4>Access Anywhere</h4>
                  <p>Use our mobile app to manage your business on the go</p>
                </div>
              </div>
            </div>
            
            <div className="stats-grid">
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Teams</div>
              </div>
              <div className="stat">
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;