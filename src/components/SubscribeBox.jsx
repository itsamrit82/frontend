import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SubscribeBox.css';

const SubscribeBox = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!email) return alert('Please enter a valid email.');

    try {
      // 1️⃣ Check if the email already exists in MongoDB
      const checkRes = await axios.post('/api/auth/check-email', { email });

      if (checkRes.data.exists) {
        alert('⚠️ Email already registered. Please log in.');
        return navigate('/login');
      }

      // 2️⃣ Send verification email via backend
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://theaelle-backend.onrender.com/api'}/auth/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert('❌ Error sending link: ' + data.error);
      } else {
        setSent(true);
        alert('✅ Check your inbox for the verification link!');
      }
    } catch (err) {
      console.error('SubscribeBox error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="subscribe-box">
      <h3>
        Sign up and get <span className="highlight">40% OFF</span>
      </h3>
      <p className="subscribe-text">
        Join our fashion circle &amp; unlock your welcome discount.
      </p>

      <div className="subscribe-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleVerify}>Verify Email</button>
      </div>

      {sent && (
        <p className="subscribe-success">
          ✔ Link sent! Check your email to continue signup.
        </p>
      )}
    </div>
  );
};

export default SubscribeBox;