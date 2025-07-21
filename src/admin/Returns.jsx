import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Returns.css';

const API = process.env.REACT_APP_API_URL;

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) return;
    axios.get(`${API}/orders/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        const cancelled = data.filter(order => order.orderStatus === 'cancelled');
        setReturns(cancelled);
      })
      .catch(err => {
        setReturns([]);
        console.error('Failed to load returns:', err)
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="returns-page" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#a3476b' }}>Returns / Cancelled Orders</h2>
      {loading ? (
        <div className="loading-msg">Loading returned orders...</div>
      ) : returns.length === 0 ? (
        <div className="no-returns">No cancelled orders.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Reason</th>
              <th>Cancelled On</th>
            </tr>
          </thead>
          <tbody>
            {returns.map(order => (
              <tr key={order._id}>
                <td>{order.orderNumber || order._id.slice(-6)}</td>
                <td>{order.shippingAddress?.fullName || 'N/A'}</td>
                <td>₹{order.finalAmount}</td>
                <td>{order.notes || 'Not specified'}</td>
                <td>{new Date(order.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Returns;
