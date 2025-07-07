import React from 'react';
import './DashboardSection.css';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/ProductCard';

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="dashboard-section">
      <h2>Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>No items in your wishlist.</p>
      ) : (
        <div className="products-grid">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
