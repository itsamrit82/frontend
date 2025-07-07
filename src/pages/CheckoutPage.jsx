import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CheckoutPage.css';

const API = process.env.REACT_APP_API_URL;
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY;

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const placeCODOrder = async () => {
    try {
      setLoading(true);
      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: address,
        paymentDetails: {
          method: 'cod',
          paymentStatus: 'pending'
        },
        totalAmount: getTotal(),
        finalAmount: getTotal(),
      };

      const res = await axios.post(`${API}/orders/place`, orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Trigger invoice email
      await axios.post(`${API}/orders/invoice/${res.data._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.removeItem('cart');
      alert('Order placed successfully!');
      window.location.href = '/success';

    } catch (err) {
      console.error('COD order error:', err);
      alert('Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    try {
      setLoading(true);

      // Create Razorpay order
      const { data } = await axios.post(`${API}/orders/create-razorpay-order`, {
        amount: getTotal(),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const options = {
        key: RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        name: "The Aellè",
        description: "Order Payment",
        order_id: data.id,
        handler: async (response) => {
          try {
            // Verify payment
            await axios.post(`${API}/orders/verify-payment`, {
              ...response,
              shippingAddress: address,
              items: cartItems,
              totalAmount: getTotal()
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });

            // Trigger invoice
            await axios.post(`${API}/orders/invoice/${response.razorpay_order_id}`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.removeItem('cart');
            alert("Payment successful! Invoice sent to your email.");
            window.location.href = '/success';
          } catch (err) {
            console.error("Verification failed:", err);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: address.fullName,
          email: address.email,
          contact: address.phone,
        },
        theme: {
          color: "#a3476b",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error("Razorpay error:", err);
      alert("Payment initiation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      placeCODOrder();
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-container">
        <form className="address-form" onSubmit={handleSubmit}>
          <h3>Shipping Details</h3>
          <div className="form-grid">
            <input type="text" name="fullName" value={address.fullName} onChange={handleChange} placeholder="Full Name" required />
            <input type="email" name="email" value={address.email} onChange={handleChange} placeholder="Email" required />
            <input type="tel" name="phone" value={address.phone} onChange={handleChange} placeholder="Phone" required />
            <input type="text" name="address" value={address.address} onChange={handleChange} placeholder="Address" required />
            <input type="text" name="city" value={address.city} onChange={handleChange} placeholder="City" required />
            <input type="text" name="state" value={address.state} onChange={handleChange} placeholder="State" required />
            <input type="text" name="zipCode" value={address.zipCode} onChange={handleChange} placeholder="ZIP Code" required />
            <input type="text" name="country" value={address.country} onChange={handleChange} placeholder="Country" required />
          </div>

          <h4>Payment Method</h4>
          <div className="payment-options">
            <label>
              <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
              Razorpay
            </label>
            <label>
              <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              Cash on Delivery
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>

        <div className="order-summary">
          <h3>Your Order</h3>
          {cartItems.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <ul>
              {cartItems.map(item => (
                <li key={item._id}>
                  <span>{item.title} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
          )}
          <hr />
          <div className="summary-totals">
            <div><span>Subtotal</span><span>₹{getTotal()}</span></div>
            <div><span>Shipping</span><span>Free</span></div>
            <div><span>Total</span><strong>₹{getTotal()}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
