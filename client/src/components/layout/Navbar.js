import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/products?keyword=${encodeURIComponent(search)}`); setSearch(''); }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🛍️</span>
          <span className="brand-text">ShopWave</span>
        </Link>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, brands..." />
          <button type="submit">🔍</button>
        </form>

        {/* Nav Links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Shop</Link>
          {isAdmin && <Link to="/admin" className="admin-link">⚙️ Admin</Link>}
          {user ? (
            <div className="user-dropdown" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
              <button className="user-btn">
                <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6C63FF&color=fff`} alt={user.name} className="user-avatar" />
                <span>{user.name.split(' ')[0]}</span>
                <span style={{ fontSize: 10, marginLeft: 4 }}>▼</span>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}>👤 My Profile</Link>
                  <Link to="/orders" onClick={() => setDropdownOpen(false)}>📦 My Orders</Link>
                  <Link to="/wishlist" onClick={() => setDropdownOpen(false)}>❤️ Wishlist</Link>
                  <hr />
                  <button onClick={() => { logout(); setDropdownOpen(false); navigate('/'); }}>🚪 Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
          <Link to="/cart" className="cart-btn">
            🛒
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}
