import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import GlobalModal from "./GlobalModal";
import "./ProductCard.css";

const ProductCard = ({ product, showNewBadge = false }) => {
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { user, token } = useAuth();

  const isWishlisted = wishlist.some((item) => item._id === product._id);
  const isInCart = cart.some((item) => item._id === product._id);

  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [error, setError] = useState("");

  const handleNavigate = () => {
    navigate(`/product/${product._id}`);
  };

  const handleCart = (e) => {
    e.stopPropagation();
    if (!user || !token) {
      alert("Please log in to add items to cart.");
      navigate("/login");
      return;
    }
    setShowModal(true);
    setSelectedSize("");
    setSelectedColor("");
    setError("");
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!selectedSize || !selectedColor) {
      setError("Please select size and color.");
      return;
    }
    addToCart({ ...product, selectedSize, selectedColor });
    setShowModal(false);
    setSelectedSize("");
    setSelectedColor("");
    setError("");
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!user || !token) {
      alert("Please log in to add items to wishlist.");
      navigate("/login");
      return;
    }
    toggleWishlist(product);
  };

  return (
    <div className="product-card" onClick={handleNavigate}>
      {showNewBadge && <div className="new-badge">NEW</div>}
      <button
        className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
        onClick={handleWishlist}
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        {isWishlisted ? "���" : "♡"}
      </button>

      <div className="img-wrapper">
        <img src={product.imageUrl} alt={product.title} />
      </div>

      <div className="info">
        <h4>{product.title}</h4>
        <p>₹{typeof product.price === 'number' ? product.price : Number(product.price)}</p>
        {isInCart ? (
          <div className="product-info">
            <div className="info-item">
              <span className="info-label">Category:</span>
              <span className="info-value">{product.category || 'Fashion'}</span>
            </div>
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div className="info-item">
                <span className="info-label">Sizes:</span>
                <span className="info-value">{product.availableSizes.join(', ')}</span>
              </div>
            )}
            {product.availableColors && product.availableColors.length > 0 && (
              <div className="info-item">
                <span className="info-label">Colors:</span>
                <span className="info-value">{product.availableColors.join(', ')}</span>
              </div>
            )}
            <div className="cart-status">✓ In Cart</div>
          </div>
        ) : (
          <button className="cart-btn" onClick={handleCart}>
            Add to Cart
          </button>
        )}
      </div>

      {/* Modal for size/color selection */}
      <GlobalModal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3 style={{marginBottom: 18, fontWeight: 700, color: '#a3476b'}}>Select Size & Color</h3>
        {product.availableSizes && product.availableSizes.length > 0 && (
          <div className="modal-group">
            <label>Size:</label>
            <div className="modal-options">
              {product.availableSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  className={`modal-option-btn${selectedSize === size ? ' selected' : ''}`}
                  onClick={e => { e.stopPropagation(); setSelectedSize(size); setError(""); }}
                  tabIndex={0}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
        {product.availableColors && product.availableColors.length > 0 && (
          <div className="modal-group">
            <label>Color:</label>
            <div className="modal-options">
              {product.availableColors.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`modal-option-btn${selectedColor === color ? ' selected' : ''}`}
                  style={{ background: color, color: '#fff', borderColor: selectedColor === color ? '#a3476b' : '#ccc' }}
                  onClick={e => { e.stopPropagation(); setSelectedColor(color); setError(""); }}
                  tabIndex={0}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}
        {error && <div className="modal-error">{error}</div>}
        <div className="modal-actions">
          <button className="modal-add-btn" onClick={handleAddToCart}>Add to Cart</button>
          <button className="modal-cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      </GlobalModal>
    </div>
  );
};

export default ProductCard;
