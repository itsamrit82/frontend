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
      {loading ? <p>Loading...</p> : (
        <div className="dashboard-cards">
          <div className="card">Users: {users.length}</div>
          <div className="card">Products: {stats.products}</div>
          <div className="card">Inventory: {stats.inventory}</div>
          <div className="card">Orders: {stats.orders}</div>
          <div className="card">Revenue: ₹{stats.revenue.toLocaleString()}</div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;