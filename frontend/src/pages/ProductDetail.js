import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewMsg, setReviewMsg] = useState('');

  const loadProduct = () => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data)).catch(() => setError('Product not found'));
  };

  useEffect(() => { loadProduct(); }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    try {
      await api.post(`/products/${id}/reviews`, { rating: reviewRating, comment: reviewText });
      setReviewText('');
      setReviewMsg('Review submitted!');
      loadProduct();
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Could not submit review');
    }
  };

  if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;
  if (!product) return <div className="container py-5 text-center"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-md-5">
          <img src={product.image} alt={product.name} className="img-fluid rounded shadow-sm" />
        </div>
        <div className="col-md-7">
          <span className="badge bg-secondary-subtle text-secondary-emphasis mb-2">{product.category}</span>
          <h2>{product.name}</h2>
          <div className="text-warning mb-2">
            <i className="fa-solid fa-star"></i> {product.rating?.toFixed(1) || '0.0'} ({product.numReviews} reviews)
          </div>
          <p className="text-muted">{product.description}</p>

          <div className="mb-3">
            {product.discountPercent > 0 ? (
              <>
                <span className="text-muted text-decoration-line-through me-2 fs-5">${product.price.toFixed(2)}</span>
                <span className="fw-bold text-success fs-3">${product.finalPrice.toFixed(2)}</span>
                <span className="badge bg-danger ms-2">-{product.discountPercent}%</span>
              </>
            ) : (
              <span className="fw-bold fs-3">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className={product.countInStock > 0 ? 'text-success' : 'text-danger'}>
            {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}
          </p>

          {product.countInStock > 0 && (
            <div className="d-flex align-items-center gap-3 mb-3">
              <label className="fw-semibold mb-0">Qty:</label>
              <select className="form-select w-auto" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {Array.from({ length: Math.min(product.countInStock, 10) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <button className="btn btn-primary" onClick={handleAddToCart}>
                <i className="fa-solid fa-cart-plus me-1"></i> Add to Cart
              </button>
            </div>
          )}

          {product.seller && (
            <p className="small text-muted">Sold by: {product.seller.name}</p>
          )}
        </div>
      </div>

      <hr className="my-5" />

      <div className="row">
        <div className="col-md-7">
          <h4>Customer Reviews</h4>
          {product.reviews.length === 0 && <p className="text-muted">No reviews yet.</p>}
          {product.reviews.map((r) => (
            <div key={r._id} className="border-bottom py-2">
              <strong>{r.name}</strong>{' '}
              <span className="text-warning">
                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
              </span>
              <p className="mb-0">{r.comment}</p>
            </div>
          ))}
        </div>
        <div className="col-md-5">
          <h5>Write a Review</h5>
          {!user && <p className="text-muted">Please log in to leave a review.</p>}
          {user && (
            <form onSubmit={submitReview}>
              <div className="mb-2">
                <select className="form-select" value={reviewRating} onChange={(e) => setReviewRating(e.target.value)}>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="mb-2">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Share your experience..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                />
              </div>
              <button className="btn btn-outline-primary btn-sm" type="submit">Submit Review</button>
              {reviewMsg && <div className="small mt-2">{reviewMsg}</div>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
