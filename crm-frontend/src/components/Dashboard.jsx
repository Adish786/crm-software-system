import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import { customerAPI, leadAPI, taskAPI, saleAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    leads: 0,
    tasks: 0,
    sales: 0,
    revenue: 0,
    conversionRate: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = getCurrentUser();

  // Dummy data for demonstration
  const dummyStats = {
    customers: 45,
    leads: 23,
    tasks: 12,
    sales: 8,
    revenue: 125000,
    conversionRate: 35
  };

  const dummyActivities = [
    {
      id: 1,
      type: 'lead',
      title: 'New Lead Added',
      description: 'Sarah Johnson from Global Consulting',
      time: '2 hours ago',
      icon: 'fa-bullseye',
      color: 'success'
    },
    {
      id: 2,
      type: 'sale',
      title: 'Sale Completed',
      description: 'Enterprise package sold to Tech Corp',
      time: '4 hours ago',
      icon: 'fa-chart-line',
      color: 'info'
    },
    {
      id: 3,
      type: 'task',
      title: 'Task Overdue',
      description: 'Follow up with Mike Davis',
      time: '1 day ago',
      icon: 'fa-tasks',
      color: 'warning'
    },
    {
      id: 4,
      type: 'customer',
      title: 'Customer Updated',
      description: 'John Smith contact information updated',
      time: '1 day ago',
      icon: 'fa-users',
      color: 'primary'
    },
    {
      id: 5,
      type: 'lead',
      title: 'Lead Converted',
      description: 'Emily Chen converted to customer',
      time: '2 days ago',
      icon: 'fa-check-circle',
      color: 'success'
    }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [customersRes, leadsRes, tasksRes, salesRes] = await Promise.all([
        customerAPI.getAll().catch(() => ({ data: [] })),
        leadAPI.getAll().catch(() => ({ data: [] })),
        taskAPI.getAll().catch(() => ({ data: [] })),
        saleAPI.getAll().catch(() => ({ data: [] }))
      ]);

      const customers = customersRes.data.length || dummyStats.customers;
      const leads = leadsRes.data.length || dummyStats.leads;
      const tasks = tasksRes.data.length || dummyStats.tasks;
      const sales = salesRes.data.length || dummyStats.sales;

      setStats({
        customers,
        leads,
        tasks,
        sales,
        revenue: dummyStats.revenue,
        conversionRate: Math.round((sales / Math.max(leads, 1)) * 100)
      });

      setRecentActivities(dummyActivities);

      // Show demo mode if using dummy data
      if (!customersRes.data.length) {
        setError('Using demo data. Connect to backend for real statistics.');
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Showing demo statistics.');
      setStats(dummyStats);
      setRecentActivities(dummyActivities);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner" role="status">
            <div className="spinner-circle"></div>
          </div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="page-title">
            {getGreeting()}, {user?.name || user?.email?.split('@')[0]}!
          </h1>
          <p className="page-subtitle">
            Here's what's happening with your business today
          </p>
        </div>
        <div className="header-actions">
          <div className="date-display">
            <i className="fas fa-calendar me-2"></i>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Demo Mode Alert */}
      {error && (
        <div className="demo-alert">
          <div className="alert-content">
            <i className="fas fa-info-circle"></i>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card customers">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.customers}</h3>
            <p className="stat-label">Total Customers</p>
            <div className="stat-trend positive">
              <i className="fas fa-arrow-up"></i>
              <span>12% from last month</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="chart-bar" style={{ height: '70%' }}></div>
            <div className="chart-bar" style={{ height: '85%' }}></div>
            <div className="chart-bar" style={{ height: '60%' }}></div>
            <div className="chart-bar" style={{ height: '90%' }}></div>
          </div>
        </div>

        <div className="stat-card leads">
          <div className="stat-icon">
            <i className="fas fa-bullseye"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.leads}</h3>
            <p className="stat-label">Active Leads</p>
            <div className="stat-trend positive">
              <i className="fas fa-arrow-up"></i>
              <span>8% from last week</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="chart-bar" style={{ height: '60%' }}></div>
            <div className="chart-bar" style={{ height: '75%' }}></div>
            <div className="chart-bar" style={{ height: '80%' }}></div>
            <div className="chart-bar" style={{ height: '65%' }}></div>
          </div>
        </div>

        <div className="stat-card tasks">
          <div className="stat-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.tasks}</h3>
            <p className="stat-label">Pending Tasks</p>
            <div className="stat-trend negative">
              <i className="fas fa-exclamation-circle"></i>
              <span>3 overdue tasks</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="chart-bar" style={{ height: '90%' }}></div>
            <div className="chart-bar" style={{ height: '65%' }}></div>
            <div className="chart-bar" style={{ height: '80%' }}></div>
            <div className="chart-bar" style={{ height: '70%' }}></div>
          </div>
        </div>

        <div className="stat-card sales">
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.sales}</h3>
            <p className="stat-label">Sales Pipeline</p>
            <div className="stat-trend positive">
              <i className="fas fa-arrow-up"></i>
              <span>15% from last month</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="chart-bar" style={{ height: '50%' }}></div>
            <div className="chart-bar" style={{ height: '70%' }}></div>
            <div className="chart-bar" style={{ height: '85%' }}></div>
            <div className="chart-bar" style={{ height: '95%' }}></div>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{formatCurrency(stats.revenue)}</h3>
            <p className="stat-label">Total Revenue</p>
            <div className="stat-trend positive">
              <i className="fas fa-arrow-up"></i>
              <span>22% from last quarter</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="chart-line"></div>
          </div>
        </div>

        <div className="stat-card conversion">
          <div className="stat-icon">
            <i className="fas fa-percentage"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.conversionRate}%</h3>
            <p className="stat-label">Conversion Rate</p>
            <div className="stat-trend positive">
              <i className="fas fa-arrow-up"></i>
              <span>5% improvement</span>
            </div>
          </div>
          <div className="stat-chart">
            <div className="chart-donut">
              <div className="donut-segment" style={{ '--percentage': stats.conversionRate }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Quick Actions */}
        <div className="content-card quick-actions">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-bolt me-2"></i>
              Quick Actions
            </h3>
            <p className="card-subtitle">Frequently used features</p>
          </div>
          <div className="card-body">
            <div className="actions-grid">
              <Link to="/customers" className="action-card">
                <div className="action-icon customers">
                  <i className="fas fa-users"></i>
                </div>
                <div className="action-content">
                  <h4>Customers</h4>
                  <p>Manage customer relationships</p>
                </div>
                <div className="action-arrow">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </Link>

              <Link to="/leads" className="action-card">
                <div className="action-icon leads">
                  <i className="fas fa-bullseye"></i>
                </div>
                <div className="action-content">
                  <h4>Leads</h4>
                  <p>Track potential customers</p>
                </div>
                <div className="action-arrow">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </Link>

              <Link to="/tasks" className="action-card">
                <div className="action-icon tasks">
                  <i className="fas fa-tasks"></i>
                </div>
                <div className="action-content">
                  <h4>Tasks</h4>
                  <p>Manage your workflow</p>
                </div>
                <div className="action-arrow">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </Link>

              <Link to="/sales" className="action-card">
                <div className="action-icon sales">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="action-content">
                  <h4>Sales</h4>
                  <p>Monitor sales pipeline</p>
                </div>
                <div className="action-arrow">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </Link>

              <Link to="/customers?action=create" className="action-card">
                <div className="action-icon add-customer">
                  <i className="fas fa-user-plus"></i>
                </div>
                <div className="action-content">
                  <h4>Add Customer</h4>
                  <p>Create new customer record</p>
                </div>
                <div className="action-arrow">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </Link>

              <Link to="/tasks?action=create" className="action-card">
                <div className="action-icon add-task">
                  <i className="fas fa-plus-circle"></i>
                </div>
                <div className="action-content">
                  <h4>Create Task</h4>
                  <p>Add new task to list</p>
                </div>
                <div className="action-arrow">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="content-card recent-activities">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-history me-2"></i>
              Recent Activities
            </h3>
            <p className="card-subtitle">Latest updates in your system</p>
          </div>
          <div className="card-body">
            <div className="activities-list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-icon ${activity.color}`}>
                    <i className={`fas ${activity.icon}`}></i>
                  </div>
                  <div className="activity-content">
                    <h5 className="activity-title">{activity.title}</h5>
                    <p className="activity-description">{activity.description}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                  <div className="activity-arrow">
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="content-card performance">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-trophy me-2"></i>
              Performance
            </h3>
            <p className="card-subtitle">Your key metrics</p>
          </div>
          <div className="card-body">
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-value">{stats.conversionRate}%</div>
                <div className="metric-label">Lead Conversion</div>
                <div className="metric-progress">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${stats.conversionRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-value">{Math.round(stats.tasks * 0.3)}</div>
                <div className="metric-label">Tasks Completed</div>
                <div className="metric-progress">
                  <div 
                    className="progress-bar" 
                    style={{ width: '30%' }}
                  ></div>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-value">{stats.leads}</div>
                <div className="metric-label">New Leads This Month</div>
                <div className="metric-progress">
                  <div 
                    className="progress-bar" 
                    style={{ width: '75%' }}
                  ></div>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-value">{stats.customers}</div>
                <div className="metric-label">Active Customers</div>
                <div className="metric-progress">
                  <div 
                    className="progress-bar" 
                    style={{ width: '90%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;