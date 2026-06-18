import React from 'react';
import { useCart } from '../context/CartContext';

const CategorySection = ({ category }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div>
      <h2 className="html-style-h2">{category.title}</h2>
      <div className="html-style-grid">
        {category.products.map(product => (
          <div key={product.id} className="html-style-card">
            {product.badge && <span className="html-style-badge">{product.badge}</span>}
            <img src={product.image_url} alt={product.name} />
            <div className="html-style-card-content">
              <h4>{product.name}</h4>
              <p className="html-style-price">${product.price}</p>
              <button className="html-style-btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;