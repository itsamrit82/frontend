import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';

function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 32, right: 32, zIndex: 9999, background: '#333', color: '#fff', padding: '16px 28px', borderRadius: 12, fontSize: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
      {message}
      <button style={{ marginLeft: 16, background: 'none', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }} onClick={onClose}>×</button>
    </div>
  );
}

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
  const [toast, setToast] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast('');

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
      setToast('✅ Product added successfully');
      setForm({
        title: '', description: '', price: '', category: '',
        imageUrl: '', materials: '', availableColors: '', availableSizes: '', stock: 10
      });
    } catch (err) {
      console.error('Add product failed:', err);
      setToast('❌ Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#a3476b' }}>Add New Product</h2>
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
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="party">Partywear</option>
              <option value="casuals">Casuals</option>
              <option value="everyday">Everyday Looks</option>
              <option value="accessories">Accessories</option>
            </select>
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
        </form>
      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
};

export default AddProduct;
