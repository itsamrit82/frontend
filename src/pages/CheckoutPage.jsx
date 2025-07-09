import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Truck, CheckCircle, ShoppingBag, MapPin, Phone, Mail, User } from 'lucide-react';

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { token } = useAuth();

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: ''
  });
  const [method, setMethod] = useState('razorpay');
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = 99;
  const finalAmount = totalAmount + shippingCost;

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
        items: cartItems.map(i => ({
          productId: i._id,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          size: i.size,
          color: i.color
        })),
        paymentDetails: {
          method,
          transactionId: paymentData?.razorpay_payment_id || 'cod',
          paymentStatus: method === 'cod' ? 'pending' : 'completed'
        },
        totalAmount,
        finalAmount
      };

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/orders`, orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      clearCart();
      setOrderSuccess(true);
    } catch (err) {
      console.error('Order failed:', err);
      alert('Order failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!validateForm()) return alert('Please fill all fields.');

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/orders/razorpay`, {
        amount: finalAmount
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        name: 'The Aelle',
        description: 'Fashion Order',
        order_id: data.id,
        handler: async (response) => {
          await handlePlaceOrder(response);
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
      alert('Payment setup failed.');
      setProcessing(false);
    }
  };

  const handleSubmit = () => {
    setProcessing(true);

    if (!validateForm()) {
      alert('Please fill all fields.');
      setProcessing(false);
      return;
    }

    if (method === 'razorpay') {
      loadRazorpay().then(success => {
        if (success) handleRazorpayPayment();
        else {
          alert('Failed to load payment gateway.');
          setProcessing(false);
        }
      });
    } else {
      handlePlaceOrder();
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been successfully placed.</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order Total</p>
            <p className="text-2xl font-bold text-green-600">₹{finalAmount}</p>
          </div>
          <button 
            onClick={() => window.location.href = '/user/orders'}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            View Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Order Summary
              </h3>
              <div className="space-y-3 mb-4">
                {cartItems.map(item => (
                  <div key={item._id} className="flex justify-between items-center py-2 border-b">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.size} • {item.color} • Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span><span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span><span>₹{shippingCost}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span><span>₹{finalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Address */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="w-full pl-10 pr-4 py-3 border rounded-lg" required />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className="w-full pl-10 pr-4 py-3 border rounded-lg" required />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="w-full pl-10 pr-4 py-3 border rounded-lg" required />
                  </div>
                  <input name="address" value={form.address} onChange={handleChange} placeholder="Street Address" className="w-full px-4 py-3 border rounded-lg" required />
                  <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full px-4 py-3 border rounded-lg" required />
                  <select name="state" value={form.state} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required>
                    <option value="">Select State</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="ZIP Code" className="w-full px-4 py-3 border rounded-lg" required />
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </h3>
                <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="radio" value="razorpay" checked={method === 'razorpay'} onChange={() => setMethod('razorpay')} className="mr-3" />
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  <span className="font-medium">Pay with Razorpay</span>
                  <span className="ml-auto text-sm text-gray-500">Cards, UPI, Wallets</span>
                </label>
                <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="radio" value="cod" checked={method === 'cod'} onChange={() => setMethod('cod')} className="mr-3" />
                  <Truck className="w-5 h-5 mr-2 text-green-600" />
                  <span className="font-medium">Cash on Delivery</span>
                  <span className="ml-auto text-sm text-gray-500">Pay when delivered</span>
                </label>
              </div>

              {/* Submit */}
              <button type="button" onClick={handleSubmit} disabled={processing} className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                {processing ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  `Place Order - ₹${finalAmount}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
