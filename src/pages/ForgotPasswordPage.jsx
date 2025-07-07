// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './AuthPages.css';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const sendOtp = async () => {
    try {
      await axios.post('http://theaelle-backend.onrender.com/api/auth/send-otp', { email });
      setStep(2);
    } catch (err) {
      alert('Error sending OTP');
    }
  };

  const verifyAndReset = async () => {
    try {
      await axios.post('http://theaelle-backend.onrender.com/api/auth/verify-otp', {
        email,
        otp,
        newPassword,
      });
      alert('Password reset successfully');
      window.location.href = '/login';
    } catch (err) {
      alert('Invalid OTP or error resetting password');
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>

      {step === 1 && (
        <div className="auth-form">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={sendOtp}>Send OTP</button>
        </div>
      )}

      {step === 2 && (
        <div className="auth-form">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button onClick={verifyAndReset}>Reset Password</button>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
