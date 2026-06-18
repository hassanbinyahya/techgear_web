import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../product/ProductCard';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [groupedProducts, setGroupedProducts] = useState({});
    const location = useLocation();

    const searchQuery = new URLSearchParams(location.search).get('search') || '';

    useEffect(() => {
        API.get('/products')
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        const visibleProducts = normalizedQuery
            ? products.filter(product => product.name.toLowerCase().includes(normalizedQuery))
            : products;

        const grouped = visibleProducts.reduce((acc, product) => {
            const category = product.category || 'Uncategorized';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {});

        setGroupedProducts(grouped);
    }, [products, searchQuery]);
    const getCategoryIcon = (category) => {
        const icons = {
            'Audio': '🎧',
            'Cables': '🔌',
            'Charging': '⚡',
            'Protection': '🛡️',
            'Uncategorized': '📦'
        };
        return icons[category] || '✨';
    };

    return (
        <div className="container">
            <div className="section-divider">
                <h2>All Products</h2>
                <p>Browse our complete collection of mobile and tech accessories organized by category</p>
                {searchQuery ? (
                    <p className="search-summary">Search results for "{searchQuery}"</p>
                ) : null}
            </div>
            
            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading products...</p>
                </div>
            ) : Object.keys(groupedProducts).length > 0 ? (
                <div className="categories-container">
                    {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                        <div key={category} className="category-section">
                            <div className="category-header">
                                <span className="category-icon">{getCategoryIcon(category)}</span>
                                <div className="category-info">
                                    <h2 className="category-title">{category}</h2>
                                    <p className="category-count">{categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}</p>
                                </div>
                            </div>
                            <div className="category-divider"></div>
                            <div className="product-grid">
                                {categoryProducts.map(p => (
                                    <ProductCard key={p.id || p._id} product={p} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p>{searchQuery ? `No products found for "${searchQuery}".` : 'No products available at the moment.'}</p>
                </div>
            )}
        </div>
    );
};

export default Products;