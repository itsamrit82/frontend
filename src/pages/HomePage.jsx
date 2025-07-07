import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import SubscribeBox from '../components/SubscribeBox';
import ProductCard from '../components/ProductCard'; // 👈 Shop Page card imported

const HomePage = () => {
  const navigate = useNavigate();
  const [latestProducts, setLatestProducts] = useState([]);

  const handleCollectionClick = (filter) => {
    navigate(`/shop?filter=${filter}`);
  };

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await api.get('/products');
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

        const latest = sorted.filter(
          (p) => new Date(p.createdAt) >= tenDaysAgo
        );

        setLatestProducts(latest.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch latest products:', err);
      }
    };
    fetchLatest();
  }, []);

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="overlay">
          <h1>OWN YOUR EDGE</h1>
          <p>Explore timeless western styles for the modern woman.</p>
          <button className="shop-btn" onClick={() => navigate('/shop')}>
            Shop Now
          </button>
        </div>
      </section>

      {/* FEATURED COLLECTIONS */}
      <section className="featured-section">
        <h2>Featured Collections</h2>
        <div className="collections-grid">
          <div
            className="collection-card"
            onClick={() => handleCollectionClick('party')}
          >
            <img
              src="https://i.pinimg.com/736x/b7/b0/49/b7b0493fde26fcd69409d4f90f9190f9.jpg"
              alt="Party Wear"
            />
            <h3>Party Wear</h3>
          </div>

          <div
            className="collection-card"
            onClick={() => handleCollectionClick('casuals')}
          >
            <img
              src="https://i.pinimg.com/736x/dd/c4/24/ddc424d5e051d70a74f7168c813474ae.jpg"
              alt="Office Casuals"
            />
            <h3>Office Casuals</h3>
          </div>

          <div
            className="collection-card"
            onClick={() => handleCollectionClick('everyday')}
          >
            <img
              src="https://i.pinimg.com/736x/93/55/da/9355da688123e0bbdf433c7b9ee5ff7c.jpg"
              alt="Everyday Looks"
            />
            <h3>Everyday Looks</h3>
          </div>
        </div>
      </section>

      {/* LATEST ARRIVALS */}
      <section className="latest-section">
        <h2>Latest Arrivals</h2>
        <div className="latest-grid">
          {latestProducts.map((product) => {
            const isNew = new Date() - new Date(product.createdAt) <= 10 * 24 * 60 * 60 * 1000;
            return (
              <ProductCard key={product._id} product={product} showNewBadge={isNew} />
            );
          })}
        </div>
      </section>

      {/* SUBSCRIBE BOX */}
      <section className="subscribe-section">
        <SubscribeBox />
      </section>
    </div>
  );
};

export default HomePage;
