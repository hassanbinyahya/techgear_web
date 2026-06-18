import React, { useState } from 'react';

const Products = () => {
    const [products] = useState([
        { id: 1, name: 'iPhone 15 Pro', sku: 'AP-15-P', purchase: 800, selling: 1100, stock: 25 },
        { id: 2, name: 'Logitech G502', sku: 'LG-502-M', purchase: 40, selling: 85, stock: 3 },
    ]);

    return (
        <div className="admin-page">
            <header className="flex-header">
                <h2>Product Inventory</h2>
                <button className="btn-primary">+ Add New Product</button>
            </header>

            <table className="erp-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Purchase ($)</th>
                        <th>Selling ($)</th>
                        <th>Profit ($)</th>
                        <th>Stock Status</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.sku}</td>
                            <td>{p.purchase}</td>
                            <td>{p.selling}</td>
                            <td className="profit-text">{p.selling - p.purchase}</td>
                            <td>
                                <span className={p.stock < 5 ? 'badge-low' : 'badge-ok'}>
                                    {p.stock} in stock
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Products;
