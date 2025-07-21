import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://theaelle-backend.onrender.com/api';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Try admin login first
      let response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      let data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.token && (data.user || data.admin)) {
        login(data);

        // Wait for context state to update before navigating
        setTimeout(() => {
          const role = data?.user?.role || data?.admin?.role || 'user';
          if (role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate('/user/dashboard', { replace: true });
          }
        }, 100);
        return;
      }

      // If not admin, try user login
      response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      data = await response.json();
      console.log('User login response:', data);

      if (response.ok && data.token && data.user) {
        login(data);
        setTimeout(() => {
          navigate('/user/dashboard', { replace: true });
        }, 100);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetMessage('Please enter a valid email address.');
      return;
    }

    setIsResetLoading(true);
    setResetMessage('');

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetMessage('✅ Reset link sent. Please check your inbox.');
        setTimeout(() => {
          setShowResetPopup(false);
          setResetMessage('');
        }, 5000);
      } else {
        setResetMessage(data.error || 'Failed to send reset link.');
      }
    } catch (err) {
      setResetMessage('Network error. Try again.');
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required disabled={isLoading} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required disabled={isLoading} />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        {error && <p className="auth-error">{error}</p>}
        <p>Don't have an account? <Link to="/signup">Create Account</Link></p>
        <p className="forgot-link" onClick={() => setShowResetPopup(true)}>Forgot Password?</p>
      </form>

      {showResetPopup && (
        <div className="modal-backdrop" onClick={() => setShowResetPopup(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={() => setShowResetPopup(false)}>×</span>
            <h3>Reset Your Password</h3>
            <p>Enter your email address to receive a password reset link.</p>
            <input
              type="email"
              placeholder="Email address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              disabled={isResetLoading}
            />
            <button onClick={handleResetPassword} disabled={isResetLoading}>
              {isResetLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            {resetMessage && (
              <div className={`reset-msg ${resetMessage.includes('✅') ? 'success' : 'error'}`}>
                {resetMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;