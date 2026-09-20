import React from 'react';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import { useCart } from '../context/CartContext';

const Layout = ({ children }) => {
  const { toast, hideToast } = useCart();

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      {toast && (
        <div className="cart-toast" onClick={hideToast} role="status" aria-live="polite">
          <span className="cart-toast-icon">✓</span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};

export default Layout;