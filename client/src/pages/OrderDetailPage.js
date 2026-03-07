// OrderDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';

const SC = { Pending: '#f59e0b', Processing: '#3b82f6', Confirmed: '#8b5cf6', Shipped: '#06b6d4', Delivered: '#22c55e', Cancelled: '#ef4444' };

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { orderAPI.getOrder(id).then((r) => setOrder(r.data)).catch(console.error).finally(() => setLoading(false)); }, [id]);
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" /></div>;
  if (!order) return <div style={{ textAlign: 'center', padding: 80 }}>Order not found</div>;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Order #{order.orderNumber}</h1>
        <span style={{ background: `${SC[order.status]}20`, color: SC[order.status], padding: '6px 16px', borderRadius: 20, fontWeight: 700 }}>{order.status}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {[['📦 Items', `${order.items?.length} item(s)`], ['💳 Payment', order.paymentMethod], ['📅 Ordered', new Date(order.createdAt).toLocaleDateString()], ['🚚 Tracking', order.trackingNumber || 'Not yet assigned']].map(([l, v]) => (
          <div key={l} style={{ background: 'white', borderRadius: 14, padding: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: 13, color: '#888' }}>{l}</p><p style={{ fontWeight: 600 }}>{v}</p>
          </div>
        ))}
      </div>
      <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: 16 }}>Items Ordered</h3>
        {order.items?.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid #f5f5f5' }}>
            <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover' }} />
            <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</p><p style={{ fontSize: 12, color: '#888' }}>{item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`}</p></div>
            <span style={{ color: '#888', fontSize: 13 }}>×{item.quantity}</span>
            <span style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ marginTop: 8 }}>
          {[['Subtotal', `$${order.itemsPrice?.toFixed(2)}`], ['Shipping', order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice?.toFixed(2)}`], ['Tax', `$${order.taxPrice?.toFixed(2)}`]].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#888', marginBottom: 6 }}><span>{l}</span><span>{v}</span></div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, borderTop: '2px solid #f0f0f0', paddingTop: 10, marginTop: 8 }}>
            <span>Total</span><span style={{ color: 'var(--primary)' }}>${order.totalPrice?.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h4 style={{ marginBottom: 8, fontSize: 14 }}>Shipping Address</h4>
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.8 }}>
          {order.shippingAddress?.fullName}<br />
          {order.shippingAddress?.street}<br />
          {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
        </p>
      </div>
      <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
        <Link to="/orders" className="btn btn-secondary">← All Orders</Link>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    </div>
  );
}
