import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '120px 20px' }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🔍</div>
      <h1 style={{ fontSize: 72, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>404</h1>
      <h2 style={{ fontSize: 28, marginBottom: 12 }}>Page Not Found</h2>
      <p style={{ color: '#999', marginBottom: 32 }}>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>🏠 Go Home</Link>
    </div>
  );
}
