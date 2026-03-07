// LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate(params.get('redirect') || '/');
    } catch (err) { toast.error(err.message || 'Invalid credentials'); }
    finally { setLoading(false); }
  };

  const inp = { width: '100%', padding: '14px 16px', border: '1px solid #e8e8e8', borderRadius: 14, fontFamily: 'Poppins,sans-serif', fontSize: 14, outline: 'none', marginBottom: 14 };
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ background: 'white', borderRadius: 24, padding: '48px 40px', width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>👋</div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Welcome Back!</h1>
          <p style={{ color: '#999', fontSize: 14 }}>Sign in to your ShopWave account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inp} placeholder="you@example.com" required />
          <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inp, paddingRight: 48 }} placeholder="••••••••" required />
            <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 14, top: 14, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>{show ? '🙈' : '👁️'}</button>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: 16, padding: '14px 0', marginTop: 8 }} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#888' }}>
          <p>Demo: <strong>demo@shopwave.com</strong> / <strong>demo123</strong></p>
        </div>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#888' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
export default LoginPage;
