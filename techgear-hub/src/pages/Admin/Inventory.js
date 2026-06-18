import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/products');
                setProducts(res.data);
            } catch (err) {
                console.error('Error fetching inventory:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const getStockStatus = (stock) => {
        if (stock <= 0) return { label: 'Out of Stock', cls: 'badge critical' };
        if (stock <= 20) return { label: 'Low Stock', cls: 'badge-low' };
        if (stock <= 80) return { label: 'Normal', cls: 'badge shipped' };
        return { label: 'In Stock', cls: 'badge-ok' };
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading inventory data...</p>
                </div>
            </div>
        );
    }

    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 20).length;
    const outOfStockCount = products.filter(p => p.stock <= 0).length;

    return (
        <div className="admin-page">
            <header className="flex-header">
                <h2>📦 Inventory Management</h2>
            </header>

            <div className="inventory-grid" style={{ marginBottom: '2rem' }}>
                <div className="inventory-card">
                    <h4>Total Products</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>{products.length}</p>
                </div>
                <div className="inventory-card">
                    <h4>Total Stock Units</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>{totalStock}</p>
                </div>
                <div className="inventory-card">
                    <h4>Low Stock Items</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 800, color: '#facc15' }}>{lowStockCount}</p>
                </div>
                <div className="inventory-card">
                    <h4>Out of Stock</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)' }}>{outOfStockCount}</p>
                </div>
            </div>

            <table className="erp-table">
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price ($)</th>
                        <th>Stock</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => {
                        const status = getStockStatus(p.stock);
                        return (
                            <tr key={p._id || p.sku}>
                                <td>{p.sku}</td>
                                <td>{p.name}</td>
                                <td>{p.category}</td>
                                <td>${p.price?.toFixed(2)}</td>
                                <td>{p.stock}</td>
                                <td>
                                    <span className={status.cls}>{status.label}</span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Inventory;
