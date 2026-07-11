import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

const Cart = () => {
  const { cartItems, updateQty, removeFromCart, itemsPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate(user ? '/checkout' : '/login?redirect=/checkout');
  };

  const handleQtyChange = (productId, name, qty) => {
    updateQty(productId, qty);
    toast.success(`Updated "${name}" quantity to ${qty}.`);
  };

  const handleRemove = (productId, name) => {
    removeFromCart(productId);
    toast.success(`Removed "${name}" from cart.`);
  };

  const freeShippingThreshold = 999.0;
  const qualifiesForFreeShipping = itemsPrice >= freeShippingThreshold;
  const differenceToFreeShipping = (freeShippingThreshold - itemsPrice).toFixed(2);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-dark">Shopping Bag</h2>
      
      {cartItems.length === 0 ? (
        <div className="card text-center p-5 border-light shadow-sm bg-white rounded-3">
          <i className="fa-solid fa-cart-shopping text-muted display-4 mb-3"></i>
          <h4 className="fw-bold text-secondary">Your shopping bag is empty</h4>
          <p className="text-muted mb-4 small">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn btn-primary px-4 py-2 fw-semibold shadow-sm">
            Go Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Cart Items List */}
          <div className="col-lg-8">
            <div className="card border-light shadow-sm rounded-3 p-3 bg-white">
              {cartItems.map((item) => (
                <div key={item.productId} className="d-flex align-items-center border-bottom border-light py-3 last-border-none">
                  <div className="p-2 border border-light rounded bg-light" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  
                  <div className="ms-3 flex-grow-1">
                    <Link to={`/product/${item.productId}`} className="text-decoration-none text-dark fw-semibold small d-block">
                      {item.name}
                    </Link>
                    <div className="text-muted small mt-1">₹{item.price.toFixed(2)} each</div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <label className="small text-muted d-none d-sm-inline">Qty:</label>
                    <select
                      className="form-select form-select-sm bg-light border-light fw-medium"
                      style={{ width: '70px' }}
                      value={item.qty}
                      onChange={(e) => handleQtyChange(item.productId, item.name, Number(e.target.value))}
                    >
                      {Array.from({ length: Math.min(item.countInStock || 10, 10) }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  <div className="fw-bold text-dark text-end ms-4" style={{ minWidth: '80px' }}>
                    ₹{(item.price * item.qty).toFixed(2)}
                  </div>

                  <button className="btn btn-link text-danger border-0 ms-3" onClick={() => handleRemove(item.productId, item.name)} title="Remove Item">
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Summary details */}
          <div className="col-lg-4">
            {!qualifiesForFreeShipping ? (
              <div className="alert alert-warning border-0 shadow-sm p-3 mb-4 rounded-3 small text-center">
                <i className="fa-solid fa-truck-fast me-2 text-warning"></i>
                Add <strong>₹{differenceToFreeShipping}</strong> more to unlock <strong>Free Shipping</strong>!
              </div>
            ) : (
              <div className="alert alert-success border-0 shadow-sm p-3 mb-4 rounded-3 small text-center">
                <i className="fa-solid fa-circle-check me-2 text-success"></i>
                Congratulations! You qualified for <strong>Free Shipping</strong>.
              </div>
            )}

            <div className="card shadow-sm border-light rounded-3 p-4 bg-white sticky-top" style={{ top: '90px' }}>
              <h5 className="fw-bold text-dark mb-4">Billing Summary</h5>
              
              <div className="d-flex justify-content-between mb-2 small text-secondary">
                <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.qty, 0)} items)</span>
                <span className="fw-semibold text-dark">₹{itemsPrice.toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-3 small text-secondary">
                <span>Shipping Fee</span>
                <span className="fw-semibold text-dark">
                  {qualifiesForFreeShipping ? <span className="text-success fw-bold">FREE</span> : '₹99.00'}
                </span>
              </div>
              
              <hr className="border-light my-3" />
              
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bold text-dark">Total Price</span>
                <span className="fw-bold text-primary fs-4">
                  ₹{(qualifiesForFreeShipping ? itemsPrice : itemsPrice + 99).toFixed(2)}
                </span>
              </div>

              <button className="btn btn-primary w-100 py-2.5 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2" onClick={handleCheckout}>
                <span>Proceed to Secure Checkout</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>

              <div className="text-center mt-3">
                <Link to="/" className="text-decoration-none text-muted small fw-medium">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
