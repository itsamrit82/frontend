import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Delivery.css';

const API = process.env.REACT_APP_API_URL;

const Delivery = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    axios.get(`${API}/orders/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOrders(res.data))
      .catch(err => console.error('Failed to fetch delivery info:', err))
      .finally(() => setLoading(false));
  }, [token]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'badge gray';
      case 'confirmed': return 'badge blue';
      case 'processing': return 'badge purple';
      case 'shipped': return 'badge orange';
      case 'delivered': return 'badge green';
      case 'cancelled': return 'badge red';
      default: return 'badge';
    }
  };

  return (
    <div className="delivery-page">
      <h2>Delivery Tracking</h2>
      {loading ? (
        <div className="loading-msg">Loading delivery data...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Estimated Delivery</th>
              <th>Placed On</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td className="order-id">{order.orderNumber || order._id.slice(-6)}</td>
                <td>{order.shippingAddress?.fullName || 'N/A'}</td>
                <td>
                  <span className={getStatusClass(order.orderStatus)}>
                    {order.orderStatus}
                  </span>
                </td>
                <td>
                  {order.estimatedDelivery
                    ? new Date(order.estimatedDelivery).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Delivery;
