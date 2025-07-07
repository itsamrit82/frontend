import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';

const API = process.env.REACT_APP_API_URL;

const AddProduct = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    materials: '',
    availableColors: '',
    availableSizes: '',
    stock: 10
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const payload = {
        ...form,
        materials: form.materials.split(',').map(i => i.trim()),
        availableColors: form.availableColors.split(',').map(i => i.trim()),
        availableSizes: form.availableSizes.split(',').map(i => i.trim()),
        price: parseFloat(form.price),
        stock: parseInt(form.stock)
      };

      await axios.post(`${API}/products`, payload);
      setMsg('✅ Product added successfully');
      setForm({
        title: '', description: '', price: '', category: '',
        imageUrl: '', materials: '', availableColors: '', availableSizes: '', stock: 10
      });
    } catch (err) {
      console.error('Add product failed:', err);
      setMsg('❌ Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <h2>Add New Product</h2>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-group full-width">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} required />
        </div>

        <div className="form-group full-width">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (₹)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <input name="category" value={form.category} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Materials (comma separated)</label>
            <input name="materials" value={form.materials} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Sizes (comma separated)</label>
            <input name="availableSizes" value={form.availableSizes} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Colors (comma separated)</label>
            <input name="availableColors" value={form.availableColors} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Add Product'}
        </button>
        {msg && <p className="status-msg">{msg}</p>}
      </form>
    </div>
  );
};

export default AddProduct;
