import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Tractor, User, Home, BookOpen } from 'lucide-react';

import HomePage from './pages/HomePage';
import EquipmentDetails from './pages/EquipmentDetails';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = "/";
  };

  return (
    <Router>
      <div className="app-container">
        {/* Simple Navigation Bar */}
        <nav style={{
          backgroundColor: 'white',
          padding: '16px 0',
          boxShadow: 'var(--shadow-sm)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div className="container flex justify-between items-center">
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tractor color="var(--color-primary)" size={32} />
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                AgroSphere
              </span>
            </Link>
            
            <div className="flex gap-2">
              {user ? (
                <>
                  <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '1rem' }}>
                    <User size={20} /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '1rem' }}>Logout</button>
                </>
              ) : (
                <Link to="/login" className="btn btn-primary" style={{ padding: '8px 24px', fontSize: '1rem' }}>
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main style={{ minHeight: 'calc(100vh - 80px)', paddingBottom: '40px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/equipment/:id" element={<EquipmentDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
