import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageProducts.css';

const API = process.env.REACT_APP_API_URL;

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setForm({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl,
      materials: product.materials.join(', '),
      availableColors: product.availableColors.join(', '),
      availableSizes: product.availableSizes.join(', ')
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProduct = async () => {
    try {
      await axios.put(`${API}/products/${editingProduct}`, {
        ...form,
        materials: form.materials.split(',').map(s => s.trim()),
        availableColors: form.availableColors.split(',').map(s => s.trim()),
        availableSizes: form.availableSizes.split(',').map(s => s.trim()),
        price: parseFloat(form.price),
        stock: parseInt(form.stock)
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  return (
    <div className="manage-products-page">
      <h2>Manage Products</h2>
      {loading ? (
        <div className="loading-msg">Loading products...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <button onClick={() => handleEdit(p)} className="edit-btn">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingProduct && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <h3>Edit Product</h3>
            <div className="modal-scroll-area">
              <div className="modal-grid">
                <div className="form-group">
                  <label>Title</label>
                  <input name="title" value={form.title} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input name="price" value={form.price} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input name="category" value={form.category} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input name="stock" value={form.stock} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
                </div>
                <div className="form-group preview">
                  <label>Preview</label>
                  <img src={form.imageUrl} alt="preview" />
                </div>
                <div className="form-group full">
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} />
                </div>
                <div className="form-group full">
                  <label>Materials (comma separated)</label>
                  <input name="materials" value={form.materials} onChange={handleChange} />
                </div>
                <div className="form-group full">
                  <label>Sizes (comma separated)</label>
                  <input name="availableSizes" value={form.availableSizes} onChange={handleChange} />
                </div>
                <div className="form-group full">
                  <label>Colors (comma separated)</label>
                  <input name="availableColors" value={form.availableColors} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={saveProduct} className="save-btn">Save</button>
              <button onClick={() => setEditingProduct(null)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
