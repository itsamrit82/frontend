import React, { useState } from 'react';


const EmailSubscribeBox = ({ onVerified }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendLink = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    const error = !response.ok ? data : null;

    if (error) {
      alert('Failed to send magic link: ' + error.message);
    } else {
      setSent(true);
      alert('Link sent! Check your email and click the link to verify.');
    }
  };

  return (
    <div className="subscribe-box">
      <h3>Signup with Email</h3>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button onClick={handleSendLink}>Send Verification Link</button>
      {sent && <p className="subscribe-success">✔ Link sent. Check your email!</p>}
    </div>
  );
};

export default EmailSubscribeBox;
