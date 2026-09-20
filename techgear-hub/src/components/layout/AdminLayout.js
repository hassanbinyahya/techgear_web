import React, { useContext } from 'react';
import { NavLink, Outlet, Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const navItems = [
  { path: 'dashboard', label: 'Overview', icon: '📊' },
  { path: 'products', label: 'Catalog', icon: '📦' },
  { path: 'orders', label: 'Orders', icon: '🛒' },
  { path: 'inventory', label: 'Inventory', icon: '📉' },
  { path: 'manage-products', label: 'Manage', icon: '⚙️' },
  { path: 'finance', label: 'Finance', icon: '💰' },
  { path: 'hr', label: 'Team', icon: '👨‍💼' },
  { path: 'add-product', label: 'Add Product', icon: '➕' },
];

const AdminLayout = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) return null;

  const isAdmin = user && (user.role === 'admin' || user.email?.toLowerCase() === 'Admin321@gmail.com');

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-badge">TG</div>
          <div>
            <h2>TechGear</h2>
            <p>Admin Console</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={`/admin/${item.path}`}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="btn-back-home">Back to Store</Link>
          <button type="button" className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-search">
            <span>⌕</span>
            <input type="text" placeholder="Search products, orders, customers..." />
          </div>

          <div className="topbar-actions">
            <button type="button" className="topbar-chip success">Today</button>
            <button type="button" className="topbar-chip">Export</button>
            <div className="admin-user-badge">
              <div className="avatar">A</div>
              <div>
                <strong>{user?.name || 'Admin'}</strong>
                <small>{user?.email || 'Admin321@gmail.com'}</small>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
