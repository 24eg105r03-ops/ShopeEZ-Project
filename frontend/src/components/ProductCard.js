import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const hasDiscount = product.discountPercent > 0;
  return (
    <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm product-card">
        <Link to={`/product/${product._id}`}>
          <img src={product.image} className="card-img-top p-3" alt={product.name} style={{ height: 200, objectFit: 'contain' }} />
        </Link>
        <div className="card-body d-flex flex-column">
          <span className="badge bg-secondary-subtle text-secondary-emphasis mb-2 align-self-start">
            {product.category}
          </span>
          <h6 className="card-title">
            <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
              {product.name}
            </Link>
          </h6>
          <div className="mt-auto">
            {hasDiscount ? (
              <div>
                <span className="text-muted text-decoration-line-through me-2">${product.price.toFixed(2)}</span>
                <span className="fw-bold text-success">${product.finalPrice.toFixed(2)}</span>
                <span className="badge bg-danger ms-2">-{product.discountPercent}%</span>
              </div>
            ) : (
              <span className="fw-bold">${product.price.toFixed(2)}</span>
            )}
            <div className="small text-warning mt-1">
              <i className="fa-solid fa-star"></i> {product.rating?.toFixed(1) || '0.0'} ({product.numReviews || 0})
            </div>
            {product.countInStock === 0 && <div className="small text-danger fw-semibold">Out of stock</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
