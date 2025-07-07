import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SuccessPage.css';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderNumber, paymentId, paymentMethod } = location.state || {};

  return (
    <div className="success-container">
      <div className="success-content">
        <div className="success-icon">
          ✓
        </div>
        
        <h1>Order Confirmed!</h1>
        
        <div className="order-details">
          {orderNumber && (
            <div className="detail-item">
              <span className="label">Order Number:</span>
              <span className="value">{orderNumber}</span>
            </div>
          )}
          
          {paymentId && (
            <div className="detail-item">
              <span className="label">Payment ID:</span>
              <span className="value">{paymentId}</span>
            </div>
          )}
          
          {paymentMethod && (
            <div className="detail-item">
              <span className="label">Payment Method:</span>
              <span className="value">{paymentMethod}</span>
            </div>
          )}
        </div>
        
        <div className="success-message">
          <p>Thank you for your order! We've received your payment and will start processing your order shortly.</p>
          <p>You'll receive an email confirmation with tracking details once your order ships.</p>
        </div>
        
        <div className="success-actions">
          <button 
            onClick={() => navigate('/dashboard/orders')}
            className="view-orders-btn"
          >
            View My Orders
          </button>
          
          <button 
            onClick={() => navigate('/shop')}
            className="continue-shopping-btn"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
