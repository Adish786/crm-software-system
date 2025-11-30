import React, { useState, useEffect } from 'react';
import { customerAPI } from '../services/api';
import CustomerForm from './CustomerForm';
import './CustomerList.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [error, setError] = useState(null);

  // Dummy data for demonstration
  const dummyCustomers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Innovations Inc.',
      address: '123 Tech Street, San Francisco, CA 94102',
      notes: 'Interested in enterprise solutions',
      assignedSalesRep: { fullName: 'Alice Johnson' },
      createdDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@globalconsulting.com',
      phone: '+1 (555) 987-6543',
      company: 'Global Consulting Partners',
      address: '456 Business Ave, New York, NY 10001',
      notes: 'Key decision maker',
      assignedSalesRep: { fullName: 'Bob Brown' },
      createdDate: '2024-01-14'
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.davis@startuplabs.com',
      phone: '+1 (555) 456-7890',
      company: 'StartUp Labs',
      address: '789 Innovation Drive, Austin, TX 73301',
      notes: 'Early stage startup',
      assignedSalesRep: null,
      createdDate: '2024-01-10'
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily.chen@designstudio.com',
      phone: '+1 (555) 234-5678',
      company: 'Creative Design Studio',
      address: '321 Artisan Lane, Los Angeles, CA 90001',
      notes: 'Design agency looking for CRM',
      assignedSalesRep: { fullName: 'Alice Johnson' },
      createdDate: '2024-01-08'
    },
    {
      id: 5,
      name: 'Alex Rodriguez',
      email: 'alex.r@manufacturingco.com',
      phone: '+1 (555) 345-6789',
      company: 'Precision Manufacturing Co.',
      address: '654 Industrial Way, Chicago, IL 60601',
      notes: 'Manufacturing company expanding sales team',
      assignedSalesRep: { fullName: 'Bob Brown' },
      createdDate: '2024-01-05'
    }
  ];

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerAPI.getAll();
      setCustomers(response.data.length > 0 ? response.data : dummyCustomers);
    } catch (error) {
      console.error('Error loading customers:', error);
      setError('Failed to load customers. Showing demo data.');
      setCustomers(dummyCustomers);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        await customerAPI.delete(id);
        await loadCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer. Please try again.');
      }
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleFormSuccess = () => {
    loadCustomers();
    handleFormClose();
  };

  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = 
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm);
      
      const matchesFilter = filter === 'ALL' || 
        (filter === 'ASSIGNED' && customer.assignedSalesRep) ||
        (filter === 'UNASSIGNED' && !customer.assignedSalesRep);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      
      if (sortDirection === 'asc') {
        return aValue.toString().localeCompare(bValue.toString());
      } else {
        return bValue.toString().localeCompare(aValue.toString());
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return 'fa-sort';
    return sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  };

  const stats = {
    total: customers.length,
    assigned: customers.filter(c => c.assignedSalesRep).length,
    unassigned: customers.filter(c => !c.assignedSalesRep).length
  };

  if (loading && customers.length === 0) {
    return (
      <div className="customer-list-container">
        <div className="loading-spinner">
          <div className="spinner" role="status">
            <div className="spinner-circle"></div>
          </div>
          <p className="loading-text">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-list-container">
      {/* Header Section */}
      <div className="customer-list-header">
        <div className="header-content">
          <h1 className="page-title">
            <i className="fas fa-users me-3"></i>
            Customer Management
          </h1>
          <p className="page-subtitle">Manage your customer relationships and information</p>
        </div>
        <button 
          className="btn btn-add-customer"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Add New Customer
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Stats Summary */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => setFilter('ALL')}>
          <div className="stat-icon total">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Customers</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setFilter('ASSIGNED')}>
          <div className="stat-icon assigned">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.assigned}</h3>
            <p>Assigned</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setFilter('UNASSIGNED')}>
          <div className="stat-icon unassigned">
            <i className="fas fa-user-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.unassigned}</h3>
            <p>Unassigned</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search customers by name, email, company, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <label className="filter-label">Filter by</label>
            <div className="filter-buttons">
              {[
                { value: 'ALL', label: 'All Customers', icon: 'fa-users' },
                { value: 'ASSIGNED', label: 'Assigned', icon: 'fa-user-check' },
                { value: 'UNASSIGNED', label: 'Unassigned', icon: 'fa-user-clock' }
              ].map(option => (
                <button
                  key={option.value}
                  className={`filter-btn ${filter === option.value ? 'active' : ''}`}
                  onClick={() => setFilter(option.value)}
                >
                  <i className={`fas ${option.icon} me-2`}></i>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort by</label>
            <div className="sort-buttons">
              {[
                { field: 'name', label: 'Name', icon: 'fa-sort-alpha-down' },
                { field: 'company', label: 'Company', icon: 'fa-building' },
                { field: 'createdDate', label: 'Date Added', icon: 'fa-calendar' }
              ].map(option => (
                <button
                  key={option.field}
                  className={`sort-btn ${sortBy === option.field ? 'active' : ''}`}
                  onClick={() => handleSort(option.field)}
                >
                  <i className={`fas ${option.icon} me-2`}></i>
                  {option.label}
                  <i className={`fas ${getSortIcon(option.field)} ms-2`}></i>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      {filteredCustomers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-users"></i>
          </div>
          <h3>No Customers Found</h3>
          <p className="text-muted">
            {searchTerm || filter !== 'ALL' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Start building your customer database by adding your first customer'
            }
          </p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => setShowForm(true)}
          >
            <i className="fas fa-plus me-2"></i>
            Add Your First Customer
          </button>
        </div>
      ) : (
        <div className="customers-table-container">
          <div className="table-card">
            <div className="table-header">
              <h4>Customers ({filteredCustomers.length})</h4>
              <div className="table-actions">
                <button className="btn btn-export">
                  <i className="fas fa-download me-2"></i>
                  Export
                </button>
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')}>
                      <span className="table-header-content">
                        Customer
                        <i className={`fas ${getSortIcon('name')}`}></i>
                      </span>
                    </th>
                    <th onClick={() => handleSort('email')}>
                      <span className="table-header-content">
                        Contact
                        <i className={`fas ${getSortIcon('email')}`}></i>
                      </span>
                    </th>
                    <th onClick={() => handleSort('company')}>
                      <span className="table-header-content">
                        Company
                        <i className={`fas ${getSortIcon('company')}`}></i>
                      </span>
                    </th>
                    <th>Sales Rep</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(customer => (
                    <tr key={customer.id} className="customer-row">
                      <td>
                        <div className="customer-info">
                          <div className="customer-avatar">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="customer-details">
                            <div className="customer-name">{customer.name}</div>
                            <div className="customer-phone">{customer.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <a href={`mailto:${customer.email}`} className="customer-email">
                            <i className="fas fa-envelope me-2"></i>
                            {customer.email}
                          </a>
                        </div>
                      </td>
                      <td>
                        <div className="company-info">
                          {customer.company ? (
                            <>
                              <i className="fas fa-building me-2"></i>
                              {customer.company}
                            </>
                          ) : (
                            <span className="no-company">-</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="sales-rep">
                          {customer.assignedSalesRep ? (
                            <div className="assigned-rep">
                              <div className="rep-avatar">
                                {customer.assignedSalesRep.fullName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="rep-name">{customer.assignedSalesRep.fullName}</span>
                            </div>
                          ) : (
                            <span className="unassigned">Unassigned</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-action btn-edit"
                            title="Edit Customer"
                            onClick={() => handleEdit(customer)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-action btn-delete"
                            title="Delete Customer"
                            onClick={() => handleDelete(customer.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                          <button 
                            className="btn btn-action btn-view"
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Customer Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user me-2"></i>
                  {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleFormClose}
                ></button>
              </div>
              <div className="modal-body">
                <CustomerForm 
                  customer={editingCustomer}
                  onSuccess={handleFormSuccess}
                  onCancel={handleFormClose}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;