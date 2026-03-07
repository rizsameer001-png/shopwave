import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Sidebar = () => (
  <div style={{ width: 250, background: '#1A1A2E', color: 'white', padding: '32px 0', flexShrink: 0 }}>
    <div style={{ padding: '0 24px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ fontSize: 22, fontWeight: 800 }}>🛍️ ShopWave</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Admin Panel</div>
    </div>
    <nav style={{ padding: '16px 0' }}>
      {[['📊 Dashboard', '/admin'], ['📦 Products', '/admin/products'], ['🧾 Orders', '/admin/orders'], ['👥 Users', '/admin/users'], ['🏠 View Store', '/']].map(([l, h]) => (
        <Link key={l} to={h} style={{ display: 'block', padding: '12px 24px', color: h === '/admin/users' ? 'white' : 'rgba(255,255,255,0.7)', background: h === '/admin/users' ? 'rgba(255,255,255,0.1)' : 'transparent', textDecoration: 'none', fontSize: 14, fontWeight: h === '/admin/users' ? 700 : 400 }}>{l}</Link>
      ))}
    </nav>
  </div>
);

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getUsers({ page, limit: 15, search });
      setUsers(res.data.users);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, search]);

  const handleToggleAdmin = async (id, isAdmin, name) => {
    if (!window.confirm(`${isAdmin ? 'Remove admin from' : 'Make admin'}: ${name}?`)) return;
    try {
      await userAPI.updateUser(id, { isAdmin: !isAdmin });
      toast.success('User updated');
      load();
    } catch { toast.error('Failed to update user'); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await userAPI.deleteUser(id);
      toast.success('User deleted');
      load();
    } catch { toast.error('Failed to delete user'); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800 }}>Users</h1>
            <p style={{ color: '#888', fontSize: 14, marginTop: 2 }}>{total} total users</p>
          </div>
        </div>

        {/* Search */}
        <div style={{ background: 'white', borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="🔍 Search by name or email..."
            style={{ padding: '10px 16px', border: '1px solid #e8e8e8', borderRadius: 10, width: '100%', fontFamily: 'Poppins,sans-serif', fontSize: 14, outline: 'none' }}
          />
        </div>

        <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  {['User', 'Email', 'Joined', 'Role', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No users found</td></tr>
                ) : users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img
                          src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&size=36&background=6C63FF&color=fff`}
                          alt={u.name}
                          style={{ width: 36, height: 36, borderRadius: '50%' }}
                        />
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#555' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#888' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: u.isAdmin ? 'rgba(108,99,255,0.12)' : 'rgba(0,0,0,0.05)', color: u.isAdmin ? 'var(--primary)' : '#888', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                        {u.isAdmin ? '⚡ Admin' : 'User'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: u.isActive !== false ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.1)', color: u.isActive !== false ? '#22c55e' : '#ef4444', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                        {u.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleToggleAdmin(u._id, u.isAdmin, u.name)}
                          style={{ background: u.isAdmin ? '#fff3cd' : 'rgba(108,99,255,0.1)', border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600, color: u.isAdmin ? '#856404' : 'var(--primary)', fontFamily: 'Poppins,sans-serif' }}
                        >
                          {u.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => handleDelete(u._id, u.name)}
                          style={{ background: 'rgba(239,68,68,0.1)', border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#ef4444', fontFamily: 'Poppins,sans-serif' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 20 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="page-btn">← Prev</button>
              {[...Array(pages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`page-btn ${page === i + 1 ? 'active' : ''}`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages} className="page-btn">Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
