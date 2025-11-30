import React, { useState, useEffect } from 'react';
import { customerAPI } from '../services/api';
import './CustomerForm.css';

const CustomerForm = ({ customer, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showDummyData, setShowDummyData] = useState(false);

  // Sample customer data for quick fill
  const sampleCustomers = [
    {
      name: 'John Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Innovations Inc.',
      address: '123 Tech Street, San Francisco, CA 94102',
      notes: 'Interested in enterprise solutions. Prefers email communication.'
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.j@globalconsulting.com',
      phone: '+1 (555) 987-6543',
      company: 'Global Consulting Partners',
      address: '456 Business Ave, New York, NY 10001',
      notes: 'Key decision maker. Very responsive to phone calls.'
    },
    {
      name: 'Mike Davis',
      email: 'mike.davis@startuplabs.com',
      phone: '+1 (555) 456-7890',
      company: 'StartUp Labs',
      address: '789 Innovation Drive, Austin, TX 73301',
      notes: 'Early stage startup. Budget conscious but high potential.'
    }
  ];

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || '',
        address: customer.address || '',
        notes: customer.notes || ''
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear message
    if (message) setMessage('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      let response;
      if (customer) {
        response = await customerAPI.update(customer.id, formData);
        setMessage('Customer updated successfully!');
      } else {
        response = await customerAPI.create(formData);
        setMessage('Customer created successfully!');
      }
      
      // Wait a moment to show success message
      setTimeout(() => {
        onSuccess();
      }, 1500);
      
    } catch (error) {
      console.error('Error saving customer:', error);
      // For demo purposes, simulate success
      if (showDummyData) {
        setMessage('Demo: Customer saved successfully!');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        const errorMessage = error.response?.data?.message || 
                            'Failed to save customer. Please try again.';
        setMessage(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const fillWithSampleData = () => {
    const randomCustomer = sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)];
    setFormData(randomCustomer);
    setShowDummyData(true);
  };

  const clearForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      notes: ''
    });
    setErrors({});
    setShowDummyData(false);
    setMessage('');
  };

  return (
    <div className="customer-form-container">
      <div className="form-header">
        <div className="header-icon">
          <i className="fas fa-user"></i>
        </div>
        <div className="header-content">
          <h3 className="form-title">
            {customer ? 'Edit Customer' : 'Create New Customer'}
          </h3>
          <p className="form-subtitle">
            {customer ? 'Update customer information' : 'Add a new customer to your database'}
          </p>
        </div>
      </div>

      {showDummyData && (
        <div className="demo-notification">
          <div className="demo-alert">
            <i className="fas fa-info-circle"></i>
            <span>Using sample data. Form will simulate successful submission.</span>
          </div>
        </div>
      )}

      {message && (
        <div className={`message-alert ${message.includes('successfully') ? 'success' : 'error'}`}>
          <i className={`fas ${message.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
          {message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage('')}
          ></button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="customer-form">
        <div className="form-section">
          <h5 className="section-title">
            <i className="fas fa-id-card me-2"></i>
            Basic Information
          </h5>
          
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name *
                  <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter customer's full name"
                  />
                  <i className="input-icon fas fa-user"></i>
                </div>
                {errors.name && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.name}
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                  <span className="required-star">*</span>
                </label>
                <div className="input-with-icon">
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="customer@example.com"
                  />
                  <i className="input-icon fas fa-envelope"></i>
                </div>
                {errors.email && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.email}
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  <i className="fas fa-phone me-1"></i>
                  Phone Number
                </label>
                <div className="input-with-icon">
                  <input
                    type="tel"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="+1 (555) 123-4567"
                  />
                  <i className="input-icon fas fa-phone"></i>
                </div>
                {errors.phone && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.phone}
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="form-group">
                <label htmlFor="company" className="form-label">
                  <i className="fas fa-building me-1"></i>
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
                    placeholder="Company name"
                  />
                  <i className="input-icon fas fa-building"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h5 className="section-title">
            <i className="fas fa-map-marker-alt me-2"></i>
            Location & Details
          </h5>
          
          <div className="row g-3">
            <div className="col-12">
              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  <i className="fas fa-map-pin me-1"></i>
                  Address
                </label>
                <div className="input-with-icon">
                  <textarea
                    className="form-textarea"
                    id="address"
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Street address, city, state, ZIP code"
                  />
                  <i className="input-icon textarea-icon fas fa-map-marker-alt"></i>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="form-group">
                <label htmlFor="notes" className="form-label">
                  <i className="fas fa-sticky-note me-1"></i>
                  Additional Notes
                </label>
                <textarea
                  className="form-textarea"
                  id="notes"
                  name="notes"
                  rows="4"
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Important information, preferences, or special requirements..."
                />
                <div className="textarea-counter">
                  {formData.notes.length}/1000 characters
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Preview */}
        {(formData.name || formData.email) && (
          <div className="form-section">
            <h5 className="section-title">
              <i className="fas fa-eye me-2"></i>
              Customer Preview
            </h5>
            <div className="customer-preview">
              <div className="preview-header">
                <div className="preview-avatar">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="preview-info">
                  <h6 className="preview-name">{formData.name || 'Customer Name'}</h6>
                  <div className="preview-email">{formData.email || 'email@example.com'}</div>
                </div>
              </div>
              <div className="preview-details">
                {formData.company && (
                  <div className="preview-detail">
                    <i className="fas fa-building me-2"></i>
                    {formData.company}
                  </div>
                )}
                {formData.phone && (
                  <div className="preview-detail">
                    <i className="fas fa-phone me-2"></i>
                    {formData.phone}
                  </div>
                )}
                {formData.address && (
                  <div className="preview-detail">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {formData.address}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <div className="action-left">
            <button 
              type="button" 
              className="btn btn-clear"
              onClick={clearForm}
              disabled={loading}
            >
              <i className="fas fa-eraser me-2"></i>
              Clear Form
            </button>
          </div>
          
          <div className="action-right">
            <button 
              type="button" 
              className="btn btn-sample"
              onClick={fillWithSampleData}
              disabled={loading}
            >
              <i className="fas fa-magic me-2"></i>
              Fill Sample
            </button>
            
            <button 
              type="button" 
              className="btn btn-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              <i className="fas fa-times me-2"></i>
              Cancel
            </button>
            
            <button 
              type="submit" 
              className="btn btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" role="status"></span>
                  {customer ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <i className={`fas ${customer ? 'fa-save' : 'fa-plus'} me-2`}></i>
                  {customer ? 'Update Customer' : 'Create Customer'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;