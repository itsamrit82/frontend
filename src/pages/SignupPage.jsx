import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://theaelle-backend.onrender.com/api';

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [step, setStep] = useState('email'); // 'email' or 'signup'
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check for verification token on page load
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmailToken(token);
    }
  }, [searchParams]);

  const verifyEmailToken = async (token) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      if (response.ok) {
        setVerifiedEmail(data.email);
        setStep('signup');
        setSuccess('Email verified successfully! Complete your signup below.');
      } else {
        setError(data.error || 'Invalid verification token');
      }
    } catch (err) {
      setError('Failed to verify email token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', verifiedEmail);
      formData.append('mobile', form.mobile);
      formData.append('password', form.password);
      if (profilePic) {
        formData.append('profilePic', profilePic);
      }

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        login(data);
        navigate('/user/dashboard');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Email verification step
  const handleEmailVerification = async (email) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/auth/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('📩 Verification link sent to your email! Please check your inbox and click the link to continue.');
      } else {
        setError(data.error || 'Failed to send verification email');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'email') {
    return (
      <div className="auth-container">
        <form className="auth-form" onSubmit={(e) => {
          e.preventDefault();
          const email = e.target.email.value;
          handleEmailVerification(email);
        }}>
          <h2>Verify Your Email</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>
            Enter your email address to receive a verification link
          </p>
          
          <input
            name="email"
            type="email"
            placeholder="Enter your email address"
            required
            disabled={isLoading}
          />
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Verification Link'}
          </button>
          
          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}
          
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </form>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Complete Your Signup</h2>
        {success && <p className="auth-success">{success}</p>}
        <div style={{ background: '#e8f5e8', color: '#2e7d32', padding: '0.5rem', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
          ✅ Email verified: {verifiedEmail}
        </div>
        
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        
        <input
          name="mobile"
          type="tel"
          placeholder="Phone Number"
          value={form.mobile}
          onChange={handleChange}
          disabled={isLoading}
        />
        
        <input
          name="password"
          type="password"
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        
        <div style={{ margin: '0.5rem 0' }}>
          <label htmlFor="profilePic" style={{ display: 'block', marginBottom: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
            Profile Picture (optional)
          </label>
          <input
            id="profilePic"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '6px', background: '#f9f9f9' }}
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
        
        {error && <p className="auth-error">{error}</p>}
        
        <p>Already have an account? <Link to="/login">Sign In</Link></p>
      </form>
    </div>
  );
};

export default SignupPage;