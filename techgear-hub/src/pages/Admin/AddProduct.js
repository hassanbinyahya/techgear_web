import React, { useState } from 'react';

const STORAGE_KEY = 'techgear_admin_inventory';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    image_url: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      id: `local-${Date.now()}`,
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock || 0),
      image_url: formData.image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    };

    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updatedProducts = [newProduct, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));

    setMessage('Product added successfully.');
    setFormData({ name: '', sku: '', category: '', price: '', stock: '', image_url: '' });
  };

  return (
    <div className="admin-page">
      <header className="flex-header">
        <div>
          <h2>Add New Product</h2>
          <p className="section-subtitle">Create a product card and push it into the inventory list instantly.</p>
        </div>
      </header>

      <form className="admin-form" onSubmit={handleSubmit}>
        {message && <div className="form-message">{message}</div>}
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="sku">SKU</label>
          <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="image_url">Image URL</label>
          <input type="url" id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} />
        </div>

        <button type="submit" className="btn-primary">Save Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
