import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = React.useState(
    user?.wishlist?.some((id) => id === product._id || id?._id === product._id)
  );

  const image = product.images?.[0]?.url || 'https://via.placeholder.com/300';
  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please sign in to save items');
    try {
      await authAPI.toggleWishlist(product._id);
      setWishlisted((p) => !p);
      toast.success(wishlisted ? 'Removed from wishlist' : '❤️ Added to wishlist');
    } catch { toast.error('Failed to update wishlist'); }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-card-image-wrap">
        <img src={image} alt={product.name} className="product-card-image" loading="lazy" onError={(e) => e.target.src = 'https://via.placeholder.com/300'} />
        <div className="product-card-badges">
          {hasDiscount && <span className="badge-sale">-{discountPct}%</span>}
          {product.isNew && <span className="badge-new">NEW</span>}
          {product.stock === 0 && <span className="badge-oos">Out of Stock</span>}
        </div>
        <button className={`wishlist-btn ${wishlisted ? 'active' : ''}`} onClick={handleWishlist} title="Add to wishlist">
          {wishlisted ? '❤️' : '🤍'}
        </button>
      </Link>
      <div className="product-card-body">
        <p className="product-brand">{product.brand}</p>
        <Link to={`/products/${product._id}`} className="product-name">{product.name}</Link>
        <div className="product-rating">
          {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
          <span>({product.numReviews?.toLocaleString()})</span>
        </div>
        <div className="product-price-row">
          <div className="product-prices">
            <span className="price-current">${price?.toFixed(2)}</span>
            {hasDiscount && <span className="price-original">${product.price?.toFixed(2)}</span>}
          </div>
          <button
            className="add-cart-btn"
            onClick={() => product.stock > 0 && addItem(product)}
            disabled={product.stock === 0}
            title="Add to cart"
          >
            {product.stock > 0 ? '+ Cart' : '✕'}
          </button>
        </div>
      </div>
    </div>
  );
}
