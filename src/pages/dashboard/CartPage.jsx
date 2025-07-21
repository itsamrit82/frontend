import React, { useState } from 'react';
import './CartPage.css';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, setCart } = useCart();
  const navigate = useNavigate();
  const [editIndex, setEditIndex] = useState(null);
  const [editSize, setEditSize] = useState('');
  const [editColor, setEditColor] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const getCartTotal = () =>
    cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

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

  const handleEdit = (idx, item) => {
    setEditIndex(idx);
    setEditSize(item.selectedSize || '');
    setEditColor(item.selectedColor || '');
  };

  const handleSaveEdit = (idx, item) => {
    const updatedCart = cart.map((ci, i) =>
      i === idx ? { ...ci, selectedSize: editSize, selectedColor: editColor } : ci
    );
    setCart(updatedCart);
    setEditIndex(null);
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
        <button className="clear-cart-btn" onClick={() => setShowClearConfirm(true)}>
          Clear Cart
        </button>
      </div>

      <div className="cart-items">
        {cart.map((item, idx) => (
          <div key={item._id + idx} className="cart-item">
            <div className="item-image">
              <img src={item.imageUrl} alt={item.title} />
            </div>
            <div className="item-details">
              <h3>{item.title}</h3>
              <p className="item-price">₹{item.price}</p>
              {editIndex === idx ? (
                <>
                  {item.availableSizes && item.availableSizes.length > 0 && (
                    <div className="edit-group">
                      <label>Size:</label>
                      <select value={editSize} onChange={e => setEditSize(e.target.value)}>
                        <option value="">Select Size</option>
                        {item.availableSizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {item.availableColors && item.availableColors.length > 0 && (
                    <div className="edit-group">
                      <label>Color:</label>
                      <select value={editColor} onChange={e => setEditColor(e.target.value)}>
                        <option value="">Select Color</option>
                        {item.availableColors.map(color => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="edit-actions">
                    <button className="save-edit-btn" onClick={() => handleSaveEdit(idx, item)}>Save</button>
                    <button className="cancel-edit-btn" onClick={() => setEditIndex(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  {item.selectedSize && <p className="item-size">Size: {item.selectedSize}</p>}
                  {item.selectedColor && <p className="item-color">Color: {item.selectedColor}</p>}
                  {(item.availableSizes && item.availableSizes.length > 0) || (item.availableColors && item.availableColors.length > 0) ? (
                    <button className="edit-btn" onClick={() => handleEdit(idx, item)}>Edit</button>
                  ) : null}
                </>
              )}
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

      <div className="cart-summary-card">
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
        </div>
        <button className="checkout-btn" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>

      {/* Clear Cart Confirmation Dialog */}
      {showClearConfirm && (
        <div className="modal-overlay" onClick={() => setShowClearConfirm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Clear Cart</h3>
            <p>Are you sure you want to remove all items from your cart?</p>
            <div className="modal-actions">
              <button className="modal-add-btn" onClick={() => { clearCart(); setShowClearConfirm(false); }}>Yes, Clear</button>
              <button className="modal-cancel-btn" onClick={() => setShowClearConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
