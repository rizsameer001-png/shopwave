// WishlistPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';

export function WishlistPage() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.getMe().then((r) => setWishlist(r.data.wishlist || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" /></div>;

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 28 }}>My Wishlist ({wishlist.length})</h1>
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 70 }}>💝</div>
          <h2 style={{ marginTop: 16, marginBottom: 8 }}>Your wishlist is empty</h2>
          <p style={{ color: '#999', marginBottom: 28 }}>Save items you love</p>
          <Link to="/products" className="btn btn-primary">Explore Products</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {wishlist.map((p) => <ProductCard key={p._id || p} product={typeof p === 'object' ? p : { _id: p, name: 'Loading...', price: 0, images: [] }} />)}
        </div>
      )}
    </div>
  );
}
export default WishlistPage;
