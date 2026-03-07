// OrderConfirmPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';

export function OrderConfirmPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { orderAPI.getOrder(id).then((r) => setOrder(r.data)).catch(console.error); }, [id]);
  if (!order) return <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}><div className="spinner" /></div>;
  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
      <div style={{ background: 'white', borderRadius: 24, padding: 48, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: 70, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Order Confirmed!</h1>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 15 }}>Your order has been placed successfully</p>
        <div style={{ background: '#f8f8f8', borderRadius: 16, padding: '16px 24px', marginBottom: 24 }}>
          <p style={{ fontWeight: 700, fontSize: 18, color: 'var(--primary)', marginBottom: 4 }}>Order #{order.orderNumber}</p>
          <p style={{ color: '#888', fontSize: 14 }}>Total: <strong>${order.totalPrice?.toFixed(2)}</strong></p>
          <p style={{ color: '#888', fontSize: 14 }}>Payment: {order.paymentMethod}</p>
        </div>
        <p style={{ fontSize: 14, color: '#aaa', marginBottom: 28 }}>We'll send you shipping updates to your email</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to={`/orders/${order._id}`} className="btn btn-secondary">View Order</Link>
          <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
export default OrderConfirmPage;
