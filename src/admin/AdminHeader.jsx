import React from 'react';
import './AdminHeader.css';

const AdminHeader = () => {
  const adminName = localStorage.getItem('adminName') || 'Admin';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <img src="/aelle-logo.png" alt="The Aelle" className="logo" />
      </div>
      <div className="header-right">
        <span className="welcome-text">
          Welcome, <strong>{adminName.toUpperCase()}</strong>
        </span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default AdminHeader;
