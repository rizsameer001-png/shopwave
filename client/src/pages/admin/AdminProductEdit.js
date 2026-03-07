// AdminProductEdit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI } from '../../services/api';
import toast from 'react-hot-toast';

export function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', shortDescription: '', price: '', discountPrice: '', category: 'Electronics', brand: '', stock: '', isFeatured: false, isNew: false, images: [{ url: '', alt: '' }] });

  useEffect(() => {
    if (!isNew) {
      productAPI.getProduct(id).then((r) => {
        const p = r.data;
        setForm({ name: p.name, description: p.description, shortDescription: p.shortDescription || '', price: p.price, discountPrice: p.discountPrice || '', category: p.category, brand: p.brand, stock: p.stock, isFeatured: p.isFeatured, isNew: p.isNew, images: p.images?.length ? p.images : [{ url: '', alt: '' }] });
        setLoading(false);
      }).catch(() => navigate('/admin/products'));
    }
  }, [id, isNew, navigate]);

  const upd = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [k]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), discountPrice: form.discountPrice ? Number(form.discountPrice) : null, stock: Number(form.stock), images: form.images.filter((img) => img.url) };
      if (isNew) await productAPI.createProduct(payload);
      else await productAPI.updateProduct(id, payload);
      toast.success(isNew ? 'Product created! ✅' : 'Product updated! ✅');
      navigate('/admin/products');
    } catch (err) { toast.error(err.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const inp = { width: '100%', padding: '11px 14px', border: '1px solid #e8e8e8', borderRadius: 10, fontFamily: 'Poppins,sans-serif', fontSize: 14, outline: 'none' };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}><div className="spinner" /></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ width: 250, background: '#1A1A2E', color: 'white', padding: '32px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 24px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}><div style={{ fontSize: 22, fontWeight: 800 }}>🛍️ ShopWave</div></div>
        <nav style={{ padding: '16px 0' }}>
          {[['📊 Dashboard', '/admin'], ['📦 Products', '/admin/products'], ['🧾 Orders', '/admin/orders'], ['👥 Users', '/admin/users'], ['🏠 View Store', '/']].map(([l, h]) => (
            <Link key={l} to={h} style={{ display: 'block', padding: '12px 24px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14 }}>{l}</Link>
          ))}
        </nav>
      </div>
      <div style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <Link to="/admin/products" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: 14 }}>← Products</Link>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>{isNew ? 'Add Product' : 'Edit Product'}</h1>
        </div>
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Basic Info */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: 16 }}>Basic Info</h3>
              {[['Product Name', 'name', 'text'], ['Brand', 'brand', 'text'], ['Short Description', 'shortDescription', 'text']].map(([l, k, t]) => (
                <div key={k} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>{l}</label>
                  <input type={t} value={form[k]} onChange={upd(k)} style={inp} required={['name', 'brand'].includes(k)} />
                </div>
              ))}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Description</label>
                <textarea value={form.description} onChange={upd('description')} style={{ ...inp, minHeight: 100, resize: 'vertical' }} required />
              </div>
            </div>
            {/* Pricing */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: 16 }}>Pricing & Inventory</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                {[['Price ($)', 'price'], ['Discount Price ($)', 'discountPrice'], ['Stock', 'stock']].map(([l, k]) => (
                  <div key={k}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>{l}</label>
                    <input type="number" value={form[k]} onChange={upd(k)} style={inp} min="0" step={k === 'stock' ? '1' : '0.01'} required={k !== 'discountPrice'} />
                  </div>
                ))}
              </div>
            </div>
            {/* Images */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3>Images</h3>
                <button type="button" onClick={() => setForm((p) => ({ ...p, images: [...p.images, { url: '', alt: '' }] }))} style={{ background: 'none', border: '1px dashed #ccc', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, color: '#888' }}>+ Add Image</button>
              </div>
              {form.images.map((img, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                  <input placeholder="Image URL" value={img.url} onChange={(e) => { const imgs = [...form.images]; imgs[i] = { ...imgs[i], url: e.target.value }; setForm((p) => ({ ...p, images: imgs })); }} style={{ ...inp, padding: '9px 12px' }} />
                  <input placeholder="Alt text" value={img.alt} onChange={(e) => { const imgs = [...form.images]; imgs[i] = { ...imgs[i], alt: e.target.value }; setForm((p) => ({ ...p, images: imgs })); }} style={{ ...inp, padding: '9px 12px' }} />
                  {form.images.length > 1 && <button type="button" onClick={() => setForm((p) => ({ ...p, images: p.images.filter((_, j) => j !== i) }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 18 }}>✕</button>}
                </div>
              ))}
              {form.images[0]?.url && <img src={form.images[0].url} alt="preview" style={{ width: 120, height: 120, borderRadius: 12, objectFit: 'cover', marginTop: 8 }} onError={(e) => e.target.style.display = 'none'} />}
            </div>
          </div>
          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: 16 }}>Category</h3>
              <select value={form.category} onChange={upd('category')} style={{ ...inp }}>
                {['Electronics', 'Fashion', 'Sports', 'Beauty', 'Home', 'Books', 'Toys', 'Grocery'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: 16 }}>Settings</h3>
              {[['isFeatured', 'Featured Product'], ['isNew', 'New Arrival']].map(([k, l]) => (
                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 12 }}>
                  <input type="checkbox" checked={form[k]} onChange={upd(k)} style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{l}</span>
                </label>
              ))}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: 16, padding: 16 }} disabled={saving}>
              {saving ? 'Saving...' : (isNew ? '✅ Create Product' : '✅ Save Changes')}
            </button>
            <Link to="/admin/products" className="btn btn-secondary" style={{ textAlign: 'center', textDecoration: 'none' }}>Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AdminProductEdit;
