// ProfilePage.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', currentPassword: '', password: '' });
  const [saving, setSaving] = useState(false);
  const upd = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const inp = { width: '100%', padding: '12px 16px', border: '1px solid #e8e8e8', borderRadius: 12, fontFamily: 'Poppins,sans-serif', fontSize: 14, outline: 'none', marginBottom: 14 };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(form);
      updateUser(res.data);
      toast.success('Profile updated! ✅');
    } catch (err) { toast.error(err.message || 'Failed to update'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 28 }}>My Profile</h1>
      <div style={{ background: 'white', borderRadius: 20, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name||'User')}&size=80&background=6C63FF&color=fff`} alt={user?.name} style={{ width: 80, height: 80, borderRadius: '50%' }} />
          <div><h2 style={{ fontWeight: 700 }}>{user?.name}</h2><p style={{ color: '#888', fontSize: 14 }}>{user?.email}</p>{user?.isAdmin && <span className="badge badge-primary">Admin</span>}</div>
        </div>
        <form onSubmit={handleSave}>
          {[['Full Name', 'name', 'text'], ['Email', 'email', 'email'], ['Phone', 'phone', 'tel']].map(([l, k, t]) => (
            <div key={k}><label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>{l}</label><input type={t} value={form[k]} onChange={upd(k)} style={inp} /></div>
          ))}
          <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '16px 0' }} />
          <p style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>Leave password blank to keep current</p>
          {[['Current Password', 'currentPassword'], ['New Password', 'password']].map(([l, k]) => (
            <div key={k}><label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>{l}</label><input type="password" value={form[k]} onChange={upd(k)} style={inp} placeholder="••••••••" /></div>
          ))}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}
export default ProfilePage;
