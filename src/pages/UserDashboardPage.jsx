import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UserDashboardPage.css';
import CartPage from './dashboard/CartPage';
import OrdersPage from './dashboard/OrdersPage';
import WishlistPage from './dashboard/WishlistPage';
import ReturnsPage from './dashboard/ReturnsPage';
import ProfileSettings from './dashboard/ProfileSettings';
import ProfileEdit from './dashboard/ProfileEdit';
import DashboardHome from './dashboard/DashboardHome';

const UserDashboardPage = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const settingsOptions = [
    { id: 'password', label: 'Change Password', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'account', label: 'Account Info', icon: '👤' },
    { id: 'privacy', label: 'Privacy', icon: '🛡️' },
    { id: 'security', label: 'Security', icon: '🔐' }
  ];

  const handleSettingClick = (settingId) => {
    navigate(`/user/dashboard/settings/${settingId}`);
    setShowProfileMenu(false);
  };

  return (
    <div className="user-dashboard">
      <div className="sidebar">
        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-header">
            <img 
              src={user?.profilePic ? `/uploads/${user.profilePic}` : "/default-user.png"} 
              alt="Profile" 
              className="profile-pic" 
            />
            <div className="profile-info">
              <h3>{user?.name || "User"}</h3>
              <p>{user?.email}</p>
            </div>
          </div>
          
          {/* Profile Dropdown */}
          <div className="profile-dropdown-container">
            <button 
              className="profile-dropdown-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              Settings & Privacy ⚙️
            </button>
            
            {showProfileMenu && (
              <div className="profile-dropdown">
                {settingsOptions.map(option => (
                  <button
                    key={option.id}
                    className="dropdown-item"
                    onClick={() => handleSettingClick(option.id)}
                  >
                    <span className="dropdown-icon">{option.icon}</span>
                    {option.label}
                  </button>
                ))}
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <span className="dropdown-icon">🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="nav-section">
          <button onClick={() => navigate('/user/dashboard')}>🏠 Dashboard</button>
          <button onClick={() => navigate('/user/dashboard/orders')}>📦 Orders</button>
          <button onClick={() => navigate('/user/dashboard/wishlist')}>❤️ Wishlist</button>
          <button onClick={() => navigate('/user/dashboard/returns')}>↩️ Returns</button>
          <button onClick={() => navigate('/user/dashboard/cart')}>🛒 Cart</button>
        </div>
      </div>

      <div className="dashboard-content">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="returns" element={<ReturnsPage />} />
          <Route path="settings/:settingType" element={<ProfileSettings />} />
          <Route path="profile-edit" element={<ProfileEdit />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboardPage;