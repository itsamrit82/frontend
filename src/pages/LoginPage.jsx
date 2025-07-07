import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://theaelle-backend.onrender.com/api';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Reset Password States
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        login(data);
        navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetMessage('Please enter a valid email address.');
      return;
    }

    setIsResetLoading(true);
    setResetMessage('');

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResetMessage('📩 Password reset link sent to your email! Please check your inbox.');
        setResetEmail('');
        
        setTimeout(() => {
          setShowResetPopup(false);
          setResetMessage('');
        }, 5000);
      } else {
        setResetMessage(data.error || 'Failed to send reset link');
      }
    } catch (err) {
      setResetMessage('Network error. Please try again.');
    } finally {
      setIsResetLoading(false);
    }
  };

  const closeResetPopup = () => {
    setShowResetPopup(false);
    setResetEmail('');
    setResetMessage('');
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        {success && <p className="auth-success">{success}</p>}
        
        <input 
          name="email" 
          type="email" 
          placeholder="Enter your email" 
          value={form.email} 
          onChange={handleChange} 
          required 
          disabled={isLoading}
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Enter your password" 
          value={form.password} 
          onChange={handleChange} 
          required 
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        
        {error && <p className="auth-error">{error}</p>}
        
        <p>
          Don't have an account? <Link to="/signup">Create Account</Link>
        </p>
        <p className="forgot-link" onClick={() => setShowResetPopup(true)}>
          Forgot Password?
        </p>
      </form>

      {/* Enhanced Reset Password Popup */}
      {showResetPopup && (
        <div className="modal-backdrop" onClick={closeResetPopup}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={closeResetPopup}>×</span>
            
            <div className="modal-header">
              <div className="modal-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <h3>Reset Your Password</h3>
              <p className="modal-subtitle">
                No worries! Enter your email address and we'll send you a secure link to reset your password.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  value={resetEmail} 
                  onChange={(e) => setResetEmail(e.target.value)}
                  disabled={isResetLoading}
                />
              </div>
            </div>

            <button 
              onClick={handleForgotPassword}
              disabled={isResetLoading}
              className="reset-button"
            >
              {isResetLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>

            {resetMessage && (
              <div className={`message ${resetMessage.includes('sent') || resetMessage.includes('generated') ? 'success' : 'error'}`}>
                {resetMessage}
              </div>
            )}

            <div className="back-to-login">
              <span onClick={closeResetPopup}>← Back to Login</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;