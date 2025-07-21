import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import './AdminLayout.css';
// import './AdminGlobalFixes.css';

const AdminLayout = () => {
  const adminEmail = localStorage.getItem('adminEmail') || 'admin@theaelle.com';

  // Add admin-page class to root for global fixes
  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="admin-body">
        <aside className="admin-sidebar">
          <div className="profile-section">
            <img src="/avatar.png" alt="Admin Avatar" className="avatar" />
            <h3>Admin</h3>
            <p>{adminEmail}</p>
          </div>
          <nav className="sidebar-nav">
            <NavLink to="/admin/dashboard"><span role="img" aria-label="Dashboard">📊</span> Dashboard</NavLink>
            <NavLink to="/admin/add-product"><span role="img" aria-label="Add Product">➕</span> Add Product</NavLink>
            <NavLink to="/admin/manage-products"><span role="img" aria-label="Manage Products">🛠️</span> Manage Products</NavLink>
            <NavLink to="/admin/orders"><span role="img" aria-label="Orders">📦</span> Orders</NavLink>
            <NavLink to="/admin/payments"><span role="img" aria-label="Payments">💳</span> Payments</NavLink>
            <NavLink to="/admin/delivery"><span role="img" aria-label="Delivery">🚚</span> Delivery</NavLink>
            <NavLink to="/admin/returns"><span role="img" aria-label="Returns">↩️</span> Returns</NavLink>
          </nav>
        </aside>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
