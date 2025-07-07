import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import './DashboardSection.css';

const DashboardHome = () => {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Orders',
      value: '0',
      icon: '📦',
      color: '#a3476b',
      onClick: () => navigate('/orders')
    },
    {
      title: 'Wishlist Items',
      value: wishlist.length,
      icon: '❤️',
      color: '#e91e63',
      onClick: () => navigate('/user/dashboard/wishlist')
    },
    {
      title: 'Cart Items',
      value: cart.length,
      icon: '🛒',
      color: '#ff9800',
      onClick: () => navigate('/user/dashboard/cart')
    },
    {
      title: 'Returns',
      value: '0',
      icon: '↩️',
      color: '#2196f3',
      onClick: () => navigate('/user/dashboard/returns')
    }
  ];

  const quickActions = [
    {
      title: 'Browse Products',
      description: 'Explore our latest collection',
      icon: '🛍️',
      onClick: () => navigate('/shop')
    },
    {
      title: 'View My Orders',
      description: 'Check your order status and history',
      icon: '📦',
      onClick: () => navigate('/orders')
    },
    {
      title: 'Account Settings',
      description: 'Manage your profile and preferences',
      icon: '⚙️',
      onClick: () => navigate('/user/dashboard/settings/account')
    },
    {
      title: 'Help & Support',
      description: 'Get help with your account',
      icon: '💬',
      onClick: () => navigate('/contact')
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-section">
      <div className="dashboard-header">
        <h2>Welcome back, {user?.name}! 👋</h2>
        <p>Member since {formatDate(user?.createdAt)} • Here's what's happening with your account today.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="stat-card"
            onClick={stat.onClick}
            style={{ borderLeftColor: stat.color }}
          >
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <div 
              key={index} 
              className="action-card"
              onClick={action.onClick}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h4>{action.title}</h4>
                <p>{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity-section">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">🎉</div>
            <div className="activity-content">
              <h4>Welcome to The Aellè!</h4>
              <p>Your account has been successfully created. Start exploring our collection.</p>
              <span className="activity-time">Just now</span>
            </div>
          </div>
          
          {wishlist.length > 0 && (
            <div className="activity-item">
              <div className="activity-icon">❤️</div>
              <div className="activity-content">
                <h4>Items in Wishlist</h4>
                <p>You have {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved in your wishlist.</p>
                <span className="activity-time">Recently</span>
              </div>
            </div>
          )}
          
          {cart.length > 0 && (
            <div className="activity-item">
              <div className="activity-icon">🛒</div>
              <div className="activity-content">
                <h4>Items in Cart</h4>
                <p>You have {cart.length} item{cart.length !== 1 ? 's' : ''} ready for checkout.</p>
                <span className="activity-time">Recently</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;