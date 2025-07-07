import React from 'react';
import './CartPage.css';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>Your Cart is Empty</h2>
          <p>Add some products to your cart to get started!</p>
          <button className="shop-now-btn" onClick={() => navigate('/shop')}>
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Your Cart ({cart.length} items)</h2>
        <button className="clear-cart-btn" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      <div className="cart-items">
        {cart.map((item) => (
          <div key={item._id} className="cart-item">
            <div className="item-image">
              <img src={item.imageUrl} alt={item.title} />
            </div>
            
            <div className="item-details">
              <h3>{item.title}</h3>
              <p className="item-price">₹{item.price}</p>
              {item.selectedSize && <p className="item-size">Size: {item.selectedSize}</p>}
              {item.selectedColor && <p className="item-color">Color: {item.selectedColor}</p>}
            </div>
            
            <div className="item-quantity">
              <button 
                className="qty-btn" 
                onClick={() => handleQuantityChange(item._id, (item.quantity || 1) - 1)}
              >
                -
              </button>
              <span className="qty-display">{item.quantity || 1}</span>
              <button 
                className="qty-btn" 
                onClick={() => handleQuantityChange(item._id, (item.quantity || 1) + 1)}
              >
                +
              </button>
            </div>
            
            <div className="item-total">
              ₹{item.price * (item.quantity || 1)}
            </div>
            
            <button 
              className="remove-btn" 
              onClick={() => removeFromCart(item._id)}
              title="Remove from cart"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>₹{getCartTotal()}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>{getCartTotal() > 500 ? 'Free' : '₹50'}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>₹{getCartTotal() + (getCartTotal() > 500 ? 0 : 50)}</span>
        </div>
        
        <button className="checkout-btn" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;