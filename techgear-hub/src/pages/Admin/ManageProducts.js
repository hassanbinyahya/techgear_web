import React, { useState } from 'react';

const ManageProducts = () => {
  const [products] = useState([
    { sku: 'AP-15-P', name: 'iPhone 15 Pro', price: 1099, stock: 25 },
    { sku: 'LG-502-M', name: 'Logitech G502', price: 85, stock: 3 },
    { sku: 'BL-500', name: 'Bluetooth Speaker', price: 79, stock: 2 },
  ]);

  return (
    <div className="admin-page">
      <header className="flex-header">
        <h2>Manage Product Catalog</h2>
      </header>

      <table className="erp-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Product</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.sku}>
              <td>{product.sku}</td>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <button className="btn-secondary">Edit</button>
                <button className="btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProducts;
