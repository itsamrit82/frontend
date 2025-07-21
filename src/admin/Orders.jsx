import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css';

const API = process.env.REACT_APP_API_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!token) return;
    axios.get(`${API}/orders/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.orders || []);
        setOrders(data);
      })
      .catch(err => {
        setOrders([]);
        console.error('Failed to fetch orders:', err)
      })
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
    <div className="orders-page" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#a3476b' }}>All Orders</h2>
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
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <React.Fragment key={order._id}>
                <tr>
                  <td>{order.orderNumber || order._id.slice(-6)}</td>
                  <td>{order.shippingAddress?.fullName || 'N/A'}</td>
                  <td>
                    <span className={getStatusClass(order.orderStatus)}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>₹{order.finalAmount}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="details-btn" onClick={() => setExpanded(expanded === idx ? null : idx)}>
                      {expanded === idx ? 'Hide' : 'View'}
                    </button>
                    <select
                      className="status-select"
                      value={order.orderStatus}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          await axios.put(`${API}/orders/admin/${order._id}/status`, { status: newStatus }, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          setOrders((prev) => prev.map((o) => o._id === order._id ? { ...o, orderStatus: newStatus } : o));
                        } catch (err) {
                          alert('Failed to update status');
                        }
                      }}
                      style={{ marginLeft: 12, borderRadius: 6, padding: '4px 8px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="returned">Returned</option>
                    </select>
                  </td>
                </tr>
                {expanded === idx && (
                  <tr className="order-details-row">
                    <td colSpan={6}>
                      <div className="order-details-card">
                        <h4>Order Items</h4>
                        <table className="order-items-table">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Size</th>
                              <th>Color</th>
                              <th>Qty</th>
                              <th>Price</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(order.items || []).map((item, i) => (
                              <tr key={item.productId + i}>
                                <td>{item.title}</td>
                                <td>{item.size || '-'}</td>
                                <td>{item.color || '-'}</td>
                                <td>{item.quantity}</td>
                                <td>₹{item.price}</td>
                                <td>₹{item.price * item.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <h4>Shipping Address</h4>
                        <div className="order-address">
                          <div>{order.shippingAddress?.fullName}</div>
                          <div>{order.shippingAddress?.address}</div>
                          <div>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</div>
                          <div>{order.shippingAddress?.country}</div>
                          <div>Email: {order.shippingAddress?.email}</div>
                          <div>Phone: {order.shippingAddress?.phone}</div>
                        </div>
                        <h4>Payment</h4>
                        <div className="order-payment">
                          <div>Method: {order.paymentDetails?.method?.toUpperCase()}</div>
                          <div>Status: {order.paymentDetails?.paymentStatus}</div>
                          <div>Transaction ID: {order.paymentDetails?.transactionId || '-'}</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
