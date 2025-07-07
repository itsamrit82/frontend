import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext"; // ✅ Add this
import "./ProductCard.css";

const ProductCard = ({ product, showNewBadge = false }) => {
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { user, token } = useAuth();

  const isWishlisted = wishlist.some((item) => item._id === product._id);
  const isInCart = cart.some((item) => item._id === product._id);

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

  addToCart(product);
  alert("✅ Added to Cart");
};


  const handleWishlist = (e) => {
    e.stopPropagation();
    
    console.log('Auth state:', { user: !!user, token: !!token });
    
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
        {isWishlisted ? "♥" : "♡"}
      </button>

      <div className="img-wrapper">
        <img src={product.imageUrl} alt={product.title} />
      </div>

      <div className="info">
        <h4>{product.title}</h4>
        <p>₹{Math.round(product.price)}</p>
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
    </div>
  );
};

export default ProductCard;
