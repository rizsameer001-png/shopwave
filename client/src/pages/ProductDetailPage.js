import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, authAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [tab, setTab] = useState('description');

  useEffect(() => {
    setLoading(true);
    productAPI.getProduct(id)
      .then((r) => { setProduct(r.data); setImgIdx(0); setSelectedSize(''); setSelectedColor(''); setQty(1); })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
    productAPI.getRelated(id).then((r) => setRelated(r.data)).catch(() => {});
  }, [id, navigate]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}><div className="spinner" /></div>;
  if (!product) return null;

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const images = product.images?.length ? product.images : [{ url: 'https://via.placeholder.com/500', alt: product.name }];

  const handleAddToCart = () => {
    if (product.sizes?.length && !selectedSize) return toast.error('Please select a size');
    if (product.colors?.length && !selectedColor) return toast.error('Please select a color');
    addItem(product, qty, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    if (product.sizes?.length && !selectedSize) return toast.error('Please select a size');
    if (product.colors?.length && !selectedColor) return toast.error('Please select a color');
    addItem(product, qty, selectedSize, selectedColor);
    navigate('/checkout');
  };

  const submitReview = async () => {
    if (!user) return toast.error('Please sign in to leave a review');
    if (!reviewComment.trim()) return toast.error('Please write a comment');
    setSubmittingReview(true);
    try {
      await productAPI.addReview(product._id, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted! 🌟');
      setReviewComment('');
      const r = await productAPI.getProduct(id);
      setProduct(r.data);
    } catch (err) { toast.error(err.message || 'Failed to submit review'); }
    finally { setSubmittingReview(false); }
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Images */}
        <div className="product-images">
          <div className="main-image">
            <img src={images[imgIdx]?.url} alt={images[imgIdx]?.alt || product.name} onError={(e) => e.target.src = 'https://via.placeholder.com/500'} />
            {hasDiscount && <div className="detail-badge">-{product.discountPercent}% OFF</div>}
          </div>
          {images.length > 1 && (
            <div className="thumbnails">
              {images.map((img, i) => (
                <img key={i} src={img.url} alt={img.alt} className={`thumb ${i === imgIdx ? 'active' : ''}`} onClick={() => setImgIdx(i)} onError={(e) => e.target.src = 'https://via.placeholder.com/80'} />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-info">
          <div className="product-meta">
            <span className="detail-category">{product.category}</span>
            {product.isNew && <span className="badge badge-success">New Arrival</span>}
            {product.stock === 0 && <span className="badge badge-danger">Out of Stock</span>}
          </div>
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-brand">by <strong>{product.brand}</strong></p>

          {/* Rating */}
          <div className="detail-rating">
            <span className="stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span>{product.rating?.toFixed(1)} ({product.numReviews?.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div className="detail-price">
            <span className="detail-price-current">${price?.toFixed(2)}</span>
            {hasDiscount && <span className="detail-price-original">${product.price?.toFixed(2)}</span>}
          </div>
          <p className="detail-short">{product.shortDescription}</p>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="option-group">
              <label>Color: <strong>{selectedColor || 'Select'}</strong></label>
              <div className="color-options">
                {product.colors.map((c) => (
                  <button key={c.name} className={`color-btn ${selectedColor === c.name ? 'active' : ''}`} style={{ background: c.hex || '#ccc' }} title={c.name} onClick={() => setSelectedColor(c.name)}>
                    {selectedColor === c.name && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="option-group">
              <label>Size: <strong>{selectedSize || 'Select'}</strong></label>
              <div className="size-options">
                {product.sizes.map((s) => (
                  <button key={s} className={`size-btn ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="option-group">
            <label>Quantity</label>
            <div className="qty-control">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
              <span className="stock-info">{product.stock} in stock</span>
            </div>
          </div>

          {/* Actions */}
          <div className="detail-actions">
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddToCart} disabled={product.stock === 0}>🛍️ Add to Cart</button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleBuyNow} disabled={product.stock === 0}>⚡ Buy Now</button>
          </div>

          {/* Perks */}
          <div className="detail-perks">
            {[['🚚', 'Free shipping over $50'], ['↩️', '30-day returns'], ['🔒', 'Secure checkout'], ['✅', '1-year warranty']].map(([icon, text]) => (
              <div key={text} className="perk"><span>{icon}</span><span>{text}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs-container">
        <div className="detail-tabs">
          {['description', 'specifications', 'reviews'].map((t) => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)} {t === 'reviews' && `(${product.numReviews})`}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {tab === 'description' && <p style={{ lineHeight: 1.8, color: '#555' }}>{product.description}</p>}
          {tab === 'specifications' && (
            product.specifications ? (
              <table className="specs-table">
                <tbody>
                  {[...product.specifications.entries()].map(([k, v]) => (
                    <tr key={k}><td>{k}</td><td>{v}</td></tr>
                  ))}
                </tbody>
              </table>
            ) : <p style={{ color: '#999' }}>No specifications available</p>
          )}
          {tab === 'reviews' && (
            <div className="reviews-section">
              {user && (
                <div className="review-form">
                  <h4>Write a Review</h4>
                  <div className="star-select">
                    {[1,2,3,4,5].map((s) => <button key={s} className={s <= reviewRating ? 'star-active' : 'star-inactive'} onClick={() => setReviewRating(s)}>★</button>)}
                  </div>
                  <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Share your experience with this product..." rows={4} />
                  <button className="btn btn-primary" onClick={submitReview} disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              )}
              {product.reviews?.length ? (
                product.reviews.map((r) => (
                  <div key={r._id} className="review-card">
                    <div className="review-header">
                      <img src={r.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&size=36&background=6C63FF&color=fff`} alt={r.name} />
                      <div><strong>{r.name}</strong><div className="review-date">{new Date(r.createdAt).toLocaleDateString()}</div></div>
                      <div className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    </div>
                    <p>{r.comment}</p>
                  </div>
                ))
              ) : <p style={{ color: '#999' }}>No reviews yet. Be the first to review!</p>}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="related-section">
          <h2>You May Also Like</h2>
          <div className="related-grid">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
