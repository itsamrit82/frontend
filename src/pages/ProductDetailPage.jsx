import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import api from "../utils/api";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [zoomStyle, setZoomStyle] = useState({});
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        setSelectedImage(res.data.imageUrl);
        
        // Set default selections
        if (res.data.availableSizes?.length > 0) {
          setSelectedSize(res.data.availableSizes[0]);
        }
        if (res.data.availableColors?.length > 0) {
          setSelectedColor(res.data.availableColors[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const fetchFeedbacks = async () => {
      try {
        const res = await api.get(`/feedback/${id}`);
        setFeedbacks(res.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        setFeedbacks([]);
      }
    };

    fetchProduct();
    fetchFeedbacks();
  }, [id]);

  useEffect(() => {
    const fetchSimilar = async () => {
      if (product?.category) {
        try {
          const res = await api.get('/products');
          const filtered = res.data.filter(
            (p) => p.category === product.category && p._id !== product._id
          );
          setSimilar(filtered.slice(0, 4));
        } catch (error) {
          console.error('Error fetching similar products:', error);
          setSimilar([]);
        }
      }
    };
    if (product) fetchSimilar();
  }, [product]);

  const handleAddToCart = () => {
    if (!user || !token) {
      alert("Please log in to add items to cart.");
      navigate("/login");
      return;
    }
    
    const order = {
      ...product,
      quantity,
      selectedSize,
      selectedColor
    };
    addToCart(order);
    alert("✅ Added to cart");
  };
  
  const handleWishlist = () => {
    if (!user || !token) {
      alert("Please log in to add items to wishlist.");
      navigate("/login");
      return;
    }
    toggleWishlist(product);
  };
  
  const isWishlisted = wishlist.some(item => item._id === product?._id);
  
  const handleImageZoom = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)'
    });
  };
  
  const handleImageLeave = () => {
    setZoomStyle({ transform: 'scale(1)' });
  };
  
  const getAverageRating = () => {
    if (!Array.isArray(feedbacks) || feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, feedback) => acc + (feedback.rating || 0), 0);
    return sum / feedbacks.length;
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Login required to submit feedback");
      return;
    }
    try {
      await api.post(`/feedback/${id}`, { comment, rating });
      setComment("");
      setRating(5);
      setShowModal(false);
      setReviewMessage("Review submitted!");
      const res = await api.get(`/feedback/${id}`);
      setFeedbacks(res.data);
      setTimeout(() => setReviewMessage(""), 3000);
    } catch (err) {
      setReviewMessage("Failed to submit review. Try again.");
      setTimeout(() => setReviewMessage(""), 3000);
    }
  };

  if (!product) {
    return (
      <div className="product-detail-wrapper">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-wrapper">
      <div className="breadcrumb">
        <span onClick={() => navigate('/')}>Home</span> / 
        <span onClick={() => navigate('/shop')}>Shop</span> / 
        <span>{product.title}</span>
      </div>
      
      <div className="product-detail">
        {/* Gallery Section */}
        <div className="gallery-section">
          <div className="thumbnails">
            <img
              src={product.imageUrl}
              alt="Product thumbnail"
              className={selectedImage === product.imageUrl ? 'active' : ''}
              onClick={() => setSelectedImage(product.imageUrl)}
            />
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Product ${index + 1}`}
                className={selectedImage === img ? 'active' : ''}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
          <div className="main-image">
            <img 
              src={selectedImage} 
              alt={product.title}
              style={zoomStyle}
              onMouseMove={handleImageZoom}
              onMouseLeave={handleImageLeave}
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="info-section">
          <div className="product-header">
            <div className="title-row">
              <h1>{product.title}</h1>
              <button 
                className={`wishlist-heart ${isWishlisted ? 'active' : ''}`}
                onClick={e => { e.stopPropagation(); handleWishlist(); }}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                {isWishlisted ? '♥' : '♡'}
              </button>
            </div>
            <div className="price-row">
              <span className="current-price">₹{typeof product.price === 'number' ? product.price : Number(product.price)}</span>
              <span className="original-price">₹{typeof product.price === 'number' ? (product.price * 1.2).toFixed(0) : Number(product.price * 1.2).toFixed(0)}</span>
              <span className="discount">17% OFF</span>
            </div>
            <div className="rating-row">
              <div className="stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className={star <= Math.round(getAverageRating()) ? 'filled' : 'empty'}>★</span>
                ))}
              </div>
              <span className="rating-text">({getAverageRating().toFixed(1)}) {Array.isArray(feedbacks) ? feedbacks.length : 0} reviews</span>
            </div>
          </div>

          <div className="product-options">
            {product.availableSizes?.length > 0 && (
              <div className="option-group">
                <label>Size:</label>
                <div className="size-options">
                  {product.availableSizes.map((s) => (
                    <button
                      key={s}
                      className={`size-btn ${s === selectedSize ? "active" : ""}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {product.availableColors?.length > 0 && (
              <div className="option-group">
                <label>Color:</label>
                <div className="color-options">
                  {product.availableColors.map((color) => (
                    <button
                      key={color}
                      className={`color-btn ${color === selectedColor ? "active" : ""}`}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className="option-group">
              <label>Quantity:</label>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>
            
            <div className="action-buttons">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="buy-now-btn" onClick={() => {
                handleAddToCart();
                navigate('/checkout');
              }}>
                Buy Now
              </button>
            </div>
          </div>
          
          <div className="product-features">
            <div className="feature">🚚 Free shipping on orders over ₹500</div>
            <div className="feature">↩️ 30-day return policy</div>
            <div className="feature">🔒 Secure payment</div>
            <div className="feature">📞 24/7 customer support</div>
          </div>

          <div className="product-tabs">
            <div className="tab-headers">
              <button 
                className={`tab-header ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`tab-header ${activeTab === 'specifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button 
                className={`tab-header ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({Array.isArray(feedbacks) ? feedbacks.length : 0})
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="description-content">
                  <p>{product.description}</p>
                  {product.materials?.length > 0 && (
                    <div className="materials">
                      <h4>Materials:</h4>
                      <div className="material-tags">
                        {product.materials.map((material, index) => (
                          <span key={index} className="material-tag">{material}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div className="specifications">
                  <table>
                    <tr><td>Category</td><td>{product.category}</td></tr>
                    <tr><td>Available Sizes</td><td>{product.availableSizes?.join(', ') || 'One Size'}</td></tr>
                    <tr><td>Available Colors</td><td>{product.availableColors?.join(', ') || 'As shown'}</td></tr>
                    <tr><td>Care Instructions</td><td>Machine wash cold, hang dry</td></tr>
                  </table>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div className="reviews-content">
                  <button className="write-review-btn" onClick={() => setShowModal(true)}>
                    Write a Review
                  </button>
                  {reviewMessage && (
                    <div style={{ color: '#059669', marginBottom: '1rem', fontWeight: 600, fontFamily: 'Playfair Display, serif' }}>{reviewMessage}</div>
                  )}
                  {Array.isArray(feedbacks) && feedbacks.length > 0 ? (
                    <div className="reviews-list">
                      {feedbacks.map((feedback, index) => (
                        <div key={index} className="review-item">
                          <div className="review-header">
                            <div className="review-stars">{'★'.repeat(feedback.rating)}</div>
                            <span className="review-author">{feedback.user?.name || "Anonymous"}</span>
                          </div>
                          <p className="review-comment">{feedback.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Removed feedback-section with Leave Review button as requested */}
        </div>
      </div>

      {/* Feedback Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>Leave Your Review</h4>
            <form onSubmit={handleFeedbackSubmit}>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`star ${s <= rating ? "filled" : ""}`}
                    onClick={() => setRating(s)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                placeholder="Share your thoughts about this product..."
              />
              <div className="modal-buttons">
                <button type="submit">Submit Review</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Similar Products */}
      {similar.length > 0 && (
        <div className="similar-products">
          <h3>You Might Also Like</h3>
          <div className="similar-grid">
            {similar.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;