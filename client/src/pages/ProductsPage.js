import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import './ProductsPage.css';

const CATEGORIES = ['Electronics', 'Fashion', 'Sports', 'Beauty', 'Home', 'Books', 'Toys', 'Grocery'];
const SORTS = [
  { value: '', label: 'Default' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const keyword = params.get('keyword') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || '';
  const page = Number(params.get('page') || 1);
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';

  const [priceMin, setPriceMin] = useState(minPrice);
  const [priceMax, setPriceMax] = useState(maxPrice);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productAPI.getProducts({ keyword, category, sort, page, limit: 12, ...(minPrice && { minPrice }), ...(maxPrice && { maxPrice }) });
      setProducts(res.data.products);
      setTotalPages(res.data.pages);
      setTotal(res.data.total);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [keyword, category, sort, page, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(params);
    if (value) newParams.set(key, value); else newParams.delete(key);
    newParams.delete('page');
    setParams(newParams);
  };

  const applyPrice = () => {
    const newParams = new URLSearchParams(params);
    if (priceMin) newParams.set('minPrice', priceMin); else newParams.delete('minPrice');
    if (priceMax) newParams.set('maxPrice', priceMax); else newParams.delete('maxPrice');
    newParams.delete('page');
    setParams(newParams);
  };

  const clearFilters = () => { setParams({}); setPriceMin(''); setPriceMax(''); };

  return (
    <div className="products-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Filters</h3>
          {(category || sort || minPrice || maxPrice) && <button className="clear-btn" onClick={clearFilters}>Clear All</button>}
        </div>

        <div className="filter-group">
          <h4>Category</h4>
          <div className="filter-options">
            <button className={`filter-opt ${!category ? 'active' : ''}`} onClick={() => updateParam('category', '')}>All Categories</button>
            {CATEGORIES.map((c) => (
              <button key={c} className={`filter-opt ${category === c ? 'active' : ''}`} onClick={() => updateParam('category', c)}>{c}</button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4>Price Range</h4>
          <div className="price-inputs">
            <input type="number" placeholder="Min $" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} min="0" />
            <span>–</span>
            <input type="number" placeholder="Max $" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} min="0" />
          </div>
          <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: 8 }} onClick={applyPrice}>Apply</button>
        </div>

        <div className="filter-group">
          <h4>Sort By</h4>
          <div className="filter-options">
            {SORTS.map((s) => (
              <button key={s.value} className={`filter-opt ${sort === s.value ? 'active' : ''}`} onClick={() => updateParam('sort', s.value)}>{s.label}</button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="products-main">
        {/* Toolbar */}
        <div className="products-toolbar">
          <div>
            {keyword && <span className="search-tag">🔍 "{keyword}" <button onClick={() => updateParam('keyword', '')}>✕</button></span>}
            {category && <span className="search-tag">📂 {category} <button onClick={() => updateParam('category', '')}>✕</button></span>}
            <span className="results-count">{total} products found</span>
          </div>
          <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} className="sort-select">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="products-loading">
            {[...Array(8)].map((_, i) => <div key={i} className="product-skeleton" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="no-products">
            <div style={{ fontSize: 60 }}>🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <div className="products-grid-main">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => updateParam('page', page - 1)} className="page-btn">← Prev</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i + 1} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => updateParam('page', i + 1)}>{i + 1}</button>
            ))}
            <button disabled={page >= totalPages} onClick={() => updateParam('page', page + 1)} className="page-btn">Next →</button>
          </div>
        )}
      </main>
    </div>
  );
}
