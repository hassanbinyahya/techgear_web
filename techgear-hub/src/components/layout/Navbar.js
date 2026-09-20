import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { searchQuery, setSearchQuery, searchResults, showSuggestions, clearSearch, selectProduct } = useSearch();
  const isAdminUser = user && (user.role === 'admin' || user.email?.toLowerCase() === 'Admin321@gmail.com');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      navigate('/products');
      clearSearch();
      return;
    }

    navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleSuggestionClick = (product) => {
    selectProduct(product);
    navigate(`/products?search=${encodeURIComponent(product.name)}`);
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
            onChange={handleSearchInput}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <span>🔍</span>
          </button>
        </form>

        {showSuggestions && searchResults.length > 0 && (
          <div className="search-suggestions" role="listbox" aria-label="Product suggestions">
            {searchResults.map((product) => (
              <button
                key={product._id || product.id}
                type="button"
                className="search-suggestion-item"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSuggestionClick(product);
                }}
              >
                <span className="suggestion-name">{product.name}</span>
                <span className="suggestion-category">{product.category}</span>
              </button>
            ))}
          </div>
        )}
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
        {isAdminUser && (
          <Link
            to="/admin/dashboard"
            className={`nav-link admin-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <span>⚙️</span> Admin
          </Link>
        )}
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
        {isAdminUser && (
          <Link
            to="/admin/dashboard"
            className={`nav-link admin-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <span>⚙️</span> Admin
          </Link>
        )}
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && <div className="mobile-overlay" onClick={closeMenu}></div>}
    </nav>
  );
}