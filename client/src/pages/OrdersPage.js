import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';

const STATUS_COLORS = { Pending: '#f59e0b', Processing: '#3b82f6', Confirmed: '#8b5cf6', Shipped: '#06b6d4', Delivered: '#22c55e', Cancelled: '#ef4444', Refunded: '#6b7280' };

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders().then((r) => setOrders(r.data.orders || r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" /></div>;

  if (!orders.length) return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <div style={{ fontSize: 70 }}>📦</div>
      <h2 style={{ marginTop: 16, marginBottom: 8 }}>No orders yet</h2>
      <p style={{ color: '#999', marginBottom: 28 }}>Your order history will appear here</p>
      <Link to="/products" className="btn btn-primary">Start Shopping</Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 28 }}>My Orders</h1>
      {orders.map((order) => (
        <Link key={order._id} to={`/orders/${order._id}`} style={{ display: 'block', textDecoration: 'none', marginBottom: 12 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 16, transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, color: '#2d2d2d', marginBottom: 4 }}>Order #{order.orderNumber}</p>
              <p style={{ fontSize: 13, color: '#888' }}>{order.items?.length} item(s) · {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 16 }}>${order.totalPrice?.toFixed(2)}</p>
              <span style={{ background: `${STATUS_COLORS[order.status]}15`, color: STATUS_COLORS[order.status], padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{order.status}</span>
            </div>
            <span style={{ color: '#ccc', fontSize: 20 }}>›</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
