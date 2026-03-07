// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI, userAPI, productAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const S = { display: 'flex', flexDirection: 'column', background: 'white', borderRadius: 20, padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' };

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0, products: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/'); return; }
    Promise.all([orderAPI.getOrderStats(), userAPI.getUserStats(), productAPI.getProducts({ limit: 1 })])
      .then(([oRes, uRes, pRes]) => {
        setStats({ revenue: oRes.data.revenue, orders: oRes.data.total, users: uRes.data.total, products: pRes.data.total });
        setRecentOrders(oRes.data.recentOrders || []);
      }).catch(console.error).finally(() => setLoading(false));
  }, [user, navigate]);

  const STATUS_COLORS = { Pending: '#f59e0b', Processing: '#3b82f6', Confirmed: '#8b5cf6', Shipped: '#06b6d4', Delivered: '#22c55e', Cancelled: '#ef4444' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar */}
      <div style={{ width: 250, background: '#1A1A2E', color: 'white', padding: '32px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 24px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>🛍️ ShopWave</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Admin Panel</div>
        </div>
        <nav style={{ padding: '16px 0' }}>
          {[['📊 Dashboard', '/admin'], ['📦 Products', '/admin/products'], ['🧾 Orders', '/admin/orders'], ['👥 Users', '/admin/users'], ['🏠 View Store', '/']].map(([l, h]) => (
            <Link key={l} to={h} style={{ display: 'block', padding: '12px 24px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.color = 'white'; }}
              onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'rgba(255,255,255,0.7)'; }}>
              {l}
            </Link>
          ))}
        </nav>
      </div>
      {/* Content */}
      <div style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>Dashboard</h1>
            <p style={{ color: '#888', fontSize: 14 }}>Welcome back, {user?.name?.split(' ')[0]}!</p>
          </div>
          <Link to="/admin/products/new" className="btn btn-primary">+ Add Product</Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 32 }}>
          {[
            { label: 'Total Revenue', value: `$${stats.revenue?.toFixed(2)}`, icon: '💰', color: '#6C63FF', change: '+12%' },
            { label: 'Total Orders', value: stats.orders, icon: '🧾', color: '#43E97B', change: '+8%' },
            { label: 'Total Users', value: stats.users, icon: '👥', color: '#FF6B9D', change: '+15%' },
            { label: 'Total Products', value: stats.products, icon: '📦', color: '#4FACFE', change: '+3%' },
          ].map((s) => (
            <div key={s.label} style={S}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{s.icon}</div>
                <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#2d2d2d' }}>{loading ? '...' : s.value}</div>
              <div style={{ fontSize: 12, color: '#22c55e', marginTop: 4 }}>{s.change} this month</div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div style={S}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recent Orders</h2>
            <Link to="/admin/orders" style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                {['Order #', 'Customer', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#999' }}>No orders yet</td></tr>
              ) : recentOrders.map((o) => (
                <tr key={o._id} style={{ borderBottom: '1px solid #f8f8f8' }}>
                  <td style={{ padding: '12px' }}><Link to={`/orders/${o._id}`} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>#{o.orderNumber}</Link></td>
                  <td style={{ padding: '12px', fontSize: 14, color: '#555' }}>{o.user?.name}</td>
                  <td style={{ padding: '12px', fontSize: 14, fontWeight: 700 }}>${o.totalPrice?.toFixed(2)}</td>
                  <td style={{ padding: '12px' }}><span style={{ background: `${STATUS_COLORS[o.status]}20`, color: STATUS_COLORS[o.status], padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{o.status}</span></td>
                  <td style={{ padding: '12px', fontSize: 13, color: '#888' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
