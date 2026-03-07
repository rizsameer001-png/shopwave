// CartPage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { items, itemCount, subtotal, shipping, tax, total, removeItem, updateQty } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <div style={{ fontSize: 80, marginBottom: 20 }}>🛒</div>
      <h2 style={{ fontSize: 28, marginBottom: 12 }}>Your cart is empty</h2>
      <p style={{ color: '#999', marginBottom: 32 }}>Add items to start shopping</p>
      <Link to="/products" className="btn btn-primary">Start Shopping</Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Shopping Cart ({itemCount} items)</h1>
        {items.map((item) => (
          <div key={item.key} style={{ display: 'flex', gap: 16, background: 'white', borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <img src={item.product.images?.[0]?.url || 'https://via.placeholder.com/100'} alt={item.product.name} style={{ width: 90, height: 90, borderRadius: 12, objectFit: 'cover' }} onError={(e) => e.target.src='https://via.placeholder.com/100'} />
            <div style={{ flex: 1 }}>
              <Link to={`/products/${item.product._id}`} style={{ fontWeight: 700, fontSize: 15, color: '#2d2d2d', textDecoration: 'none' }}>{item.product.name}</Link>
              <div style={{ fontSize: 12, color: '#999', margin: '4px 0' }}>
                {item.size && <span style={{ marginRight: 10 }}>Size: {item.size}</span>}
                {item.color && <span>Color: {item.color}</span>}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
              <button onClick={() => removeItem(item.key)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#ccc' }}>🗑️</button>
              <div style={{ display: 'flex', border: '2px solid #e8e8e8', borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => updateQty(item.key, item.quantity - 1)} style={{ background: 'none', border: 'none', padding: '6px 12px', cursor: 'pointer', fontSize: 16 }}>−</button>
                <span style={{ padding: '6px 14px', fontWeight: 700 }}>{item.quantity}</span>
                <button onClick={() => updateQty(item.key, item.quantity + 1)} style={{ background: 'none', border: 'none', padding: '6px 12px', cursor: 'pointer', fontSize: 16 }}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'sticky', top: 90 }}>
        <h3 style={{ marginBottom: 20, fontSize: 20 }}>Order Summary</h3>
        {[['Subtotal', `$${subtotal.toFixed(2)}`], ['Shipping', shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`], ['Tax (10%)', `$${tax.toFixed(2)}`]].map(([l, v]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14, color: '#666' }}>
            <span>{l}</span><span style={{ color: v === 'FREE' ? 'green' : undefined }}>{v}</span>
          </div>
        ))}
        <div style={{ borderTop: '2px solid #f0f0f0', margin: '16px 0', paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 800 }}>
          <span>Total</span><span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
        </div>
        {shipping > 0 && <p style={{ fontSize: 12, color: 'orange', marginBottom: 16 }}>Add ${(50 - subtotal).toFixed(2)} more for free shipping!</p>}
        <button className="btn btn-primary" style={{ width: '100%', fontSize: 16 }} onClick={() => user ? navigate('/checkout') : navigate('/login?redirect=/checkout')}>
          {user ? 'Proceed to Checkout →' : 'Sign In to Checkout'}
        </button>
        <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: 12, color: 'var(--primary)', fontSize: 14, textDecoration: 'none' }}>← Continue Shopping</Link>
      </div>
    </div>
  );
}
