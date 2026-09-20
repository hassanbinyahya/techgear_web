import React, { useMemo, useState, useEffect } from 'react';

const STORAGE_KEY = 'techgear_admin_inventory';

const generateSeedProducts = () => [
  { id: 'seed-1', name: 'Gaming Mouse Pro', sku: 'TG-MOUSE-001', category: 'Accessories', price: 79.99, stock: 42 },
  { id: 'seed-2', name: 'Noise Cancelling Headset', sku: 'TG-AUDIO-204', category: 'Audio', price: 189.99, stock: 18 },
  { id: 'seed-3', name: 'USB-C Fast Charger', sku: 'TG-CHARGER-118', category: 'Charging', price: 29.99, stock: 12 },
  { id: 'seed-4', name: 'Mechanical Keyboard', sku: 'TG-KEYBOARD-360', category: 'Accessories', price: 129.99, stock: 9 },
  { id: 'seed-5', name: '4K Webcam', sku: 'TG-CAM-401', category: 'Office', price: 219.99, stock: 5 },
  { id: 'seed-6', name: 'Portable SSD 1TB', sku: 'TG-SSD-500', category: 'Storage', price: 149.99, stock: 26 },
];

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProducts = localStorage.getItem(STORAGE_KEY);

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      const seedProducts = generateSeedProducts();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProducts));
      setProducts(seedProducts);
    }

    setLoading(false);
  }, []);

  const refreshSeedData = () => {
    const seedProducts = generateSeedProducts();
    setProducts(seedProducts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProducts));
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return { label: 'Out of Stock', cls: 'badge critical' };
    if (stock <= 20) return { label: 'Low Stock', cls: 'badge-low' };
    if (stock <= 80) return { label: 'Normal', cls: 'badge shipped' };
    return { label: 'In Stock', cls: 'badge-ok' };
  };

  const totals = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 20).length;
    const outOfStockCount = products.filter((p) => p.stock <= 0).length;

    return { totalStock, lowStockCount, outOfStockCount };
  }, [products]);

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

  return (
    <div className="admin-page">
      <header className="flex-header">
        <div>
          <h2>📦 Inventory Management</h2>
          <p className="section-subtitle">Track stock health and sync with available product listings.</p>
        </div>
        <button type="button" className="btn-primary" onClick={refreshSeedData}>
          Add sample inventory
        </button>
      </header>

      <div className="inventory-grid" style={{ marginBottom: '2rem' }}>
        <div className="inventory-card">
          <h4>Total Products</h4>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>{products.length}</p>
        </div>
        <div className="inventory-card">
          <h4>Total Stock Units</h4>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>{totals.totalStock}</p>
        </div>
        <div className="inventory-card">
          <h4>Low Stock Items</h4>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#facc15' }}>{totals.lowStockCount}</p>
        </div>
        <div className="inventory-card">
          <h4>Out of Stock</h4>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)' }}>{totals.outOfStockCount}</p>
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
          {products.map((p) => {
            const status = getStockStatus(p.stock);
            return (
              <tr key={p.id || p.sku}>
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${Number(p.price || 0).toFixed(2)}</td>
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
