import React, { useState } from 'react';

const Orders = () => {
  const [orders] = useState([
    { id: '#TG0012', customer: 'Laura Kim', total: 420, status: 'Processing' },
    { id: '#TG0013', customer: 'Nate Long', total: 130, status: 'Shipped' },
    { id: '#TG0014', customer: 'Sofia Perez', total: 725, status: 'Delivered' },
    { id: '#TG0015', customer: 'Ethan Fox', total: 259, status: 'Cancelled' },
  ]);

  return (
    <div className="admin-page">
      <header className="flex-header">
        <h2>Recent Orders</h2>
      </header>

      <table className="erp-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>${order.total}</td>
              <td>
                <span className={`badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
