import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#1A1A2E', color: '#aaa', marginTop: 60 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '50px 20px 30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 12 }}>🛍️ ShopWave</div>
          <p style={{ fontSize: 13, lineHeight: 1.7 }}>Your ultimate shopping destination. Quality products, fast delivery, and excellent customer service.</p>
        </div>
        {[
          { title: 'Shop', links: [['All Products', '/products'], ['Electronics', '/products?category=Electronics'], ['Fashion', '/products?category=Fashion'], ['Sports', '/products?category=Sports']] },
          { title: 'Account', links: [['My Orders', '/orders'], ['Wishlist', '/wishlist'], ['Profile', '/profile'], ['Sign In', '/login']] },
          { title: 'Support', links: [['Help Center', '#'], ['Returns', '#'], ['Track Order', '#'], ['Contact Us', '#']] },
        ].map((col) => (
          <div key={col.title}>
            <h4 style={{ color: 'white', marginBottom: 16, fontSize: 15 }}>{col.title}</h4>
            {col.links.map(([label, href]) => (
              <Link key={label} to={href} style={{ display: 'block', color: '#aaa', textDecoration: 'none', fontSize: 13, marginBottom: 8, transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#6C63FF'} onMouseLeave={(e) => e.target.style.color = '#aaa'}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid #2d2d4e', textAlign: 'center', padding: '20px', fontSize: 12 }}>
        © {new Date().getFullYear()} ShopWave. All rights reserved. Built with ❤️ using MERN + Flutter
      </div>
    </footer>
  );
}
