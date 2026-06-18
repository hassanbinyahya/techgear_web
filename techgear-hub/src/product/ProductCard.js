import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import '../assets/styles/product.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [imageError, setImageError] = useState(false);

    const handleAddToCart = () => {
        addToCart(product);
    };

    // Construct image URL with proper encoding
    const getImageUrl = () => {
        if (!product.image_url) return '';
        
        // If it already has http, use as-is
        if (product.image_url.startsWith('http')) {
            return product.image_url;
        }
        
        // Extract filename from path like '/images/filename.png'
        const filename = product.image_url.split('/').pop();
        
        // Use the new direct image endpoint with URL encoding
        return `http://localhost:5000/images/${encodeURIComponent(filename)}`;
    };

    const imageUrl = getImageUrl();
    const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext x="50%" y="50%" fill="%23999" text-anchor="middle" dominant-baseline="middle" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';

    return (
        <div className="product-card">
            <div className="product-image-container">
                <img 
                    src={imageError ? fallbackImage : imageUrl} 
                    alt={product.name} 
                    className="product-image"
                    onError={() => setImageError(true)}
                />
                <span className="product-category-badge">{product.category}</span>
            </div>
            <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <div className="product-footer">
                    <span className="product-price">${product.price}</span>
                    <button onClick={handleAddToCart} className="btn btn-primary">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;