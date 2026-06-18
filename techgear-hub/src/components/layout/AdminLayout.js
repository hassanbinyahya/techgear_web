import React, { useContext } from 'react';
import { NavLink, Outlet, Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const navItems = [
  { path: 'dashboard', label: 'Overview' },
  { path: 'products', label: 'Products' },
  { path: 'orders', label: 'Orders' },
  { path: 'inventory', label: 'Inventory' },
  { path: 'manage-products', label: 'Manage Products' },
  { path: 'finance', label: 'Finance' },
  { path: 'hr', label: 'HR' },
  { path: 'add-product', label: 'Add Product' },
];

const AdminLayout = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user || user.email !== 'Admin123@gmail.com') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <h2>TechGear Admin</h2>
          <p>Control center</p>
        </div>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={`/admin/${item.path}`}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage inventory, orders, finance and team operations.</p>
          </div>
          <Link to="/" className="btn-back-home">
            ← Back to Store
          </Link>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
