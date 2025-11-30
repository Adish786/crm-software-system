import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import TaskForm from './TaskForm';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [error, setError] = useState(null);

  // Dummy data for demonstration
  const dummyTasks = [
    {
      id: 1,
      title: 'Follow up with potential client',
      description: 'Call John Smith to discuss product demo and answer questions about pricing.',
      dueDate: '2024-01-20',
      priority: 'HIGH',
      status: 'OPEN',
      assignedTo: { fullName: 'Alice Johnson' },
      createdDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Prepare quarterly sales report',
      description: 'Compile sales data and create presentation for quarterly review meeting.',
      dueDate: '2024-01-25',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      assignedTo: { fullName: 'Bob Brown' },
      createdDate: '2024-01-14'
    },
    {
      id: 3,
      title: 'Update customer database',
      description: 'Verify and update contact information for all customers in the system.',
      dueDate: '2024-01-30',
      priority: 'LOW',
      status: 'COMPLETED',
      assignedTo: { fullName: 'Carol Davis' },
      createdDate: '2024-01-10'
    },
    {
      id: 4,
      title: 'Team training session',
      description: 'Organize and conduct training on new product features for sales team.',
      dueDate: '2024-01-22',
      priority: 'HIGH',
      status: 'OPEN',
      assignedTo: { fullName: 'David Wilson' },
      createdDate: '2024-01-12'
    },
    {
      id: 5,
      title: 'Client proposal review',
      description: 'Review and finalize proposal for Enterprise Solutions Inc.',
      dueDate: '2024-01-18',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      assignedTo: { fullName: 'Eva Garcia' },
      createdDate: '2024-01-11'
    },
    {
      id: 6,
      title: 'Marketing campaign analysis',
      description: 'Analyze performance metrics from Q4 marketing campaigns.',
      dueDate: '2024-02-01',
      priority: 'LOW',
      status: 'OPEN',
      assignedTo: null,
      createdDate: '2024-01-09'
    }
  ];

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskAPI.getAll();
      setTasks(response.data.length > 0 ? response.data : dummyTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError('Failed to load tasks. Showing demo data.');
      setTasks(dummyTasks);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.delete(id);
        loadTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, { status: newStatus });
      loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status.');
    }
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      HIGH: 'priority-high',
      MEDIUM: 'priority-medium',
      LOW: 'priority-low'
    };
    return priorityConfig[priority] || 'priority-default';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      OPEN: 'status-open',
      IN_PROGRESS: 'status-progress',
      COMPLETED: 'status-completed'
    };
    return statusConfig[status] || 'status-default';
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date().setHours(0, 0, 0, 0);
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date().setHours(0, 0, 0, 0);
    const due = new Date(dueDate).setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      const matchesFilter = filter === 'ALL' || task.status === filter;
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
        case 'priority':
          const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const statusCounts = {
    ALL: tasks.length,
    OPEN: tasks.filter(task => task.status === 'OPEN').length,
    IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS').length,
    COMPLETED: tasks.filter(task => task.status === 'COMPLETED').length
  };

  const priorityCounts = {
    HIGH: tasks.filter(task => task.priority === 'HIGH').length,
    MEDIUM: tasks.filter(task => task.priority === 'MEDIUM').length,
    LOW: tasks.filter(task => task.priority === 'LOW').length
  };

  if (loading) {
    return (
      <div className="task-list-container">
        <div className="loading-spinner">
          <div className="spinner" role="status">
            <div className="spinner-circle"></div>
          </div>
          <p className="loading-text">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      {/* Header Section */}
      <div className="task-list-header">
        <div className="header-content">
          <h1 className="page-title">
            <i className="fas fa-tasks me-3"></i>
            Task Management
          </h1>
          <p className="page-subtitle">Organize and track your team's work</p>
        </div>
        <button 
          className="btn btn-add-task"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Add New Task
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
            <p>Total Tasks</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setFilter('OPEN')}>
          <div className="stat-icon open">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{statusCounts.OPEN}</h3>
            <p>Open</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setFilter('IN_PROGRESS')}>
          <div className="stat-icon progress">
            <i className="fas fa-spinner"></i>
          </div>
          <div className="stat-content">
            <h3>{statusCounts.IN_PROGRESS}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setFilter('COMPLETED')}>
          <div className="stat-icon completed">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{statusCounts.COMPLETED}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      {/* Priority Overview */}
      <div className="priority-overview">
        <h5 className="overview-title">Priority Overview</h5>
        <div className="priority-bars">
          <div className="priority-bar high" style={{ width: `${(priorityCounts.HIGH / tasks.length) * 100}%` }}>
            <span className="priority-label">
              <i className="fas fa-exclamation-circle me-1"></i>
              High: {priorityCounts.HIGH}
            </span>
          </div>
          <div className="priority-bar medium" style={{ width: `${(priorityCounts.MEDIUM / tasks.length) * 100}%` }}>
            <span className="priority-label">
              <i className="fas fa-minus-circle me-1"></i>
              Medium: {priorityCounts.MEDIUM}
            </span>
          </div>
          <div className="priority-bar low" style={{ width: `${(priorityCounts.LOW / tasks.length) * 100}%` }}>
            <span className="priority-label">
              <i className="fas fa-info-circle me-1"></i>
              Low: {priorityCounts.LOW}
            </span>
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
            placeholder="Search tasks by title or description..."
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
            <label htmlFor="status-filter" className="filter-label">Status</label>
            <select
              id="status-filter"
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-by" className="filter-label">Sort By</label>
            <select
              id="sort-by"
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Grid/Table */}
      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <h3>No Tasks Found</h3>
          <p className="text-muted">
            {searchTerm || filter !== 'ALL' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Start organizing your work by creating your first task'
            }
          </p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => setShowForm(true)}
          >
            <i className="fas fa-plus me-2"></i>
            Create Your First Task
          </button>
        </div>
      ) : (
        <div className="tasks-container">
          <div className="table-card">
            <div className="table-header">
              <h4>Tasks ({filteredTasks.length})</h4>
              <div className="table-actions">
                <button className="btn btn-export">
                  <i className="fas fa-download me-2"></i>
                  Export
                </button>
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="tasks-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(task => (
                    <tr key={task.id} className={`task-row ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                      <td>
                        <div className="task-info">
                          <div className="task-title">{task.title}</div>
                          {task.description && (
                            <div className="task-description">{task.description}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="due-date-cell">
                          <div className={`due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                            {formatDate(task.dueDate)}
                          </div>
                          {task.dueDate && !isOverdue(task.dueDate) && (
                            <div className="days-remaining">
                              {getDaysUntilDue(task.dueDate)} days left
                            </div>
                          )}
                          {isOverdue(task.dueDate) && (
                            <div className="overdue-label">
                              <i className="fas fa-exclamation-triangle me-1"></i>
                              Overdue
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`priority-badge ${getPriorityBadge(task.priority)}`}>
                          <i className={`fas ${getPriorityIcon(task.priority)} me-1`}></i>
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <div className="status-cell">
                          <span className={`status-badge ${getStatusBadge(task.status)}`}>
                            <i className={`fas ${getStatusIcon(task.status)} me-1`}></i>
                            {task.status.replace('_', ' ')}
                          </span>
                          <div className="status-actions">
                            {task.status !== 'COMPLETED' && (
                              <button
                                className="btn-status-complete"
                                onClick={() => handleStatusUpdate(task.id, 'COMPLETED')}
                                title="Mark as completed"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="assigned-to">
                          {task.assignedTo ? (
                            <>
                              <div className="user-avatar">
                                {task.assignedTo.fullName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="user-name">{task.assignedTo.fullName}</span>
                            </>
                          ) : (
                            <span className="unassigned">Unassigned</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-action btn-edit"
                            title="Edit Task"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-action btn-delete"
                            title="Delete Task"
                            onClick={() => handleDelete(task.id)}
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

      {/* Task Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-plus me-2"></i>
                  Add New Task
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowForm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <TaskForm 
                  onSuccess={() => {
                    loadTasks();
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

export default TaskList;