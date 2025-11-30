import React, { useState } from 'react';
import { taskAPI } from '../services/api';
import './TaskForm.css';

const TaskForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    status: 'OPEN',
    assignedTo: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDummyData, setShowDummyData] = useState(false);

  // Dummy data for team members
  const teamMembers = [
    { id: 1, name: 'Alice Johnson', role: 'Sales Manager' },
    { id: 2, name: 'Bob Brown', role: 'Sales Representative' },
    { id: 3, name: 'Carol Davis', role: 'Marketing Specialist' },
    { id: 4, name: 'David Wilson', role: 'Customer Support' },
    { id: 5, name: 'Eva Garcia', role: 'Sales Representative' }
  ];

  // Sample tasks for quick fill
  const sampleTasks = [
    {
      title: 'Follow up with potential client',
      description: 'Call John Smith to discuss product demo and answer questions about pricing.',
      dueDate: getTomorrowDate(),
      priority: 'HIGH',
      status: 'OPEN',
      assignedTo: '2'
    },
    {
      title: 'Prepare quarterly sales report',
      description: 'Compile sales data and create presentation for quarterly review meeting.',
      dueDate: getNextWeekDate(),
      priority: 'MEDIUM',
      status: 'OPEN',
      assignedTo: '1'
    },
    {
      title: 'Update customer database',
      description: 'Verify and update contact information for all customers in the system.',
      dueDate: getNextWeekDate(),
      priority: 'LOW',
      status: 'OPEN',
      assignedTo: '4'
    }
  ];

  function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  function getNextWeekDate() {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  }

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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (formData.dueDate && new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = 'Due date cannot be in the past';
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
      const taskData = {
        ...formData,
        assignedToId: formData.assignedTo || null
      };
      
      await taskAPI.create(taskData);
      onSuccess();
    } catch (error) {
      console.error('Error creating task:', error);
      // For demo purposes, simulate success with dummy data
      if (showDummyData) {
        console.log('Demo: Task created successfully!', formData);
        onSuccess();
      } else {
        alert('Failed to create task. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillWithSampleData = () => {
    const randomTask = sampleTasks[Math.floor(Math.random() * sampleTasks.length)];
    setFormData(randomTask);
    setShowDummyData(true);
  };

  const clearForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'MEDIUM',
      status: 'OPEN',
      assignedTo: ''
    });
    setErrors({});
    setShowDummyData(false);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'HIGH': return 'fa-exclamation-circle';
      case 'MEDIUM': return 'fa-minus-circle';
      case 'LOW': return 'fa-info-circle';
      default: return 'fa-circle';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OPEN': return 'fa-clock';
      case 'IN_PROGRESS': return 'fa-spinner';
      case 'COMPLETED': return 'fa-check-circle';
      default: return 'fa-circle';
    }
  };

  return (
    <div className="task-form-container">
      <div className="form-header">
        <div className="header-icon">
          <i className="fas fa-tasks"></i>
        </div>
        <div className="header-content">
          <h3 className="form-title">Create New Task</h3>
          <p className="form-subtitle">Add a new task to your workflow</p>
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

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-section">
          <h5 className="section-title">
            <i className="fas fa-edit me-2"></i>
            Task Details
          </h5>
          
          <div className="row g-3">
            <div className="col-12">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Task Title *
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="What needs to be done?"
                />
                {errors.title && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.title}
                  </div>
                )}
              </div>
            </div>

            <div className="col-12">
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  <i className="fas fa-align-left me-1"></i>
                  Description
                </label>
                <textarea
                  className="form-textarea"
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Describe the task in detail..."
                />
                <div className="textarea-counter">
                  {formData.description.length}/1000 characters
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h5 className="section-title">
            <i className="fas fa-cog me-2"></i>
            Task Settings
          </h5>
          
          <div className="row g-3">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="dueDate" className="form-label">
                  <i className="fas fa-calendar-alt me-1"></i>
                  Due Date
                </label>
                <div className="input-with-icon">
                  <input
                    type="date"
                    className={`form-input ${errors.dueDate ? 'error' : ''}`}
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    disabled={loading}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <i className="input-icon fas fa-calendar"></i>
                </div>
                {errors.dueDate && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.dueDate}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="assignedTo" className="form-label">
                  <i className="fas fa-user me-1"></i>
                  Assign To
                </label>
                <div className="select-wrapper">
                  <select
                    className="form-select"
                    id="assignedTo"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} - {member.role}
                      </option>
                    ))}
                  </select>
                  <i className="select-arrow fas fa-chevron-down"></i>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-flag me-1"></i>
                  Priority
                </label>
                <div className="priority-options">
                  {[
                    { value: 'LOW', label: 'Low', color: 'success', icon: 'fa-info-circle' },
                    { value: 'MEDIUM', label: 'Medium', color: 'warning', icon: 'fa-minus-circle' },
                    { value: 'HIGH', label: 'High', color: 'danger', icon: 'fa-exclamation-circle' }
                  ].map(option => (
                    <div key={option.value} className="priority-option">
                      <input
                        type="radio"
                        name="priority"
                        value={option.value}
                        id={`priority-${option.value}`}
                        checked={formData.priority === option.value}
                        onChange={handleChange}
                        disabled={loading}
                        className="priority-radio"
                      />
                      <label 
                        htmlFor={`priority-${option.value}`} 
                        className={`priority-label priority-${option.color} ${formData.priority === option.value ? 'active' : ''}`}
                      >
                        <i className={`fas ${option.icon} me-2`}></i>
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-tasks me-1"></i>
                  Status
                </label>
                <div className="status-options">
                  {[
                    { value: 'OPEN', label: 'Open', color: 'primary', icon: 'fa-clock' },
                    { value: 'IN_PROGRESS', label: 'In Progress', color: 'warning', icon: 'fa-spinner' },
                    { value: 'COMPLETED', label: 'Completed', color: 'success', icon: 'fa-check-circle' }
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
            </div>
          </div>
        </div>

        {/* Task Preview */}
        {formData.title && (
          <div className="form-section">
            <h5 className="section-title">
              <i className="fas fa-eye me-2"></i>
              Task Preview
            </h5>
            <div className="task-preview">
              <div className="preview-header">
                <h6 className="preview-title">{formData.title}</h6>
                <div className="preview-badges">
                  <span className={`badge priority-${formData.priority.toLowerCase()}`}>
                    <i className={`fas ${getPriorityIcon(formData.priority)} me-1`}></i>
                    {formData.priority}
                  </span>
                  <span className={`badge status-${formData.status.toLowerCase().replace('_', '-')}`}>
                    <i className={`fas ${getStatusIcon(formData.status)} me-1`}></i>
                    {formData.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              {formData.description && (
                <p className="preview-description">{formData.description}</p>
              )}
              <div className="preview-footer">
                {formData.dueDate && (
                  <div className="preview-due-date">
                    <i className="fas fa-calendar me-1"></i>
                    Due: {new Date(formData.dueDate).toLocaleDateString()}
                  </div>
                )}
                {formData.assignedTo && (
                  <div className="preview-assigned">
                    <i className="fas fa-user me-1"></i>
                    Assigned to: {teamMembers.find(m => m.id == formData.assignedTo)?.name}
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
                  Creating Task...
                </>
              ) : (
                <>
                  <i className="fas fa-plus me-2"></i>
                  Create Task
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;