import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import './AuthPages.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://theaelle-backend.onrender.com/api';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      setError('Invalid reset link. Please request a new password reset.');
    } else {
      setToken(resetToken);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: form.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password updated successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Invalid Reset Link</h2>
          <p className="auth-error">This password reset link is invalid or has expired.</p>
          <Link to="/login" style={{ textAlign: 'center', display: 'block', marginTop: '1rem' }}>
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Enter your new password below
        </p>
        
        <input
          name="newPassword"
          type="password"
          placeholder="New Password (min 6 characters)"
          value={form.newPassword}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm New Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating Password...' : 'Update Password'}
        </button>
        
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}
        
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/login">Back to Login</Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPasswordPage;