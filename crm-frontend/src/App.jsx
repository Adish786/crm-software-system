import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom'; // Add Link import
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CustomerList from './components/CustomerList';
import LeadList from './components/LeadList';
import TaskList from './components/TaskList';
import SaleList from './components/SaleList';
import { getCurrentUser, removeToken, removeCurrentUser } from './utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    navigate('/');
  };

  const handleLogout = () => {
    removeToken();
    removeCurrentUser();
    setUser(null);
    navigate('/');
  };

  // Redirect to login if not authenticated and not on auth pages
  useEffect(() => {
    if (!user && location.pathname !== '/' && !location.pathname.includes('login')) {
      navigate('/');
    }
  }, [user, location, navigate]);

  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login 
        onLogin={handleLogin} 
        onSwitchToRegister={() => setShowRegister(true)} 
      />
    );
  }

  return (
    <div className="App">
      {/* Navigation Header - FIXED WITH LINK COMPONENTS */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="fas fa-chart-line me-2"></i>
            CRM System
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                  to="/"
                >
                  <i className="fas fa-tachometer-alt me-1"></i>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/customers' ? 'active' : ''}`} 
                  to="/customers"
                >
                  <i className="fas fa-users me-1"></i>
                  Customers
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/leads' ? 'active' : ''}`} 
                  to="/leads"
                >
                  <i className="fas fa-bullseye me-1"></i>
                  Leads
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/tasks' ? 'active' : ''}`} 
                  to="/tasks"
                >
                  <i className="fas fa-tasks me-1"></i>
                  Tasks
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/sales' ? 'active' : ''}`} 
                  to="/sales"
                >
                  <i className="fas fa-chart-line me-1"></i>
                  Sales
                </Link>
              </li>
            </ul>

            <div className="navbar-nav ms-auto">
              <div className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-user-circle me-1"></i>
                  {user.email}
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <span className="dropdown-item-text">
                      <small>Role: <strong>{user.role}</strong></small>
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/leads" element={<LeadList />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/sales" element={<SaleList />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;