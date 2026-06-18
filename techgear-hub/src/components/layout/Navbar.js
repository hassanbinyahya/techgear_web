import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    navigate(`/products${trimmedQuery ? `?search=${encodeURIComponent(trimmedQuery)}` : ''}`);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">⚡</span>
        <h2>TechGear Hub</h2>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <span>🔍</span>
          </button>
        </form>
      </div>

      {/* Desktop Navigation */}
      <div className="navbar-links desktop-nav">
        <Link
          to="/"
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          <span>🏠</span> Home
        </Link>
        <Link
          to="/products"
          className={`nav-link ${isActive('/products') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          <span>🛍️</span> Products
        </Link>
        <Link
          to="/cart"
          className={`nav-link ${isActive('/cart') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          <span>🛒</span> Cart
        </Link>
        <Link
          to="/login"
          className={`nav-link ${isActive('/login') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          <span>🔑</span> Login
        </Link>
        <Link
          to="/register"
          className={`nav-link ${isActive('/register') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          <span>✍️</span> Register
        </Link>
        <Link
          to="/admin/dashboard"
          className={`nav-link admin-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          <span>⚙️</span> Admin
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className={`hamburger ${isMenuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <Link
          to="/"
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          <span>🏠</span> Home
        </Link>
        <Link
          to="/products"
          className={`nav-link ${isActive('/products') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          <span>🛍️</span> Products
        </Link>
        <Link
          to="/cart"
          className={`nav-link ${isActive('/cart') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          <span>🛒</span> Cart
        </Link>
        <Link
          to="/login"
          className={`nav-link ${isActive('/login') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          <span>🔑</span> Login
        </Link>
        <Link
          to="/register"
          className={`nav-link ${isActive('/register') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          <span>✍️</span> Register
        </Link>
        <Link
          to="/admin/dashboard"
          className={`nav-link admin-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          <span>⚙️</span> Admin
        </Link>
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && <div className="mobile-overlay" onClick={closeMenu}></div>}
    </nav>
  );
}