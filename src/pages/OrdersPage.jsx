import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './OrdersPage.css';

const OrdersPage = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [token, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      processing: '#8b5cf6',
      shipped: '#06b6d4',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Payment Pending',
      confirmed: 'Order Confirmed',
      processing: 'Being Prepared',
      shipped: 'On the Way',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return texts[status] || status;
  };

  const handleGenerateInvoice = async (orderId) => {
    setInvoiceLoading(orderId);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/invoice/${orderId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        alert('📧 Invoice sent to your email successfully!');
      } else {
        const error = await response.json();
        alert('Failed to send invoice: ' + error.error);
      }
    } catch (error) {
      console.error('Invoice generation error:', error);
      alert('Failed to generate invoice. Please try again.');
    } finally {
      setInvoiceLoading(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.orderStatus === filter;
  });

  const getFilterCount = (status) => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.orderStatus === status).length;
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div className="header-content">
          <button 
            onClick={() => navigate(-1)} 
            className="back-btn"
          >
            ← Back
          </button>
          <div className="header-info">
            <h1>My Orders</h1>
            <p>Track and manage your order history</p>
          </div>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>When you place your first order, it will appear here.</p>
          <button 
            onClick={() => navigate('/shop')}
            className="shop-btn"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="orders-filters">
            <div className="filter-tabs">
              {[
                { key: 'all', label: 'All Orders' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'processing', label: 'Processing' },
                { key: 'shipped', label: 'Shipped' },
                { key: 'delivered', label: 'Delivered' }
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
                  onClick={() => setFilter(tab.key)}
                >
                  {tab.label} ({getFilterCount(tab.key)})
                </button>
              ))}
            </div>
          </div>

          <div className="orders-list">
            {filteredOrders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-basic-info">
                    <div className="order-number">
                      <h3>#{order.orderNumber}</h3>
                      <span className="order-date">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="order-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                      >
                        {getStatusText(order.orderStatus)}
                      </span>
                    </div>
                  </div>
                  <div className="order-amount">
                    <span className="amount">₹{order.finalAmount}</span>
                    <span className="payment-method">
                      {order.paymentDetails.method === 'cod' ? 'COD' : 'Online'}
                    </span>
                  </div>
                </div>

                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="item-preview">
                      <img 
                        src={item.productId?.imageUrl || '/placeholder.jpg'} 
                        alt={item.title}
                        className="item-image"
                      />
                      <div className="item-info">
                        <h4>{item.title}</h4>
                        <div className="item-details">
                          <span>Qty: {item.quantity}</span>
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                        <span className="item-price">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="more-items">
                      +{order.items.length - 3} more items
                    </div>
                  )}
                </div>

                <div className="order-actions">
                  <button 
                    onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                    className="details-btn"
                  >
                    {selectedOrder === order._id ? '🔼 Hide Details' : '🔽 View Details'}
                  </button>
                  
                  <button 
                    onClick={() => handleGenerateInvoice(order._id)}
                    className="invoice-btn"
                    disabled={invoiceLoading === order._id}
                  >
                    {invoiceLoading === order._id ? 'Sending...' : '📧 Email Invoice'}
                  </button>
                  
                  {order.orderStatus === 'delivered' && (
                    <button className="reorder-btn">
                      🔄 Reorder
                    </button>
                  )}
                </div>

                {selectedOrder === order._id && (
                  <div className="order-details-expanded">
                    <div className="details-grid">
                      <div className="detail-section">
                        <h4>📍 Shipping Address</h4>
                        <div className="address-card">
                          <p><strong>{order.shippingAddress.fullName}</strong></p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                          <p>{order.shippingAddress.country}</p>
                          <p>📞 {order.shippingAddress.phone}</p>
                          <p>📧 {order.shippingAddress.email}</p>
                        </div>
                      </div>
                      
                      <div className="detail-section">
                        <h4>💳 Payment Information</h4>
                        <div className="payment-card">
                          <p><strong>Method:</strong> {order.paymentDetails.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                          <p><strong>Status:</strong> 
                            <span className={`payment-status ${order.paymentDetails.paymentStatus}`}>
                              {order.paymentDetails.paymentStatus === 'completed' ? '✅ Paid' : 
                               order.paymentDetails.paymentStatus === 'pending' ? '⏳ Pending' : 
                               order.paymentDetails.paymentStatus === 'failed' ? '❌ Failed' : order.paymentDetails.paymentStatus}
                            </span>
                          </p>
                          {order.paymentDetails.transactionId && (
                            <p><strong>Transaction ID:</strong> {order.paymentDetails.transactionId}</p>
                          )}
                        </div>
                      </div>
                      
                      {order.estimatedDelivery && (
                        <div className="detail-section">
                          <h4>🚚 Delivery Information</h4>
                          <div className="delivery-card">
                            <p><strong>Estimated Delivery:</strong> {formatDate(order.estimatedDelivery)}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="detail-section">
                        <h4>💰 Order Summary</h4>
                        <div className="summary-card">
                          <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>₹{order.totalAmount}</span>
                          </div>
                          {order.shippingCost > 0 && (
                            <div className="summary-row">
                              <span>Shipping:</span>
                              <span>₹{order.shippingCost}</span>
                            </div>
                          )}
                          {order.tax > 0 && (
                            <div className="summary-row">
                              <span>Tax (GST):</span>
                              <span>₹{order.tax}</span>
                            </div>
                          )}
                          <div className="summary-row total">
                            <span>Total:</span>
                            <span>₹{order.finalAmount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {order.notes && (
                      <div className="order-notes">
                        <h4>📝 Order Notes</h4>
                        <p>{order.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;