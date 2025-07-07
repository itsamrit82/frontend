import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ProfileSettings.css';

const ProfileEdit = () => {
  const { user, token, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    address: user?.address || '',
    profilePic: user?.profilePic || ''
  });
  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      updateUser(data.user);
      setMessage('✅ Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="profile-edit">
      <div className="profile-edit-header">
        <div className="profile-avatar">
          <img 
            src={formData.profilePic || "/default-user.png"} 
            alt="Profile" 
            className="avatar-image"
          />
          <button 
            type="button"
            className="avatar-edit-btn"
            onClick={() => setShowProfilePicModal(true)}
          >
            📷
          </button>
        </div>
        <div className="profile-welcome">
          <h2>Edit Your Profile</h2>
          <p>Member since {formatDate(user?.createdAt)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="profile-edit-form">
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your phone number"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="cancel-btn">
            Cancel
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
      </form>

      {/* Profile Picture Modal */}
      {showProfilePicModal && (
        <div className="modal-overlay" onClick={() => setShowProfilePicModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Update Profile Picture</h3>
            <p>Enter Google Drive direct link for your profile picture:</p>
            <div className="form-group">
              <label>Profile Picture URL</label>
              <input
                type="url"
                value={formData.profilePic}
                onChange={(e) => setFormData({...formData, profilePic: e.target.value})}
                placeholder="https://drive.google.com/uc?export=view&id=YOUR_FILE_ID"
              />
              <small>Use the <a href="/drive-converter.html" target="_blank">Link Converter</a> to convert Google Drive sharing links.</small>
            </div>
            {formData.profilePic && (
              <div className="image-preview">
                <img src={formData.profilePic} alt="Preview" style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%'}} />
              </div>
            )}
            <div className="modal-actions">
              <button 
                type="button" 
                onClick={() => setShowProfilePicModal(false)}
                className="save-btn"
              >
                Save
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setFormData({...formData, profilePic: ''});
                  setShowProfilePicModal(false);
                }}
                className="cancel-btn"
              >
                Remove Picture
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="account-info">
        <h3>Account Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Account ID</span>
            <span className="info-value">{user?._id?.slice(-8) || 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Account Status</span>
            <span className="info-value status-active">Active</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email Verified</span>
            <span className="info-value status-verified">✓ Verified</span>
          </div>
          <div className="info-item">
            <span className="info-label">Last Login</span>
            <span className="info-value">Recently</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;