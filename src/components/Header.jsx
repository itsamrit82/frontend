// src/components/Header.jsx
import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef();

  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const closeSearchOnClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', closeSearchOnClickOutside);
    return () => document.removeEventListener('mousedown', closeSearchOnClickOutside);
  }, []);

  useEffect(() => {
    setShowSearch(false);
    setShowMobileMenu(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?term=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setShowSearch(false);
    }
  };

  const cartCount = getCartCount();
  const displayCartCount = cartCount > 99 ? '99+' : cartCount;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="aelle-header">
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setShowMobileMenu(true)}
        aria-label="Open menu"
      >
        <svg viewBox="0 0 24 24" stroke="currentColor">
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      {/* Logo */}
      <div className="header-left" onClick={() => navigate('/')}>
        <img src="/logo.png" alt="The Aellè" className="header-logo" />
      </div>

      {/* Desktop Nav */}
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/about">About</Link>
      </nav>

      {/* Icons */}
      <div className="header-icons">
        <div className="search-container desktop-only" ref={searchRef}>
          <button className="icon-btn" onClick={() => setShowSearch(!showSearch)}>
            🔍
          </button>
          {showSearch && (
            <form className="search-dropdown" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </form>
          )}
        </div>

        <Link to="/user/dashboard/cart" className="icon-btn cart-icon-wrapper desktop-only">
          🛒
          {cartCount > 0 && <span className="cart-badge">{displayCartCount}</span>}
        </Link>

        <button
          className="icon-btn"
          onClick={() => navigate(user ? '/user/dashboard' : '/login')}
        >
          👤
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu-overlay" onClick={() => setShowMobileMenu(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <img
                src="/logo.png"
                alt="The Aellè"
                className="mobile-logo"
                onClick={() => {
                  navigate('/');
                  setShowMobileMenu(false);
                }}
              />
              <button
                className="mobile-close-btn"
                onClick={() => setShowMobileMenu(false)}
              >
                ✖
              </button>
            </div>
            <div className="mobile-menu-links">
              <div onClick={() => { navigate('/'); setShowMobileMenu(false); }}>Home</div>
              <div onClick={() => { navigate('/shop'); setShowMobileMenu(false); }}>Shop</div>
              <div onClick={() => { navigate('/about'); setShowMobileMenu(false); }}>About</div>
              <div onClick={() => { navigate('/contact'); setShowMobileMenu(false); }}>Contact</div>
              <div onClick={() => { navigate('/user/dashboard/cart'); setShowMobileMenu(false); }}>Cart ({displayCartCount})</div>
              {user ? (
                <>
                  <div onClick={() => { navigate('/user/dashboard'); setShowMobileMenu(false); }}>Dashboard</div>
                  <div onClick={() => { navigate('/orders'); setShowMobileMenu(false); }}>My Orders</div>
                  <button className="mobile-logout-btn" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <div onClick={() => { navigate('/login'); setShowMobileMenu(false); }}>Login</div>
                  <div onClick={() => { navigate('/signup'); setShowMobileMenu(false); }}>Sign Up</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
