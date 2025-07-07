import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './DashboardSection.css';

const OrdersPage = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(null);

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
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
        const result = await response.json();
        alert('Invoice sent to your email successfully!');
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

  if (loading) {
    return (
      <div className="dashboard-section">
        <div className="loading-spinner">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Your Orders</h2>
        <p>Track and manage your order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>When you place your first order, it will appear here.</p>
          <button 
            onClick={() => window.location.href = '/shop'}
            className="shop-now-btn"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-container">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderNumber}</h3>
                  <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
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

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img 
                      src={item.productId?.imageUrl || '/placeholder.jpg'} 
                      alt={item.title}
                      className="item-image"
                    />
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <div className="item-specs">
                        <span>Qty: {item.quantity}</span>
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <p className="item-price">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
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
                    <span>Tax:</span>
                    <span>₹{order.tax}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₹{order.finalAmount}</span>
                </div>
              </div>

              <div className="order-actions">
                <button 
                  onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                  className="view-details-btn"
                >
                  {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
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
                  <div className="details-section">
                    <h4>Shipping Address</h4>
                    <div className="address-info">
                      <p><strong>{order.shippingAddress.fullName}</strong></p>
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                      <p>{order.shippingAddress.country}</p>
                      <p>Phone: {order.shippingAddress.phone}</p>
                    </div>
                  </div>
                  
                  <div className="details-section">
                    <h4>Payment Information</h4>
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
                  
                  {order.estimatedDelivery && (
                    <div className="details-section">
                      <h4>Delivery Information</h4>
                      <p>Estimated Delivery: {formatDate(order.estimatedDelivery)}</p>
                    </div>
                  )}
                  
                  {order.notes && (
                    <div className="details-section">
                      <h4>Order Notes</h4>
                      <p>{order.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
