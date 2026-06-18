import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import ProductCard from '../product/ProductCard';
import { categories } from '../data/categories';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getCollectionIcon = (title) => {
        const icons = {
            'Cases & Covers': '📱',
            'Screen Protection': '🛡️',
            'Chargers & Adapters': '🔌',
            'Charging Cables': '⚡',
            'Power Banks': '🔋',
            'Wireless Audio': '🎧',
            'Wired Audio': '🎚️',
            'Mobile Holders/Mounts': '📎',
            'Photography/Vlogging': '📷',
            'Gaming Accessories': '🎮',
            'Wearable Tech': '⌚',
            'Storage Solutions': '💾',
            'Personalization': '✨',
            'Cleaning & Maintenance': '🧽',
            'Bluetooth Speakers': '🔊',
            'Smart Home (App Controlled)': '🏠',
            'Replacement Parts': '🛠️',
            'Car Integration': '🚗',
            'Fashion/Lifestyle': '👝',
            'Cables & Adapters (Converters)': '🔄'
        };
        return icons[title] || '✨';
    };

    useEffect(() => {
        API.get('/products')
            .then(res => {
                const allProducts = res.data;
                // Get first 8 products as featured
                setFeaturedProducts(allProducts.slice(0, 8));
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-background-decoration"></div>
                <div className="hero-content">
                    <div className="hero-badge">✨ Explore Premium Quality Products</div>
                    <h1>Premium Tech Accessories for Every Device</h1>
                    <p>Discover cutting-edge mobile and tech accessories with lightning-fast delivery, trusted quality, and hassle-free checkout. Find everything from charging solutions to audio gear and device protection—all in one premium marketplace.</p>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">500+</span>
                            <span className="stat-label">Products</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">24hrs</span>
                            <span className="stat-label">Fast Delivery</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">100%</span>
                            <span className="stat-label">Authentic</span>
                        </div>
                    </div>
                    <div className="hero-actions">
                        <a className="btn btn-primary" href="/products">
                            <span className="btn-icon">🛍️</span>
                            <span>Shop All Products</span>
                        </a>
                        <a className="btn btn-secondary" href="/cart">
                            <span className="btn-icon">🛒</span>
                            <span>View Cart</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="section-divider" style={{ marginTop: '1.5rem' }}>
                <h2>Shop by Collection</h2>
                <p>Discover 20+ curated accessory collections grouped by category.</p>
            </div>

            <div className="collections-grid">
                {categories.map(category => (
                    <div key={category.title} className="collection-card">
                        <div className="collection-card-icon">{getCollectionIcon(category.title)}</div>
                        <h3>{category.title}</h3>
                        <p>{category.products.length} items</p>
                    </div>
                ))}
            </div>

            <div className="section-divider" style={{ marginTop: '1.5rem' }}>
                <h2>Trending Now</h2>
                <p>Check out our bestselling tech accessories</p>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading products...</p>
                </div>
            ) : featuredProducts.length > 0 ? (
                <div className="product-grid">
                    {featuredProducts.map(p => <ProductCard key={p.id || p._id} product={p} />)}
                </div>
            ) : (
                <div className="empty-state">
                    <p>No products available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default Home;