import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const API = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    inventory: 0,
    orders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          axios.get(`${API}/products`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API}/orders/admin/all`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const products = productsRes.data;
        const orders = ordersRes.data;

        const inventory = products.reduce((acc, p) => acc + (p.stock || 0), 0);
        const revenue = orders.reduce((acc, o) => acc + (o.finalAmount || 0), 0);

        // Try to extract user info from orders
        const uniqueUsers = Array.from(
          new Map(
            orders.map(o => [o?.shippingAddress?.email, o?.shippingAddress])
          ).values()
        );

        setStats({
          products: products.length,
          inventory,
          orders: orders.length,
          revenue
        });

        setUsers(uniqueUsers);
      } catch (err) {
        console.error('Dashboard API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="dashboard-page">
      <h2>Dashboard Overview</h2>
      {loading ? (
        <div className="loading-msg">Loading stats...</div>
      ) : (
        <>
          <div className="dashboard-cards">
            <div className="dashboard-card" onClick={() => setShowUsers(!showUsers)}>
              <div className="card-icon">👥</div>
              <div className="card-info">
                <div className="card-label">Users</div>
                <div className="card-value">{users.length}</div>
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-icon">🛍️</div>
              <div className="card-info">
                <div className="card-label">Products</div>
                <div className="card-value">{stats.products}</div>
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-icon">📦</div>
              <div className="card-info">
                <div className="card-label">Inventory</div>
                <div className="card-value">{stats.inventory}</div>
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-icon">🧾</div>
              <div className="card-info">
                <div className="card-label">Orders</div>
                <div className="card-value">{stats.orders}</div>
              </div>
            </div>
            <div className="dashboard-card">
              <div className="card-icon">💰</div>
              <div className="card-info">
                <div className="card-label">Revenue</div>
                <div className="card-value">₹{stats.revenue.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {showUsers && (
            <div className="user-list">
              <h4>User List (from orders)</h4>
              <ul>
                {users.map((user, index) => (
                  <li key={index}>
                    <strong>{user.fullName}</strong> — {user.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
