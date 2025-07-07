import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './DashboardSection.css';

const SettingsPage = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('password');
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Account settings state
  const [notifications, setNotifications] = useState({
    email: true,
    orderUpdates: true,
    promotions: false
  });

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setPasswordError('');
    setPasswordMessage('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    setIsPasswordLoading(true);
    setPasswordError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setPasswordMessage('✅ Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div className="dashboard-section">
      <h2>Account Settings</h2>
      
      <div className="settings-tabs">
        <button 
          className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Change Password
        </button>
        <button 
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button 
          className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Account Info
        </button>
      </div>

      {activeTab === 'password' && (
        <div className="settings-content">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordSubmit}>
            <input
              name="currentPassword"
              type="password"
              placeholder="Current Password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
              disabled={isPasswordLoading}
            />
            
            <input
              name="newPassword"
              type="password"
              placeholder="New Password (min 6 characters)"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
              disabled={isPasswordLoading}
            />
            
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
              disabled={isPasswordLoading}
            />
            
            <button type="submit" disabled={isPasswordLoading}>
              {isPasswordLoading ? 'Changing Password...' : 'Change Password'}
            </button>
            
            {passwordError && <p className="error-message">{passwordError}</p>}
            {passwordMessage && <p className="success-message">{passwordMessage}</p>}
          </form>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="settings-content">
          <h3>Notification Preferences</h3>
          
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleNotificationChange('email')}
              />
              Email Notifications
            </label>
            <p>Receive general email notifications</p>
          </div>
          
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={notifications.orderUpdates}
                onChange={() => handleNotificationChange('orderUpdates')}
              />
              Order Updates
            </label>
            <p>Get notified about order status changes</p>
          </div>
          
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={notifications.promotions}
                onChange={() => handleNotificationChange('promotions')}
              />
              Promotional Emails
            </label>
            <p>Receive offers and promotional content</p>
          </div>
          
          <button className="save-btn">Save Preferences</button>
        </div>
      )}

      {activeTab === 'account' && (
        <div className="settings-content">
          <h3>Account Information</h3>
          
          <div className="account-info">
            <div className="info-item">
              <label>Name:</label>
              <span>{user?.name}</span>
            </div>
            
            <div className="info-item">
              <label>Email:</label>
              <span>{user?.email}</span>
            </div>
            
            <div className="info-item">
              <label>Phone:</label>
              <span>{user?.mobile || 'Not provided'}</span>
            </div>
            
            <div className="info-item">
              <label>Account Created:</label>
              <span>Member since registration</span>
            </div>
          </div>
          
          <div className="danger-zone">
            <h4>Danger Zone</h4>
            <p>These actions cannot be undone</p>
            <button className="danger-btn">Delete Account</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;