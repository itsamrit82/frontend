import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const API = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, inventory: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const { adminToken, isAdminLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminToken) return;
    if (adminToken === '') return; // Wait for context to sync
    if (!isAdminLoggedIn) return navigate('/login');

    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          axios.get(`${API}/admin/products`, { headers: { Authorization: `Bearer ${adminToken}` } }),
          axios.get(`${API}/admin/orders`, { headers: { Authorization: `Bearer ${adminToken}` } })
        ]);

        const products = productsRes.data;
        const orders = ordersRes.data;
        const inventory = products.reduce((acc, p) => acc + (p.stock || 0), 0);
        const revenue = orders.reduce((acc, o) => acc + (o.finalAmount || 0), 0);
        const uniqueUsers = Array.from(new Map(orders.map(o => [o?.shippingAddress?.email, o?.shippingAddress])).values());

        setStats({ products: products.length, inventory, orders: orders.length, revenue });
        setUsers(uniqueUsers);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [adminToken, isAdminLoggedIn, navigate]);

  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>
      {loading ? <p className="loading-msg">Loading...</p> : (
        <>
          <div className="dashboard-cards">
            <div className="dashboard-card" style={{ borderLeft: '6px solid #a3476b' }}>
              <div className="card-icon" role="img" aria-label="Users">👥</div>
              <div className="card-info">
                <div className="card-label">Users</div>
                <div className="card-value">{users.length}</div>
              </div>
            </div>
            <div className="dashboard-card" style={{ borderLeft: '6px solid #4caf50' }}>
              <div className="card-icon" role="img" aria-label="Products">🛍️</div>
              <div className="card-info">
                <div className="card-label">Products</div>
                <div className="card-value">{stats.products}</div>
              </div>
            </div>
            <div className="dashboard-card" style={{ borderLeft: '6px solid #2196f3' }}>
              <div className="card-icon" role="img" aria-label="Inventory">📦</div>
              <div className="card-info">
                <div className="card-label">Inventory</div>
                <div className="card-value">{stats.inventory}</div>
              </div>
            </div>
            <div className="dashboard-card" style={{ borderLeft: '6px solid #ff9800' }}>
              <div className="card-icon" role="img" aria-label="Orders">📑</div>
              <div className="card-info">
                <div className="card-label">Orders</div>
                <div className="card-value">{stats.orders}</div>
              </div>
            </div>
            <div className="dashboard-card" style={{ borderLeft: '6px solid #e74c3c' }}>
              <div className="card-icon" role="img" aria-label="Revenue">💰</div>
              <div className="card-info">
                <div className="card-label">Revenue</div>
                <div className="card-value">₹{stats.revenue.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div className="user-list">
            <h4>Recent Customers</h4>
            <ul>
              {users.slice(0, 8).map((u, idx) => (
                <li key={idx}>
                  <span role="img" aria-label="User">👤</span> {u?.name || u?.email || 'N/A'}
                  {u?.city && <span style={{ color: '#888', marginLeft: 8 }}>({u.city})</span>}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;