import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/products', {
        params: { keyword, category, page },
      });
      setProducts(data.products);
      setPages(data.pages);
    } catch (err) {
      setError('Could not load products. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  }, [keyword, category, page]);

  useEffect(() => {
    api.get('/products/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="container py-4">
      <div className="p-5 mb-4 bg-primary bg-gradient text-white rounded-3">
        <h1 className="display-6 fw-bold">Welcome to ShopEZ</h1>
        <p className="col-md-8 fs-6">
          Your one-stop destination for online shopping. Browse curated products, compare deals,
          and checkout securely.
        </p>
      </div>

      <div className="row mb-4 g-2">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => {
              setPage(1);
              setKeyword(e.target.value);
            }}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="text-center py-5"><div className="spinner-border text-primary" /></div>}
      {error && <div className="alert alert-warning">{error}</div>}

      {!loading && !error && (
        <>
          <div className="row">
            {products.length === 0 && <p className="text-muted">No products found.</p>}
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {pages > 1 && (
            <nav className="d-flex justify-content-center mt-3">
              <ul className="pagination">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
