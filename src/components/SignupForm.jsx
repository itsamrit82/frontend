import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = ({ verifiedEmail }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', verifiedEmail);
    formData.append('name', name);
    formData.append('mobile', mobile);
    formData.append('password', password);
    if (profilePic) formData.append('profilePic', profilePic);

    try {
      await axios.post('/api/auth/signup', formData);
      alert('Signup successful!');

      window.location.href = '/login';
    } catch (err) {
      alert('Signup failed.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form" encType="multipart/form-data">
      <input type="email" value={verifiedEmail} disabled />
      <span className="verified-label">✔ Verified</span>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <label>Profile Picture</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setProfilePic(e.target.files[0])}
      />
      <button type="submit">Complete Signup</button>
    </form>
  );
};

export default SignupForm;
