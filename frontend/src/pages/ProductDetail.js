import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadProduct = useCallback(async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      setError('Product not found or has been removed.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`Added ${qty} x "${product.name}" to cart!`);
    navigate('/cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating: reviewRating, comment: reviewText });
      setReviewText('');
      toast.success('Thank you! Review submitted.');
      loadProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger border-0 shadow-sm p-4 rounded-3 d-inline-block">
          <i className="fa-solid fa-triangle-exclamation fs-3 mb-2"></i>
          <h5>Product Not Found</h5>
          <p className="mb-3 text-muted">{error}</p>
          <Link to="/" className="btn btn-primary btn-sm px-4 fw-semibold">Return to Catalog</Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discountPercent > 0;
  const isLowStock = product.countInStock > 0 && product.countInStock <= 5;

  return (
    <div className="container py-5">
      {/* Breadcrumb / Back Navigation */}
      <nav className="mb-4">
        <Link to="/" className="text-decoration-none text-muted fw-semibold small d-flex align-items-center gap-1">
          <i className="fa-solid fa-arrow-left"></i> Back to Catalog
        </Link>
      </nav>

      <div className="row g-5 mb-5">
        {/* Image Card Gallery */}
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-light rounded-3 p-4 bg-white d-flex align-items-center justify-content-center" style={{ minHeight: '350px' }}>
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid rounded"
              style={{ maxHeight: '350px', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Product Configurations Info */}
        <div className="col-md-6 col-lg-7">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-light text-primary border border-light px-3 py-2 fw-semibold">
              {product.category}
            </span>
            {product.countInStock > 0 ? (
              isLowStock ? (
                <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-2 fw-semibold">
                  Only {product.countInStock} Left!
                </span>
              ) : (
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-2 fw-semibold">
                  In Stock
                </span>
              )
            ) : (
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-2 fw-semibold">
                Out of Stock
              </span>
            )}
          </div>

          <h1 className="fw-bold mb-2 text-dark">{product.name}</h1>
          
          <div className="d-flex align-items-center gap-2 text-warning mb-3">
            <div className="fs-6">
              {'★'.repeat(Math.round(product.rating || 0))}
              {'☆'.repeat(5 - Math.round(product.rating || 0))}
            </div>
            <span className="text-dark fw-bold ms-1" style={{ fontSize: '0.9rem' }}>
              {product.rating?.toFixed(1) || '0.0'}
            </span>
            <span className="text-muted small">({product.numReviews} buyer reviews)</span>
          </div>

          <p className="text-muted mb-4 fs-6 lh-base" style={{ whiteSpace: 'pre-line' }}>{product.description}</p>

          {/* Price details */}
          <div className="p-3 bg-light rounded-3 mb-4 d-inline-block border border-light">
            <div className="d-flex align-items-center gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-muted text-decoration-line-through fs-5">₹{product.price.toFixed(2)}</span>
                  <span className="fw-bold text-primary fs-2">₹{product.finalPrice.toFixed(2)}</span>
                  <span className="badge bg-danger px-2 py-1.5 rounded-pill fs-7">
                    SAVE {product.discountPercent}%
                  </span>
                </>
              ) : (
                <span className="fw-bold text-dark fs-2">₹{product.price.toFixed(2)}</span>
              )}
            </div>
          </div>

          {/* Cart triggers */}
          {product.countInStock > 0 ? (
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="d-flex align-items-center gap-2">
                <label className="fw-bold small text-secondary mb-0">Qty:</label>
                <select
                  className="form-select bg-light border-light py-2 px-3 fw-semibold text-dark rounded"
                  style={{ minWidth: '75px' }}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {Array.from({ length: Math.min(product.countInStock, 10) }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <button className="btn btn-primary px-4 py-2.5 fw-semibold rounded shadow-sm d-flex align-items-center gap-2" onClick={handleAddToCart}>
                <i className="fa-solid fa-cart-plus fs-5"></i> Add to Shopping Cart
              </button>
            </div>
          ) : (
            <div className="alert alert-danger border-0 rounded-3 p-3 mb-4 d-inline-block">
              <i className="fa-solid fa-bell-slash me-2"></i> This product is currently sold out and unavailable.
            </div>
          )}

          {product.seller && (
            <div className="p-3 border border-light bg-light rounded-3 d-flex align-items-center gap-2 mt-4" style={{ maxWidth: '350px' }}>
              <i className="fa-solid fa-store text-muted fs-5"></i>
              <div className="small">
                <span className="text-muted">Verified Seller: </span>
                <span className="fw-bold text-dark">{product.seller.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <hr className="my-5 border-light" />

      {/* Reviews Split Grid */}
      <div className="row g-5">
        <div className="col-lg-7">
          <h4 className="fw-bold mb-4 text-dark">Customer Experiences</h4>
          {product.reviews.length === 0 ? (
            <div className="card p-5 border-0 bg-light text-center rounded-3">
              <i className="fa-regular fa-comments fs-2 text-muted mb-2"></i>
              <p className="text-muted mb-0">No one has reviewed this product yet. Be the first to share your opinion!</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {product.reviews.map((r) => (
                <div key={r._id} className="card p-3 border-light shadow-sm rounded-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold text-uppercase" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                        {r.name.slice(0, 2)}
                      </div>
                      <div>
                        <strong className="text-dark small d-block">{r.name}</strong>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(r.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-warning small">
                      {'★'.repeat(r.rating)}
                      {'☆'.repeat(5 - r.rating)}
                    </div>
                  </div>
                  <p className="mb-0 text-secondary small">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-lg-5">
          <div className="card p-4 border-light shadow-sm bg-light rounded-3">
            <h5 className="fw-bold mb-3 text-dark">Submit a Review</h5>
            {!user ? (
              <div className="text-center py-3">
                <p className="text-muted small">You must be logged in to leave reviews.</p>
                <Link to="/login" className="btn btn-outline-primary btn-sm fw-semibold px-3">Sign In Account</Link>
              </div>
            ) : (
              <form onSubmit={submitReview}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Star Rating</label>
                  <select
                    className="form-select bg-white border-light"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Poor</option>
                    <option value={1}>1 Star - Terrible</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Comments</label>
                  <textarea
                    className="form-control bg-white border-light"
                    rows="4"
                    placeholder="Write details about product quality, shipping experience, and customer satisfaction..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                  />
                </div>
                <button
                  className="btn btn-primary w-100 py-2 fw-semibold rounded"
                  type="submit"
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
