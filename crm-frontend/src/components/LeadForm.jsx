import React, { useState } from 'react';
import { leadAPI } from '../services/api';
import './LeadForm.css';

const LeadForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    source: 'WEB',
    status: 'NEW',
    company: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDummyData, setShowDummyData] = useState(false);

  // Dummy data options
  const dummyLeads = [
    { name: 'John Smith', contactInfo: 'john.smith@email.com', company: 'Tech Innovations', source: 'WEB', status: 'NEW' },
    { name: 'Sarah Johnson', contactInfo: '+1 (555) 123-4567', company: 'Global Solutions', source: 'REFERRAL', status: 'CONTACTED' },
    { name: 'Mike Davis', contactInfo: 'mike.davis@startup.com', company: 'StartUp Labs', source: 'ADS', status: 'NEW' },
    { name: 'Emily Wilson', contactInfo: 'emily@consultingfirm.com', company: 'Business Consultants', source: 'WEB', status: 'CONVERTED' }
  ];

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
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Lead name is required';
    }
    
    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Contact information is required';
    } else if (!isValidContactInfo(formData.contactInfo)) {
      newErrors.contactInfo = 'Please enter a valid email or phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidContactInfo = (contactInfo) => {
    // Simple validation for email or phone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    return emailRegex.test(contactInfo) || phoneRegex.test(contactInfo.replace(/[\s\-\(\)]/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await leadAPI.create(formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating lead:', error);
      // For demo purposes, simulate success with dummy data
      if (showDummyData) {
        console.log('Demo: Lead created successfully!', formData);
        onSuccess();
      } else {
        alert('Failed to create lead. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillWithSampleData = () => {
    const randomLead = dummyLeads[Math.floor(Math.random() * dummyLeads.length)];
    setFormData({
      ...randomLead,
      notes: 'This is a sample lead for demonstration purposes.'
    });
    setShowDummyData(true);
  };

  const clearForm = () => {
    setFormData({
      name: '',
      contactInfo: '',
      source: 'WEB',
      status: 'NEW',
      company: '',
      notes: ''
    });
    setErrors({});
  };

  return (
    <div className="lead-form-container">
      <div className="form-header">
        <div className="header-icon">
          <i className="fas fa-bullseye"></i>
        </div>
        <div className="header-content">
          <h3 className="form-title">Create New Lead</h3>
          <p className="form-subtitle">Add a new lead to your sales pipeline</p>
        </div>
      </div>

      {showDummyData && (
        <div className="demo-notification">
          <div className="demo-alert">
            <i className="fas fa-info-circle"></i>
            <span>Using demo data. Form will simulate successful submission.</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="lead-form">
        <div className="form-section">
          <h5 className="section-title">
            <i className="fas fa-user-circle me-2"></i>
            Lead Information
          </h5>
          
          <div className="row g-3">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name *
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter lead's full name"
                />
                {errors.name && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.name}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="company" className="form-label">
                  Company
                </label>
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
              </div>
            </div>

            <div className="col-12">
              <div className="form-group">
                <label htmlFor="contactInfo" className="form-label">
                  Contact Information *
                  <span className="required-star">*</span>
                </label>
                <div className="input-with-hint">
                  <input
                    type="text"
                    className={`form-input ${errors.contactInfo ? 'error' : ''}`}
                    id="contactInfo"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Email address or phone number"
                  />
                  <div className="input-hint">
                    <i className="fas fa-info-circle"></i>
                    Enter email or phone number
                  </div>
                </div>
                {errors.contactInfo && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.contactInfo}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h5 className="section-title">
            <i className="fas fa-chart-line me-2"></i>
            Lead Details
          </h5>
          
          <div className="row g-3">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="source" className="form-label">Source</label>
                <div className="select-wrapper">
                  <select
                    className="form-select"
                    id="source"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="WEB">Website</option>
                    <option value="ADS">Advertising</option>
                    <option value="REFERRAL">Referral</option>
                    <option value="SOCIAL">Social Media</option>
                    <option value="EVENT">Event</option>
                    <option value="COLD_CALL">Cold Call</option>
                  </select>
                  <i className="select-arrow fas fa-chevron-down"></i>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="status" className="form-label">Status</label>
                <div className="select-wrapper">
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="QUALIFIED">Qualified</option>
                    <option value="PROPOSAL">Proposal Sent</option>
                    <option value="NEGOTIATION">Negotiation</option>
                    <option value="CONVERTED">Converted</option>
                    <option value="LOST">Lost</option>
                  </select>
                  <i className="select-arrow fas fa-chevron-down"></i>
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
                  placeholder="Any additional information about this lead..."
                />
                <div className="textarea-counter">
                  {formData.notes.length}/500 characters
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  Creating Lead...
                </>
              ) : (
                <>
                  <i className="fas fa-plus me-2"></i>
                  Create Lead
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;