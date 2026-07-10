import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, updateQty, removeFromCart, itemsPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate(user ? '/checkout' : '/login?redirect=/checkout');
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty. <Link to="/">Continue shopping</Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            {cartItems.map((item) => (
              <div key={item.productId} className="d-flex align-items-center border-bottom py-3">
                <img src={item.image} alt={item.name} style={{ width: 70, height: 70, objectFit: 'contain' }} />
                <div className="ms-3 flex-grow-1">
                  <Link to={`/product/${item.productId}`} className="text-decoration-none text-dark fw-semibold">
                    {item.name}
                  </Link>
                  <div className="text-muted small">${item.price.toFixed(2)} each</div>
                </div>
                <select
                  className="form-select w-auto me-3"
                  value={item.qty}
                  onChange={(e) => updateQty(item.productId, Number(e.target.value))}
                >
                  {Array.from({ length: Math.min(item.countInStock || 10, 10) }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <div className="fw-semibold me-3">${(item.price * item.qty).toFixed(2)}</div>
                <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.productId)}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5>Order Summary</h5>
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span>${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between text-muted small">
                  <span>Shipping</span>
                  <span>{itemsPrice > 50 ? 'Free' : '$5.99'}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>${(itemsPrice > 50 ? itemsPrice : itemsPrice + 5.99).toFixed(2)}</span>
                </div>
                <button className="btn btn-primary w-100 mt-3" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
