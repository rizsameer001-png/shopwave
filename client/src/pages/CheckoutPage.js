import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const STEPS = ['Shipping', 'Payment', 'Review'];
const PAYMENT_METHODS = ['Credit Card', 'PayPal', 'Apple Pay', 'Cash on Delivery'];

export default function CheckoutPage() {
  const { items, subtotal, shipping, tax, total, toOrderPayload, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [addr, setAddr] = useState({ fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'US' });
  const [payment, setPayment] = useState('Credit Card');

  if (!items.length) { navigate('/cart'); return null; }

  const updateAddr = (k, v) => setAddr((p) => ({ ...p, [k]: v }));

  const validateAddr = () => {
    const required = ['fullName', 'street', 'city', 'state', 'zipCode'];
    for (const f of required) { if (!addr[f].trim()) { toast.error(`${f} is required`); return false; } }
    return true;
  };

  const handleNext = () => {
    if (step === 0 && !validateAddr()) return;
    setStep((s) => Math.min(s + 1, 2));
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const payload = { ...toOrderPayload(), shippingAddress: addr, paymentMethod: payment };
      const res = await orderAPI.createOrder(payload);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order/${res.data._id}/confirm`);
    } catch (err) { toast.error(err.message || 'Failed to place order'); }
    finally { setPlacing(false); }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1px solid #e8e8e8', borderRadius: 12, fontFamily: 'Poppins,sans-serif', fontSize: 14, outline: 'none', marginBottom: 12 };

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 20px' }}>
      {/* Step indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0, marginBottom: 40 }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: i < step ? 'pointer' : 'default' }} onClick={() => i < step && setStep(i)}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: i <= step ? 'var(--primary)' : '#e8e8e8', color: i <= step ? 'white' : '#999', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, transition: 'all 0.2s' }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 12, marginTop: 6, fontWeight: i === step ? 700 : 400, color: i === step ? 'var(--primary)' : '#999' }}>{s}</span>
            </div>
            {i < 2 && <div style={{ width: 80, height: 2, background: i < step ? 'var(--primary)' : '#e8e8e8', margin: '0 8px', marginBottom: 20, transition: 'background 0.3s' }} />}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
        {/* Step Content */}
        <div style={{ background: 'white', borderRadius: 20, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          {step === 0 && (
            <div>
              <h2 style={{ marginBottom: 24 }}>Shipping Address</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                {[['Full Name', 'fullName', 'text'], ['Phone', 'phone', 'tel'], ['Street Address', 'street', 'text'], ['City', 'city', 'text'], ['State', 'state', 'text'], ['ZIP Code', 'zipCode', 'text']].map(([label, key, type]) => (
                  <div key={key} style={{ gridColumn: key === 'street' ? '1 / -1' : undefined }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>{label}</label>
                    <input type={type} value={addr[key]} onChange={(e) => updateAddr(key, e.target.value)} style={inputStyle} placeholder={label} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ marginBottom: 24 }}>Payment Method</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {PAYMENT_METHODS.map((m) => (
                  <div key={m} onClick={() => setPayment(m)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, border: `2px solid ${payment === m ? 'var(--primary)' : '#e8e8e8'}`, borderRadius: 16, cursor: 'pointer', background: payment === m ? 'rgba(108,99,255,0.04)' : 'white', transition: 'all 0.2s' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${payment === m ? 'var(--primary)' : '#ccc'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {payment === m && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)' }} />}
                    </div>
                    <span style={{ fontWeight: 600, color: payment === m ? 'var(--primary)' : '#555' }}>{m}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 20 }}>{{'Credit Card':'💳','PayPal':'🅿️','Apple Pay':'🍎','Cash on Delivery':'💵'}[m]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ marginBottom: 24 }}>Review Order</h2>
              <div style={{ background: '#f8f8f8', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <h4 style={{ marginBottom: 8, fontSize: 14, color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shipping To</h4>
                <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>{addr.fullName}<br />{addr.street}<br />{addr.city}, {addr.state} {addr.zipCode}, {addr.country}</p>
              </div>
              <div style={{ background: '#f8f8f8', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <h4 style={{ marginBottom: 8, fontSize: 14, color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment</h4>
                <p style={{ fontSize: 14 }}>{payment}</p>
              </div>
              <div>
                {items.map((item) => (
                  <div key={item.key} style={{ display: 'flex', gap: 12, alignItems: 'center', paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                    <img src={item.product.images?.[0]?.url} alt={item.product.name} style={{ width: 50, height: 50, borderRadius: 10, objectFit: 'cover' }} />
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.product.name}</span>
                    <span style={{ color: '#999', fontSize: 13 }}>×{item.quantity}</span>
                    <span style={{ fontWeight: 700 }}>${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            {step > 0 && <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>}
            {step < 2 ? (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleNext}>Continue →</button>
            ) : (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handlePlaceOrder} disabled={placing}>
                {placing ? 'Placing Order...' : '🎉 Place Order'}
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', position: 'sticky', top: 90 }}>
          <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
          {[['Subtotal', `$${subtotal.toFixed(2)}`], ['Shipping', shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`], ['Tax', `$${tax.toFixed(2)}`]].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#666', marginBottom: 8 }}><span>{l}</span><span>{v}</span></div>
          ))}
          <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: 14, marginTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18 }}>
            <span>Total</span><span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
          </div>
          <div style={{ marginTop: 16 }}>
            {items.map((item) => (
              <div key={item.key} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, fontSize: 12, color: '#666' }}>
                <img src={item.product.images?.[0]?.url} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
                <span style={{ flex: 1 }}>{item.product.name.slice(0, 24)}...</span>
                <span>×{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
