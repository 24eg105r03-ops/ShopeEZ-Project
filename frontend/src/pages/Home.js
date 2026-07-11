import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { toast } from '../components/Toast';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Local filter inputs to prevent immediate API requests on keystroke
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/products', {
        params: {
          keyword,
          category,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          sort,
          page,
          limit: 8
        },
      });
      setProducts(data.products);
      setPages(data.pages);
    } catch (err) {
      setError('Could not load products. Please check if the backend is running.');
      toast.error('Network error loading product catalog.');
    } finally {
      setLoading(false);
    }
  }, [keyword, category, minPrice, maxPrice, sort, page]);

  useEffect(() => {
    api.get('/products/categories')
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleApplyPrice = (e) => {
    e.preventDefault();
    setMinPrice(minPriceInput);
    setMaxPrice(maxPriceInput);
    setPage(1);
  };

  const handleResetFilters = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    setMinPrice('');
    setMaxPrice('');
    setKeyword('');
    setCategory('');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="container py-5">
      {/* Premium Hero Banner */}
      <div className="p-5 mb-5 text-white hero-gradient rounded-3 shadow">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-primary px-3 py-2 mb-3 fw-bold tracking-wide">SUMMER COLLECTION</span>
            <h1 className="display-4 fw-bold mb-3">Welcome to ShopEZ</h1>
            <p className="fs-5 text-white-50 mb-0">
              Discover curated luxury items, premium tech accessories, and daily lifestyle essentials. Enjoy secure checkout and fast worldwide shipping.
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Sidebar Filters */}
        <div className="col-lg-3">
          <div className="card shadow-sm border-light rounded-3 p-4 sticky-lg-top" style={{ top: '90px', zIndex: 10 }}>
            <h5 className="fw-bold mb-3 d-flex align-items-center justify-content-between">
              <span>Filters</span>
              <button className="btn btn-link text-muted btn-sm p-0 text-decoration-none fw-medium" onClick={handleResetFilters}>
                Reset All
              </button>
            </h5>
            
            {/* Search */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary">Search Products</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><i className="fa-solid fa-magnifying-glass"></i></span>
                <input
                  className="form-control border-start-0 ps-0 bg-light"
                  placeholder="Type to search..."
                  value={keyword}
                  onChange={(e) => {
                    setPage(1);
                    setKeyword(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary">Category</label>
              <select
                className="form-select bg-light"
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

            {/* Price Range */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary">Price Range (₹)</label>
              <form onSubmit={handleApplyPrice} className="row g-2">
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control bg-light"
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control bg-light"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-outline-primary btn-sm w-100 fw-semibold mt-1">
                    Apply Price
                  </button>
                </div>
              </form>
            </div>

            {/* Sorting */}
            <div>
              <label className="form-label small fw-semibold text-secondary">Sort By</label>
              <select
                className="form-select bg-light"
                value={sort}
                onChange={(e) => {
                  setPage(1);
                  setSort(e.target.value);
                }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Listing Grid */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <p className="text-muted mb-0">
              {!loading && `Showing ${products.length} products`}
            </p>
          </div>

          {error && (
            <div className="alert alert-warning border-0 shadow-sm p-4 text-center rounded-3">
              <i className="fa-solid fa-triangle-exclamation fs-3 text-warning mb-2"></i>
              <h5 className="fw-semibold">Something went wrong</h5>
              <p className="mb-0 text-muted">{error}</p>
            </div>
          )}

          <div className="row">
            {loading ? (
              <ProductSkeleton count={8} />
            ) : products.length === 0 ? (
              <div className="text-center py-5">
                <i className="fa-regular fa-folder-open fs-1 text-muted mb-3"></i>
                <h5 className="fw-semibold text-secondary">No products matching your filters</h5>
                <p className="text-muted small">Try refining your keyword search or resetting price range filters.</p>
              </div>
            ) : (
              products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && pages > 1 && (
            <nav className="d-flex justify-content-center mt-5">
              <ul className="pagination shadow-sm">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}>&laquo;</button>
                </li>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                    <button className="page-link fw-semibold" onClick={() => setPage(p)}>{p}</button>
                  </li>
                ))}
                <li className={`page-item ${page === pages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>&raquo;</button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
