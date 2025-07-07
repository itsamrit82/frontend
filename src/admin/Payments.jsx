import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Payments.css';

const API = process.env.REACT_APP_API_URL;

const Payments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    axios.get(`${API}/orders/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOrders(res.data))
      .catch(err => console.error('Payment fetch error:', err))
      .finally(() => setLoading(false));
  }, [token]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'badge gray';
      case 'completed': return 'badge green';
      case 'failed': return 'badge red';
      default: return 'badge';
    }
  };

  return (
    <div className="payments-page">
      <h2>Payments</h2>
      {loading ? (
        <div className="loading-msg">Loading payments...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order.orderNumber || order._id.slice(-6)}</td>
                <td>{order.paymentDetails?.method || 'N/A'}</td>
                <td>
                  <span className={getStatusClass(order.paymentDetails?.paymentStatus)}>
                    {order.paymentDetails?.paymentStatus || 'Unknown'}
                  </span>
                </td>
                <td>₹{order.finalAmount}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Payments;
