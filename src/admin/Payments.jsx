import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Payments.css';

const API = process.env.REACT_APP_API_URL;

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) return;
    axios.get(`${API}/orders/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        const paid = data.filter(order => order.paymentDetails && order.paymentDetails.paymentStatus === 'completed');
        setPayments(paid);
      })
      .catch(err => {
        setPayments([]);
        console.error('Payment fetch error:', err)
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="payments-page" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#a3476b' }}>Successful Payments</h2>
      {loading ? (
        <div className="loading-msg">Loading payments...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Transaction ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(order => (
              <tr key={order._id}>
                <td>{order.orderNumber || order._id.slice(-6)}</td>
                <td>₹{order.finalAmount}</td>
                <td>{order.paymentDetails?.method}</td>
                <td>{order.paymentDetails?.transactionId || 'N/A'}</td>
                <td className="paid">Paid</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Payments;
