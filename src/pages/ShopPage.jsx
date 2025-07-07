import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "../styles/ShopPage.css";

const ShopPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedFilters, setSelectedFilters] = useState(["all"]);
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const params = new URLSearchParams(location.search);
  const filterFromURL = params.get("filter");

  useEffect(() => {
    if (filterFromURL) {
      setSelectedFilters([filterFromURL]);
    }
  }, [filterFromURL]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://theaelle-backend.onrender.com/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (!selectedFilters.includes("all")) {
      filtered = filtered.filter(p => selectedFilters.includes(p.category));
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedFilters, products, sortBy, priceRange, searchTerm]);

  const handleFilterChange = (category) => {
    if (category === "all") {
      setSelectedFilters(["all"]);
    } else {
      let updatedFilters = [...selectedFilters];
      if (updatedFilters.includes("all")) updatedFilters = [];

      if (updatedFilters.includes(category)) {
        updatedFilters = updatedFilters.filter(item => item !== category);
      } else {
        updatedFilters.push(category);
      }

      setSelectedFilters(updatedFilters.length ? updatedFilters : ["all"]);
    }
  };

  const clearFilters = () => {
    setSelectedFilters(["all"]);
    setPriceRange([0, 10000]);
    setSearchTerm("");
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="shop-container">
        <div className="loading-spinner">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <aside className="shop-filter">
        <div className="filter-header">
          <h3>Filters</h3>
          <button onClick={clearFilters} className="clear-filters">Clear All</button>
        </div>

        {/* Search */}
        <div className="filter-section">
          <h4>Search</h4>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Categories */}
        <div className="filter-section">
          <h4>Categories</h4>
          {["all", "party", "casuals", "everyday", "accessories"].map((cat) => (
            <div key={cat} className="filter-option">
              <input
                type="checkbox"
                id={`cat-${cat}`}
                checked={selectedFilters.includes(cat)}
                onChange={() => handleFilterChange(cat)}
              />
              <label htmlFor={`cat-${cat}`}>
                {cat === "all" ? "All Categories" : 
                 cat === "everyday" ? "Everyday Looks" : 
                 cat.charAt(0).toUpperCase() + cat.slice(1)}
              </label>
            </div>
          ))}
        </div>

        {/* Price Range */}
        <div className="filter-section">
          <h4>Price Range</h4>
          <div className="price-slider-container">
            <div className="price-values">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
            <div className="slider-wrapper">
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="price-slider min-slider"
              />
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="price-slider max-slider"
              />
            </div>
          </div>
        </div>
      </aside>

      <main className="shop-main">
        {/* Toolbar */}
        <div className="shop-toolbar">
          <div className="results-info">
            <span>{filteredProducts.length} products found</span>
          </div>
          
          <div className="toolbar-controls">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
            
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                ⊞
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <h3>No products found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className={`shop-grid ${viewMode}`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ShopPage;
