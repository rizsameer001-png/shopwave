import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await productAPI.getProducts({ page, limit: 15, keyword: search });
      setProducts(res.data.products);
      setPages(res.data.pages);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await productAPI.deleteProduct(id); toast.success('Product deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ width: 250, background: '#1A1A2E', color: 'white', padding: '32px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 24px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}><div style={{ fontSize: 22, fontWeight: 800 }}>🛍️ ShopWave</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Admin Panel</div></div>
        <nav style={{ padding: '16px 0' }}>
          {[['📊 Dashboard', '/admin'], ['📦 Products', '/admin/products'], ['🧾 Orders', '/admin/orders'], ['👥 Users', '/admin/users'], ['🏠 View Store', '/']].map(([l, h]) => (
            <Link key={l} to={h} style={{ display: 'block', padding: '12px 24px', color: h === '/admin/products' ? 'white' : 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14, fontWeight: h === '/admin/products' ? 700 : 500, background: h === '/admin/products' ? 'rgba(255,255,255,0.1)' : 'transparent' }}>{l}</Link>
          ))}
        </nav>
      </div>
      <div style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Products</h1>
          <Link to="/admin/products/new" className="btn btn-primary">+ Add Product</Link>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: 20, marginBottom: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Search products..." style={{ padding: '10px 16px', border: '1px solid #e8e8e8', borderRadius: 10, width: '100%', fontFamily: 'Poppins,sans-serif', fontSize: 14, outline: 'none' }} />
        </div>
        <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {loading ? <div style={{ padding: 60, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>{['Image', 'Name', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '12px 16px' }}><img src={p.images?.[0]?.url || 'https://via.placeholder.com/48'} alt={p.name} style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }} /></td>
                    <td style={{ padding: '12px 16px' }}><div style={{ fontWeight: 600, fontSize: 14, maxWidth: 200 }}>{p.name.slice(0, 40)}{p.name.length > 40 && '...'}</div><div style={{ fontSize: 12, color: '#888' }}>{p.brand}</div></td>
                    <td style={{ padding: '12px 16px' }}><span className="badge badge-primary">{p.category}</span></td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>${(p.discountPrice || p.price)?.toFixed(2)}{p.discountPrice && <div style={{ fontSize: 11, color: '#bbb', textDecoration: 'line-through' }}>${p.price?.toFixed(2)}</div>}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ color: p.stock > 0 ? '#22c55e' : '#ef4444', fontWeight: 600, fontSize: 14 }}>{p.stock}</span></td>
                    <td style={{ padding: '12px 16px' }}>{p.isFeatured ? '⭐' : '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/admin/products/${p._id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id, p.name)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 20 }}>
              {[...Array(pages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`page-btn ${page === i + 1 ? 'active' : ''}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
