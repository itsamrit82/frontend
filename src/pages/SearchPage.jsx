import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/ShopPage.css';

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('term') || '';

  useEffect(() => {
    const searchProducts = async () => {
      if (!searchTerm) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://theaelle-backend.onrender.com/api/products/search?q=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="shop-container">
        <div className="search-loading">Searching...</div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <div className="search-header">
        <h2>Search Results for "{searchTerm}"</h2>
        <p>{products.length} products found</p>
      </div>
      
      {products.length === 0 ? (
        <div className="no-results">
          <h3>No products found</h3>
          <p>Try different keywords or browse our categories</p>
        </div>
      ) : (
        <main className="shop-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </main>
      )}
    </div>
  );
};

export default SearchPage;