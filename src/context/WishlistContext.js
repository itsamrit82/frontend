import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user, token } = useAuth();

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (user && token) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user, token]);

  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://theaelle-backend.onrender.com/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setWishlist(data.wishlist || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const toggleWishlist = async (product) => {
    if (!token) {
      console.log('No token available for wishlist');
      return;
    }
    
    console.log('Toggling wishlist for product:', product._id);
    
    try {
      const response = await fetch('http://theaelle-backend.onrender.com/api/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id })
      });
      
      const data = await response.json();
      console.log('Wishlist toggle response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle wishlist');
      }
      
      if (data.inWishlist) {
        setWishlist(prev => [...prev, product]);
      } else {
        setWishlist(prev => prev.filter(item => item._id !== product._id));
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
