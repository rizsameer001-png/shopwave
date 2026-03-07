import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import './HomePage.css';

const BANNERS = [
  { title: 'Summer Sale', subtitle: 'Up to 50% off on selected items', cta: 'Shop Now', gradient: 'linear-gradient(135deg,#667EEA,#764BA2)', emoji: '☀️', badge: '50% OFF' },
  { title: 'New Arrivals', subtitle: 'Discover the latest trends this season', cta: 'Explore', gradient: 'linear-gradient(135deg,#FF6B9D,#FF8E53)', emoji: '🌟', badge: 'NEW IN' },
  { title: 'Free Shipping', subtitle: 'On all orders over $50 nationwide', cta: 'Start Shopping', gradient: 'linear-gradient(135deg,#43E97B,#38F9D7)', emoji: '🚚', badge: 'FREE SHIP' },
];

const CATEGORIES = [
  { name: 'Electronics', icon: '📱', gradient: 'linear-gradient(135deg,#667EEA,#764BA2)' },
  { name: 'Fashion', icon: '👗', gradient: 'linear-gradient(135deg,#FF6B9D,#FF8E53)' },
  { name: 'Sports', icon: '⚽', gradient: 'linear-gradient(135deg,#43E97B,#38F9D7)' },
  { name: 'Beauty', icon: '💄', gradient: 'linear-gradient(135deg,#FA709A,#FEE140)' },
  { name: 'Home', icon: '🏠', gradient: 'linear-gradient(135deg,#4FACFE,#00F2FE)' },
  { name: 'Books', icon: '📚', gradient: 'linear-gradient(135deg,#F093FB,#F5576C)' },
  { name: 'Toys', icon: '🧸', gradient: 'linear-gradient(135deg,#FDA085,#F6D365)' },
  { name: 'Grocery', icon: '🍎', gradient: 'linear-gradient(135deg,#5EE7DF,#B490CA)' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    productAPI.getFeatured().then((r) => setFeatured(r.data)).catch(console.error);
    productAPI.getNewArrivals().then((r) => setNewArrivals(r.data)).catch(console.error);
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const banner = BANNERS[bannerIdx];

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="hero" style={{ background: banner.gradient }}>
        <div className="hero-content">
          <span className="hero-badge">{banner.badge}</span>
          <h1>{banner.title}</h1>
          <p>{banner.subtitle}</p>
          <div className="hero-search">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, brands..." onKeyDown={(e) => e.key === 'Enter' && navigate(`/products?keyword=${search}`)} />
            <button onClick={() => navigate(`/products?keyword=${search}`)}>Search</button>
          </div>
          <Link to="/products" className="hero-cta">{banner.cta} →</Link>
        </div>
        <div className="hero-emoji">{banner.emoji}</div>
        {/* Banner dots */}
        <div className="hero-dots">
          {BANNERS.map((_, i) => <button key={i} className={`dot ${i === bannerIdx ? 'active' : ''}`} onClick={() => setBannerIdx(i)} />)}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        {[['🚚', 'Free Shipping', 'Orders over $50'], ['↩️', 'Easy Returns', '30-day guarantee'], ['🔒', 'Secure Payment', '256-bit SSL'], ['🎯', '24/7 Support', 'Always here for you']].map(([icon, title, sub]) => (
          <div key={title} className="stat-item">
            <span className="stat-icon">{icon}</span>
            <div><strong>{title}</strong><p>{sub}</p></div>
          </div>
        ))}
      </div>

      <div className="home-container">
        {/* Categories */}
        <section className="section">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <Link to="/products">View All →</Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} to={`/products?category=${cat.name}`} className="category-card" style={{ background: cat.gradient }}>
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured */}
        {featured.length > 0 && (
          <section className="section">
            <div className="section-header">
              <h2>⭐ Featured Products</h2>
              <Link to="/products?featured=true">See All →</Link>
            </div>
            <div className="products-grid">
              {featured.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section className="section">
            <div className="section-header">
              <h2>🆕 New Arrivals</h2>
              <Link to="/products?isNew=true">See All →</Link>
            </div>
            <div className="products-grid">
              {newArrivals.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}

        {/* Promo Banner */}
        <section className="promo-banner">
          <div className="promo-content">
            <h2>🎉 Special Offer</h2>
            <p>Get <strong>20% off</strong> your first order with code <code>WELCOME20</code></p>
            <Link to="/register" className="btn btn-primary">Create Account</Link>
          </div>
          <div className="promo-emoji">🛍️💫</div>
        </section>
      </div>
    </div>
  );
}
