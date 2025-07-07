import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import './AdminLayout.css';

const AdminLayout = () => {
  const adminEmail = localStorage.getItem('adminEmail') || 'admin@theaelle.com';

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
            <NavLink to="/admin/dashboard">Dashboard</NavLink>
            <NavLink to="/admin/add-product">Add Product</NavLink>
            <NavLink to="/admin/manage-products">Manage Products</NavLink>
            <NavLink to="/admin/orders">Orders</NavLink>
            <NavLink to="/admin/payments">Payments</NavLink>
            <NavLink to="/admin/delivery">Delivery</NavLink>
            <NavLink to="/admin/returns">Returns</NavLink>
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
