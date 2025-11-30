import React, { useState, useEffect } from 'react';
import { saleAPI, customerAPI } from '../services/api';
import './SaleForm.css';

const SaleForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    status: 'PROPOSAL',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDummyData, setShowDummyData] = useState(false);

  // Dummy customers data
  const dummyCustomers = [
    { id: 1, name: 'John Smith', company: 'Tech Corp', email: 'john@techcorp.com' },
    { id: 2, name: 'Sarah Wilson', company: 'Innovate Inc', email: 'sarah@innovate.com' },
    { id: 3, name: 'Mike Davis', company: 'Global Solutions', email: 'mike@global.com' },
    { id: 4, name: 'Emily Chen', company: 'StartUp Labs', email: 'emily@startuplabs.com' },
    { id: 5, name: 'Alex Johnson', company: 'Digital Ventures', email: 'alex@digital.com' }
  ];

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getAll();
      setCustomers(response.data.length > 0 ? response.data : dummyCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
      setCustomers(dummyCustomers);
      setShowDummyData(true);
    } finally {
      setLoading(false);
    }
  };

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
    
    if (!formData.customerId) {
      newErrors.customerId = 'Please select a customer';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
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

    try {
      const saleData = {
        ...formData,
        amount: parseFloat(formData.amount),
        // Add dummy data for demo
        assignedSalesRepId: 1 // Default sales rep
      };
      
      await saleAPI.create(saleData);
      onSuccess();
    } catch (error) {
      console.error('Error creating sale:', error);
      // For demo purposes, still call onSuccess to show the flow works
      if (showDummyData) {
        alert('Demo: Sale would be created successfully!');
        onSuccess();
      } else {
        alert('Failed to create sale. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillWithSampleData = () => {
    setFormData({
      customerId: '2',
      amount: '25000',
      status: 'NEGOTIATION',
      date: new Date().toISOString().split('T')[0],
      notes: 'Sample sale for demonstration purposes'
    });
  };

  return (
    <div className="sale-form-container">
      <div className="form-header">
        <h3 className="form-title">
          <i className="fas fa-plus-circle me-2"></i>
          Create New Sale
        </h3>
        <p className="form-subtitle">Add a new sales opportunity to your pipeline</p>
      </div>

      {showDummyData && (
        <div className="demo-alert">
          <div className="alert alert-info d-flex align-items-center">
            <i className="fas fa-info-circle me-2"></i>
            <div>
              <strong>Demo Mode:</strong> Using sample data. Form will simulate successful submission.
              <button 
                className="btn btn-sm btn-outline-primary ms-2"
                onClick={fillWithSampleData}
              >
                <i className="fas fa-magic me-1"></i>
                Fill Sample Data
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="sale-form">
        <div className="form-section">
          <h5 className="section-title">
            <i className="fas fa-user me-2"></i>
            Customer Information
          </h5>
          
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="customerId" className="form-label">
                Customer *
                <span className="required-indicator">*</span>
              </label>
              <select
                className={`form-select customer-select ${errors.customerId ? 'is-invalid' : ''}`}
                id="customerId"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Choose a customer...</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.company && `- ${customer.company}`}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle me-1"></i>
                  {errors.customerId}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h5 className="section-title">
            <i className="fas fa-dollar-sign me-2"></i>
            Sale Details
          </h5>
          
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="amount" className="form-label">
                Amount ($)
                <span className="required-indicator">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-control amount-input ${errors.amount ? 'is-invalid' : ''}`}
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle me-1"></i>
                  {errors.amount}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="date" className="form-label">
                Date
                <span className="required-indicator">*</span>
              </label>
              <input
                type="date"
                className={`form-control date-input ${errors.date ? 'is-invalid' : ''}`}
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.date && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle me-1"></i>
                  {errors.date}
                </div>
              )}
            </div>

            <div className="col-12">
              <label htmlFor="status" className="form-label">Status</label>
              <div className="status-options">
                {[
                  { value: 'PROPOSAL', label: 'Proposal', icon: 'fa-file-contract', color: 'primary' },
                  { value: 'NEGOTIATION', label: 'Negotiation', icon: 'fa-handshake', color: 'warning' },
                  { value: 'CLOSED_WON', label: 'Won', icon: 'fa-trophy', color: 'success' },
                  { value: 'CLOSED_LOST', label: 'Lost', icon: 'fa-times-circle', color: 'danger' }
                ].map(option => (
                  <div key={option.value} className="status-option">
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      id={`status-${option.value}`}
                      checked={formData.status === option.value}
                      onChange={handleChange}
                      disabled={loading}
                      className="status-radio"
                    />
                    <label 
                      htmlFor={`status-${option.value}`} 
                      className={`status-label status-${option.color} ${formData.status === option.value ? 'active' : ''}`}
                    >
                      <i className={`fas ${option.icon} me-2`}></i>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12">
              <label htmlFor="notes" className="form-label">
                <i className="fas fa-sticky-note me-1"></i>
                Notes
              </label>
              <textarea
                className="form-control notes-textarea"
                id="notes"
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                disabled={loading}
                placeholder="Add any additional notes about this sale opportunity..."
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            <i className="fas fa-times me-2"></i>
            Cancel
          </button>
          
          <div className="action-buttons">
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
              type="submit" 
              className="btn btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Creating Sale...
                </>
              ) : (
                <>
                  <i className="fas fa-check me-2"></i>
                  Create Sale
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SaleForm;