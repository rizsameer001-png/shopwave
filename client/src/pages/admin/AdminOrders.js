// AdminOrders.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = { Pending: '#f59e0b', Processing: '#3b82f6', Confirmed: '#8b5cf6', Shipped: '#06b6d4', Delivered: '#22c55e', Cancelled: '#ef4444' };
const STATUSES = ['Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

function SidebarLinks() {
  return (
    <div style={{ width: 250, background: '#1A1A2E', color: 'white', padding: '32px 0', flexShrink: 0 }}>
      <div style={{ padding: '0 24px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}><div style={{ fontSize: 22, fontWeight: 800 }}>🛍️ ShopWave</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Admin Panel</div></div>
      <nav style={{ padding: '16px 0' }}>
        {[['📊 Dashboard', '/admin'], ['📦 Products', '/admin/products'], ['🧾 Orders', '/admin/orders'], ['👥 Users', '/admin/users'], ['🏠 View Store', '/']].map(([l, h]) => (
          <Link key={l} to={h} style={{ display: 'block', padding: '12px 24px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14 }}>{l}</Link>
        ))}
      </nav>
    </div>
  );
}

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getAllOrders({ page, limit: 15, status: filterStatus });
      setOrders(res.data.orders); setPages(res.data.pages);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, filterStatus]);

  const updateStatus = async (id, status) => {
    try { await orderAPI.updateOrderStatus(id, { status }); toast.success(`Status updated to ${status}`); load(); }
    catch { toast.error('Failed to update status'); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      <SidebarLinks />
      <div style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Orders</h1>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} style={{ padding: '10px 16px', border: '1px solid #e8e8e8', borderRadius: 10, fontFamily: 'Poppins,sans-serif', fontSize: 14, outline: 'none' }}>
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {loading ? <div style={{ padding: 60, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>{['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map((h) => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '12px 16px' }}><Link to={`/orders/${o._id}`} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>#{o.orderNumber}</Link></td>
                    <td style={{ padding: '12px 16px', fontSize: 14 }}>{o.user?.name}<div style={{ fontSize: 12, color: '#888' }}>{o.user?.email}</div></td>
                    <td style={{ padding: '12px 16px', fontSize: 14 }}>{o.items?.length}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>${o.totalPrice?.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{o.isPaid ? <span style={{ color: '#22c55e', fontWeight: 600 }}>✓ Paid</span> : <span style={{ color: '#f59e0b' }}>Pending</span>}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} style={{ padding: '5px 10px', border: `2px solid ${STATUS_COLORS[o.status]}`, borderRadius: 8, fontFamily: 'Poppins,sans-serif', fontSize: 12, fontWeight: 600, color: STATUS_COLORS[o.status], outline: 'none', cursor: 'pointer', background: `${STATUS_COLORS[o.status]}10` }}>
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#888' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px' }}><Link to={`/orders/${o._id}`} className="btn btn-secondary btn-sm">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {pages > 1 && <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 20 }}>{[...Array(pages)].map((_, i) => <button key={i} onClick={() => setPage(i + 1)} className={`page-btn ${page === i + 1 ? 'active' : ''}`}>{i + 1}</button>)}</div>}
        </div>
      </div>
    </div>
  );
}
export default AdminOrders;
