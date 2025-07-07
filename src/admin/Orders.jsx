import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css';

const API = process.env.REACT_APP_API_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    axios.get(`${API}/orders/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOrders(res.data))
      .catch(err => console.error('Failed to fetch orders:', err))
      .finally(() => setLoading(false));
  }, [token]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-badge pending';
      case 'confirmed': return 'status-badge confirmed';
      case 'processing': return 'status-badge processing';
      case 'shipped': return 'status-badge shipped';
      case 'delivered': return 'status-badge delivered';
      case 'cancelled': return 'status-badge cancelled';
      default: return 'status-badge';
    }
  };

  return (
    <div className="orders-page">
      <h2>All Orders</h2>
      {loading ? (
        <div className="loading-msg">Loading orders...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order.orderNumber || order._id.slice(-6)}</td>
                <td>{order.shippingAddress?.fullName || 'N/A'}</td>
                <td>
                  <span className={getStatusClass(order.orderStatus)}>
                    {order.orderStatus}
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

export default Orders;
