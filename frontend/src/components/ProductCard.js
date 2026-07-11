import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from './Toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const hasDiscount = product.discountPercent > 0;
  
  const handleQuickAdd = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success(`"${product.name}" added to cart!`);
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="card h-100 product-card border-light">
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <div className="product-card-img-wrapper">
            <img
              src={product.image}
              className="product-card-img"
              alt={product.name}
            />
            {hasDiscount && (
              <span className="badge-discount">
                -{product.discountPercent}% OFF
              </span>
            )}
          </div>
        </Link>
        
        <div className="card-body p-3 d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-light text-secondary border border-light">
              {product.category}
            </span>
            {product.countInStock > 0 && product.countInStock <= 5 && (
              <span className="badge bg-warning-subtle text-warning border border-warning-subtle fw-semibold" style={{ fontSize: '0.7rem' }}>
                Only {product.countInStock} left!
              </span>
            )}
          </div>
          
          <h6 className="card-title mb-1" style={{ minHeight: '38px' }}>
            <Link to={`/product/${product._id}`} className="text-decoration-none text-dark fw-semibold" style={{ fontSize: '0.95rem' }}>
              {product.name}
            </Link>
          </h6>
          
          <div className="text-warning small mb-3">
            <i className="fa-solid fa-star me-1" style={{ fontSize: '0.8rem' }}></i>
            <span className="fw-semibold">{product.rating?.toFixed(1) || '0.0'}</span>
            <span className="text-muted ms-1">({product.numReviews || 0})</span>
          </div>

          <div className="mt-auto pt-2 border-top border-light d-flex justify-content-between align-items-center">
            <div>
              {hasDiscount ? (
                <div className="d-flex flex-column">
                  <span className="text-muted text-decoration-line-through small" style={{ fontSize: '0.75rem' }}>
                    ₹{product.price.toFixed(2)}
                  </span>
                  <span className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
                    ₹{product.finalPrice.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>

            {product.countInStock > 0 ? (
              <button
                className="btn btn-primary btn-sm px-2 py-1 rounded"
                onClick={handleQuickAdd}
                title="Add to Cart"
              >
                <i className="fa-solid fa-cart-plus me-1"></i> Add
              </button>
            ) : (
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle py-1 px-2" style={{ fontSize: '0.75rem' }}>
                Sold Out
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
