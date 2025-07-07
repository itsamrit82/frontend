import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const { settingType } = useParams();
  const activeTab = settingType || 'account';
  const { user, token } = useAuth();
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    orderUpdates: true,
    promotions: false,
    security: true
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

  const renderContent = () => {
    switch (activeTab) {
      case 'password':
        return (
          <div className="settings-content">
            <div className="content-header">
              <h4>🔒 Change Password</h4>
              <p>Update your password to keep your account secure</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="settings-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  name="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  disabled={isPasswordLoading}
                />
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <input
                  name="newPassword"
                  type="password"
                  placeholder="Enter new password (min 6 characters)"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  disabled={isPasswordLoading}
                />
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  disabled={isPasswordLoading}
                />
              </div>
              
              <button type="submit" className="submit-btn" disabled={isPasswordLoading}>
                {isPasswordLoading ? 'Changing Password...' : 'Change Password'}
              </button>
              
              {passwordError && <div className="error-message">{passwordError}</div>}
              {passwordMessage && <div className="success-message">{passwordMessage}</div>}
            </form>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-content">
            <div className="content-header">
              <h4>🔔 Notification Preferences</h4>
              <p>Choose what notifications you want to receive</p>
            </div>
            
            <div className="notification-settings">
              <div className="notification-item">
                <div className="notification-info">
                  <h5>📧 Email Notifications</h5>
                  <p>Receive general email notifications</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange('email')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="notification-item">
                <div className="notification-info">
                  <h5>📦 Order Updates</h5>
                  <p>Get notified about order status changes</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.orderUpdates}
                    onChange={() => handleNotificationChange('orderUpdates')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="notification-item">
                <div className="notification-info">
                  <h5>🎉 Promotional Emails</h5>
                  <p>Receive offers and promotional content</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.promotions}
                    onChange={() => handleNotificationChange('promotions')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="notification-item">
                <div className="notification-info">
                  <h5>🔐 Security Alerts</h5>
                  <p>Important security and login notifications</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.security}
                    onChange={() => handleNotificationChange('security')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            
            <button className="submit-btn">Save Preferences</button>
          </div>
        );

      case 'account':
        return (
          <div className="settings-content">
            <div className="content-header">
              <h4>👤 Account Information</h4>
              <p>View and manage your account details</p>
            </div>
            
            <div className="account-details">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{user?.name}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user?.email}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{user?.mobile || 'Not provided'}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Member Since:</span>
                <span className="detail-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric'
                  }) : 'Recently'}
                </span>
              </div>
            </div>
            
            <button className="submit-btn" onClick={() => window.location.href = '/user/dashboard/profile-edit'}>
              Edit Profile
            </button>
          </div>
        );

      case 'privacy':
        return (
          <div className="settings-content">
            <div className="content-header">
              <h4>🛡️ Privacy Settings</h4>
              <p>Control your privacy and data sharing preferences</p>
            </div>
            
            <div className="privacy-settings">
              <div className="privacy-item">
                <h5>Profile Visibility</h5>
                <p>Control who can see your profile information</p>
                <select className="privacy-select">
                  <option>Public</option>
                  <option>Friends Only</option>
                  <option>Private</option>
                </select>
              </div>
              
              <div className="privacy-item">
                <h5>Data Collection</h5>
                <p>Allow us to collect data to improve your experience</p>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            
            <button className="submit-btn">Save Privacy Settings</button>
          </div>
        );

      case 'security':
        return (
          <div className="settings-content">
            <div className="content-header">
              <h4>🔐 Security Settings</h4>
              <p>Manage your account security and login options</p>
            </div>
            
            <div className="security-settings">
              <div className="security-item">
                <h5>Two-Factor Authentication</h5>
                <p>Add an extra layer of security to your account</p>
                <button className="secondary-btn">Enable 2FA</button>
              </div>
              
              <div className="security-item">
                <h5>Login Sessions</h5>
                <p>Manage your active login sessions</p>
                <button className="secondary-btn">View Sessions</button>
              </div>
              
              <div className="security-item">
                <h5>Account Recovery</h5>
                <p>Set up account recovery options</p>
                <button className="secondary-btn">Setup Recovery</button>
              </div>
            </div>
            
            <div className="danger-zone">
              <h5>⚠️ Danger Zone</h5>
              <p>These actions cannot be undone</p>
              <button className="danger-btn">Delete Account</button>
            </div>
          </div>
        );

      default:
        return <div>Select a setting from the dropdown</div>;
    }
  };

  return <div className="profile-settings">{renderContent()}</div>;
};

export default ProfileSettings;