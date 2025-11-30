import React, { useState, useEffect } from 'react';
import { saleAPI } from '../services/api';
import SaleForm from './SaleForm';
import './SaleList.css'; // We'll create this CSS file

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  // Dummy data for demonstration
  const dummySales = [
    {
      id: 1,
      customer: { name: 'John Smith', company: 'Tech Corp' },
      amount: 15000,
      status: 'PROPOSAL',
      date: '2024-01-15',
      assignedSalesRep: { fullName: 'Alice Johnson' }
    },
    {
      id: 2,
      customer: { name: 'Sarah Wilson', company: 'Innovate Inc' },
      amount: 25000,
      status: 'NEGOTIATION',
      date: '2024-01-14',
      assignedSalesRep: { fullName: 'Bob Brown' }
    },
    {
      id: 3,
      customer: { name: 'Mike Davis', company: 'Global Solutions' },
      amount: 50000,
      status: 'CLOSED_WON',
      date: '2024-01-10',
      assignedSalesRep: { fullName: 'Alice Johnson' }
    },
    {
      id: 4,
      customer: { name: 'Emily Chen', company: 'StartUp Labs' },
      amount: 12000,
      status: 'CLOSED_LOST',
      date: '2024-01-08',
      assignedSalesRep: { fullName: 'Bob Brown' }
    }
  ];

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      setError(null);
      // Try to load real data first, fallback to dummy data
      const response = await saleAPI.getAll();
      setSales(response.data.length > 0 ? response.data : dummySales);
    } catch (error) {
      console.error('Error loading sales:', error);
      setError('Failed to load sales data. Showing demo data.');
      setSales(dummySales); // Fallback to dummy data
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PROPOSAL: 'status-proposal',
      NEGOTIATION: 'status-negotiation',
      CLOSED_WON: 'status-won',
      CLOSED_LOST: 'status-lost'
    };
    return statusConfig[status] || 'status-default';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      PROPOSAL: 'Proposal',
      NEGOTIATION: 'Negotiation',
      CLOSED_WON: 'Won',
      CLOSED_LOST: 'Lost'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="sale-list-container">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading sales...</span>
          </div>
          <p className="mt-2 text-muted">Loading sales data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sale-list-container">
      {/* Header Section */}
      <div className="sale-list-header">
        <div className="header-content">
          <h1 className="page-title">
            <i className="fas fa-chart-line me-3"></i>
            Sales Pipeline
          </h1>
          <p className="page-subtitle">Manage and track your sales opportunities</p>
        </div>
        <button 
          className="btn btn-primary btn-add-sale"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Add New Sale
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
        <div className="stat-card">
          <div className="stat-icon total">
            <i className="fas fa-list"></i>
          </div>
          <div className="stat-content">
            <h3>{sales.length}</h3>
            <p>Total Sales</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon proposal">
            <i className="fas fa-file-contract"></i>
          </div>
          <div className="stat-content">
            <h3>{sales.filter(s => s.status === 'PROPOSAL').length}</h3>
            <p>Proposals</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon negotiation">
            <i className="fas fa-handshake"></i>
          </div>
          <div className="stat-content">
            <h3>{sales.filter(s => s.status === 'NEGOTIATION').length}</h3>
            <p>Negotiations</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon won">
            <i className="fas fa-trophy"></i>
          </div>
          <div className="stat-content">
            <h3>{sales.filter(s => s.status === 'CLOSED_WON').length}</h3>
            <p>Won Deals</p>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      {sales.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <h3>No Sales Records</h3>
          <p className="text-muted">Start building your sales pipeline by adding your first sale.</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => setShowForm(true)}
          >
            <i className="fas fa-plus me-2"></i>
            Add Your First Sale
          </button>
        </div>
      ) : (
        <div className="sales-table-container">
          <div className="table-card">
            <div className="table-responsive">
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Sales Rep</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(sale => (
                    <tr key={sale.id} className="sale-row">
                      <td>
                        <div className="customer-info">
                          <strong className="customer-name">{sale.customer?.name}</strong>
                          {sale.customer?.company && (
                            <small className="company-name text-muted">{sale.customer.company}</small>
                          )}
                        </div>
                      </td>
                      <td className="amount-cell">
                        <span className="amount">{formatCurrency(sale.amount)}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadge(sale.status)}`}>
                          {getStatusDisplay(sale.status)}
                        </span>
                      </td>
                      <td className="date-cell">
                        {formatDate(sale.date)}
                      </td>
                      <td>
                        <div className="sales-rep">
                          <i className="fas fa-user me-2 text-muted"></i>
                          {sale.assignedSalesRep ? sale.assignedSalesRep.fullName : 'Unassigned'}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-action btn-edit"
                            title="Edit Sale"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-action btn-delete"
                            title="Delete Sale"
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

      {/* Sale Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-plus me-2"></i>
                  Add New Sale
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowForm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <SaleForm 
                  onSuccess={() => {
                    loadSales();
                    setShowForm(false);
                  }}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleList;