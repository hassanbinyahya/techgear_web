import React, { useState } from 'react';
import API from '../../api/axios';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/products', {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        price: Number(formData.price),
        image_url: formData.image_url || 'https://via.placeholder.com/300x300?text=Product'
      });
      setMessage('Product added successfully.');
      setFormData({ name: '', sku: '', category: '', price: '', stock: '', image_url: '' });
    } catch (error) {
      setMessage('Unable to add product. Please try again.');
    }
  };

  return (
    <div className="admin-page">
      <header className="flex-header">
        <h2>Add New Product</h2>
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
          <label htmlFor="image_url">Image URL</label>
          <input type="url" id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} />
        </div>

        <button type="submit" className="btn-primary">Save Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
