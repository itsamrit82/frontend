import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: ''
  });
  const [method, setMethod] = useState('razorpay');
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');
  const [invoiceUrl, setInvoiceUrl] = useState('');

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = totalAmount > 500 ? 0 : 99;
  const finalAmount = totalAmount + shippingCost;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    if (!cart || cart.length === 0) {
      navigate('/user/dashboard/cart');
    }
  }, [token, cart, navigate]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => Object.values(form).every(v => v.trim() !== '');

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (paymentData) => {
    try {
      const orderPayload = {
        shippingAddress: { ...form, country: 'India' },
        items: cart.map(i => ({
          productId: i._id,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          size: i.selectedSize,
          color: i.selectedColor
        })),
        paymentDetails: {
          method,
          transactionId: paymentData?.razorpay_payment_id || 'cod',
          paymentStatus: method === 'cod' ? 'pending' : 'completed'
        },
        totalAmount,
        finalAmount
      };

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/orders/place`, orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Generate invoice
      const invoiceRes = await axios.post(`${process.env.REACT_APP_API_URL}/orders/invoice/${res.data.order._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvoiceUrl(invoiceRes.data.invoiceUrl);

      clearCart();
      setOrderSuccess(true);
    } catch (err) {
      setError('Order failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!validateForm()) return setError('Please fill all fields.');
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/orders/create-razorpay-order`, {
        amount: finalAmount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        name: 'The Aelle',
        description: 'Fashion Order',
        order_id: data.id,
        handler: async (response) => {
          // Verify payment and save order
          try {
            await axios.post(`${process.env.REACT_APP_API_URL}/orders/verify-payment`, {
              orderId: data.orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            clearCart();
            setOrderSuccess(true);
          } catch (err) {
            setError('Payment verification failed.');
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone
        },
        theme: { color: '#a3476b' }
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      setError('Payment setup failed.');
      setProcessing(false);
    }
  };

  const handleSubmit = () => {
    setProcessing(true);
    setError('');
    if (!validateForm()) {
      setError('Please fill all fields.');
      setProcessing(false);
      return;
    }
    if (method === 'razorpay') {
      loadRazorpay().then(success => {
        if (success) handleRazorpayPayment();
        else {
          setError('Failed to load payment gateway.');
          setProcessing(false);
        }
      });
    } else {
      handlePlaceOrder();
    }
  };

  if (orderSuccess) {
    return (
      <div className="checkout-success">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2>Order Confirmed!</h2>
          <p>Thank you for your purchase. Your order has been placed.</p>
          <div className="order-total">Order Total: <span>₹{finalAmount}</span></div>
          {invoiceUrl && <a href={invoiceUrl} className="invoice-link" target="_blank" rel="noopener noreferrer">Download Invoice</a>}
          <button className="view-orders-btn" onClick={() => window.location.href = '/user/orders'}>View Orders</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        <div className="checkout-grid">
          {/* Address Form */}
          <div className="checkout-section address-section">
            <h3>Shipping Address</h3>
            <div className="address-form">
              <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
              <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
              <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
              <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
              <div className="address-row">
                <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
                <select name="state" value={form.state} onChange={handleChange} required>
                  <option value="">State</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input name="zipCode" placeholder="Zip Code" value={form.zipCode} onChange={handleChange} required />
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="checkout-section cart-section">
            <h3>Order Summary</h3>
            <div className="cart-items-list">
              {cart.map(item => (
                <div className="cart-item" key={item._id}>
                  <img src={item.imageUrl} alt={item.title} className="cart-item-img" />
                  <div className="cart-item-info">
                    <div className="cart-item-title">{item.title}</div>
                    <div className="cart-item-meta">Qty: {item.quantity} | ₹{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div className="summary-row"><span>Subtotal:</span><span>₹{totalAmount}</span></div>
              <div className="summary-row"><span>Shipping:</span><span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span></div>
              <div className="summary-row total"><span>Total:</span><span>₹{finalAmount}</span></div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="checkout-section payment-section">
            <h3>Payment</h3>
            <div className="payment-methods">
              <label>
                <input type="radio" name="method" value="razorpay" checked={method === 'razorpay'} onChange={() => setMethod('razorpay')} />
                Pay Online (Razorpay)
              </label>
              <label>
                <input type="radio" name="method" value="cod" checked={method === 'cod'} onChange={() => setMethod('cod')} />
                Cash on Delivery
              </label>
            </div>
            <button className="place-order-btn" onClick={handleSubmit} disabled={processing}>
              {processing ? 'Processing...' : 'Place Order'}
            </button>
            {error && <div className="checkout-error">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
