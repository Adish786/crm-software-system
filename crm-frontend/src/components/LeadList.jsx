import React, { useState, useEffect } from 'react';
import { leadAPI } from '../services/api';
import LeadForm from './LeadForm';
import './LeadList.css';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Dummy data for demonstration
  const dummyLeads = [
    {
      id: 1,
      name: 'John Smith',
      contactInfo: 'john.smith@techcorp.com',
      source: 'WEB',
      status: 'NEW',
      assignedSalesRep: { fullName: 'Alice Johnson' },
      company: 'Tech Corp',
      createdDate: '2024-01-15',
      updatedDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      contactInfo: '+1 (555) 123-4567',
      source: 'REFERRAL',
      status: 'CONTACTED',
      assignedSalesRep: { fullName: 'Bob Brown' },
      company: 'Innovate Inc',
      createdDate: '2024-01-14',
      updatedDate: '2024-01-14'
    },
    {
      id: 3,
      name: 'Mike Davis',
      contactInfo: 'mike.davis@global.com',
      source: 'ADS',
      status: 'CONVERTED',
      assignedSalesRep: { fullName: 'Alice Johnson' },
      company: 'Global Solutions',
      createdDate: '2024-01-10',
      updatedDate: '2024-01-12'
    },
    {
      id: 4,
      name: 'Emily Chen',
      contactInfo: 'emily@startuplabs.com',
      source: 'WEB',
      status: 'LOST',
      assignedSalesRep: { fullName: 'Bob Brown' },
      company: 'StartUp Labs',
      createdDate: '2024-01-08',
      updatedDate: '2024-01-09'
    },
    {
      id: 5,
      name: 'Alex Johnson',
      contactInfo: 'alex@digitalventures.com',
      source: 'SOCIAL',
      status: 'NEW',
      assignedSalesRep: null,
      company: 'Digital Ventures',
      createdDate: '2024-01-07',
      updatedDate: '2024-01-07'
    }
  ];

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await leadAPI.getAll();
      setLeads(response.data.length > 0 ? response.data : dummyLeads);
    } catch (error) {
      console.error('Error loading leads:', error);
      setError('Failed to load leads. Showing demo data.');
      setLeads(dummyLeads);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadAPI.delete(id);
        loadLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
        alert('Failed to delete lead. Please try again.');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      NEW: 'status-new',
      CONTACTED: 'status-contacted',
      CONVERTED: 'status-converted',
      LOST: 'status-lost',
      QUALIFIED: 'status-qualified',
      PROPOSAL: 'status-proposal',
      NEGOTIATION: 'status-negotiation'
    };
    return statusConfig[status] || 'status-default';
  };

  const getSourceBadge = (source) => {
    const sourceConfig = {
      REFERRAL: 'source-referral',
      ADS: 'source-ads',
      WEB: 'source-web',
      SOCIAL: 'source-social',
      EVENT: 'source-event',
      COLD_CALL: 'source-cold-call'
    };
    return sourceConfig[source] || 'source-default';
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      NEW: 'New',
      CONTACTED: 'Contacted',
      CONVERTED: 'Converted',
      LOST: 'Lost',
      QUALIFIED: 'Qualified',
      PROPOSAL: 'Proposal',
      NEGOTIATION: 'Negotiation'
    };
    return statusMap[status] || status;
  };

  const getSourceDisplay = (source) => {
    const sourceMap = {
      WEB: 'Website',
      ADS: 'Advertising',
      REFERRAL: 'Referral',
      SOCIAL: 'Social Media',
      EVENT: 'Event',
      COLD_CALL: 'Cold Call'
    };
    return sourceMap[source] || source;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter leads based on status and search term
  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === 'ALL' || lead.status === filter;
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.contactInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    ALL: leads.length,
    NEW: leads.filter(lead => lead.status === 'NEW').length,
    CONTACTED: leads.filter(lead => lead.status === 'CONTACTED').length,
    CONVERTED: leads.filter(lead => lead.status === 'CONVERTED').length,
    LOST: leads.filter(lead => lead.status === 'LOST').length
  };

  if (loading) {
    return (
      <div className="lead-list-container">
        <div className="loading-spinner">
          <div className="spinner" role="status">
            <div className="spinner-circle"></div>
          </div>
          <p className="loading-text">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lead-list-container">
      {/* Header Section */}
      <div className="lead-list-header">
        <div className="header-content">
          <h1 className="page-title">
            <i className="fas fa-bullseye me-3"></i>
            Leads Management
          </h1>
          <p className="page-subtitle">Track and manage your sales leads</p>
        </div>
        <button 
          className="btn btn-add-lead"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Add New Lead
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
            <i className="fas fa-list"></i>
          </div>
          <div className="stat-content">
            <h3>{statusCounts.ALL}</h3>
            <p>Total Leads</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setFilter('NEW')}>
          <div className="stat-icon new">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-content">
            <h3>{statusCounts.NEW}</h3>
            <p>New Leads</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setFilter('CONTACTED')}>
          <div className="stat-icon contacted">
            <i className="fas fa-phone"></i>
          </div>
          <div className="stat-content">
            <h3>{statusCounts.CONTACTED}</h3>
            <p>Contacted</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setFilter('CONVERTED')}>
          <div className="stat-icon converted">
            <i className="fas fa-trophy"></i>
          </div>
          <div className="stat-content">
            <h3>{statusCounts.CONVERTED}</h3>
            <p>Converted</p>
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
            placeholder="Search leads by name, email, or company..."
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
        
        <div className="filter-buttons">
          {['ALL', 'NEW', 'CONTACTED', 'CONVERTED', 'LOST'].map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {getStatusDisplay(status)}
              <span className="filter-count">{statusCounts[status]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      {filteredLeads.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-bullseye"></i>
          </div>
          <h3>No Leads Found</h3>
          <p className="text-muted">
            {searchTerm || filter !== 'ALL' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Start building your lead pipeline by adding your first lead'
            }
          </p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => setShowForm(true)}
          >
            <i className="fas fa-plus me-2"></i>
            Add Your First Lead
          </button>
        </div>
      ) : (
        <div className="leads-table-container">
          <div className="table-card">
            <div className="table-header">
              <h4>Leads ({filteredLeads.length})</h4>
              <div className="table-actions">
                <button className="btn btn-export">
                  <i className="fas fa-download me-2"></i>
                  Export
                </button>
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Contact</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Sales Rep</th>
                    <th>Last Updated</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(lead => (
                    <tr key={lead.id} className="lead-row">
                      <td>
                        <div className="lead-info">
                          <div className="lead-name">{lead.name}</div>
                          {lead.company && (
                            <div className="lead-company">{lead.company}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div className="contact-value">{lead.contactInfo}</div>
                          <div className="contact-type">
                            {lead.contactInfo.includes('@') ? 'Email' : 'Phone'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`source-badge ${getSourceBadge(lead.source)}`}>
                          <i className={`fas ${lead.source === 'WEB' ? 'fa-globe' : 
                                       lead.source === 'ADS' ? 'fa-ad' : 
                                       lead.source === 'REFERRAL' ? 'fa-user-friends' : 
                                       lead.source === 'SOCIAL' ? 'fa-share-alt' : 'fa-bullhorn'} me-1`}></i>
                          {getSourceDisplay(lead.source)}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadge(lead.status)}`}>
                          {getStatusDisplay(lead.status)}
                        </span>
                      </td>
                      <td>
                        <div className="sales-rep">
                          {lead.assignedSalesRep ? (
                            <>
                              <div className="rep-avatar">
                                {lead.assignedSalesRep.fullName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="rep-name">{lead.assignedSalesRep.fullName}</span>
                            </>
                          ) : (
                            <span className="unassigned">Unassigned</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="date-info">
                          {formatDate(lead.updatedDate || lead.createdDate)}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-action btn-edit"
                            title="Edit Lead"
                            onClick={() => setEditingLead(lead)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-action btn-delete"
                            title="Delete Lead"
                            onClick={() => handleDelete(lead.id)}
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

      {/* Lead Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-plus me-2"></i>
                  Add New Lead
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowForm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <LeadForm 
                  onSuccess={() => {
                    loadLeads();
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

export default LeadList;