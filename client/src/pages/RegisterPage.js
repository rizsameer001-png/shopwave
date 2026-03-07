import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const upd = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const inp = { width: '100%', padding: '13px 16px', border: '1px solid #e8e8e8', borderRadius: 12, fontFamily: 'Poppins,sans-serif', fontSize: 14, outline: 'none', marginBottom: 14 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try { await register(form.name, form.email, form.password); navigate('/'); }
    catch (err) { toast.error(err.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ background: 'white', borderRadius: 24, padding: '48px 40px', width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Create Account</h1>
          <p style={{ color: '#999', fontSize: 14 }}>Join millions of happy shoppers</p>
        </div>
        <form onSubmit={handleSubmit}>
          {[['Full Name', 'name', 'text', 'Your full name'], ['Email Address', 'email', 'email', 'you@example.com'], ['Password', 'password', 'password', 'At least 6 characters'], ['Confirm Password', 'confirm', 'password', 'Repeat password']].map(([label, key, type, placeholder]) => (
            <div key={key}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>{label}</label>
              <input type={type} value={form[key]} onChange={upd(key)} style={inp} placeholder={placeholder} required />
            </div>
          ))}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: 16, padding: '14px 0' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#888' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
