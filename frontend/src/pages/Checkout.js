import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, itemsPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shipping = itemsPrice > 50 ? 0 : 5.99;
  const total = +(itemsPrice + shipping).toFixed(2);

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/orders', {
        items: cartItems.map((i) => ({ productId: i.productId, qty: i.qty })),
        shippingAddress: address,
        paymentMethod,
      });
      clearCart();
      navigate(`/order-confirmation/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <div className="container py-4"><div className="alert alert-info">Your cart is empty.</div></div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Checkout</h2>
      <div className="row">
        <div className="col-md-7">
          <form onSubmit={placeOrder}>
            <h5>Shipping Address</h5>
            <div className="mb-2">
              <input className="form-control" placeholder="Street Address" required
                value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} />
            </div>
            <div className="row">
              <div className="col-6 mb-2">
                <input className="form-control" placeholder="City" required
                  value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              </div>
              <div className="col-6 mb-2">
                <input className="form-control" placeholder="Postal Code" required
                  value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
              </div>
            </div>
            <div className="mb-3">
              <input className="form-control" placeholder="Country" required
                value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
            </div>

            <h5>Payment Method</h5>
            <div className="mb-3">
              {['Cash on Delivery', 'Credit Card', 'PayPal'].map((m) => (
                <div className="form-check" key={m}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id={m}
                    checked={paymentMethod === m}
                    onChange={() => setPaymentMethod(m)}
                  />
                  <label className="form-check-label" htmlFor={m}>{m}</label>
                </div>
              ))}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
            </button>
          </form>
        </div>
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Order Summary</h5>
              {cartItems.map((i) => (
                <div key={i.productId} className="d-flex justify-content-between small mb-1">
                  <span>{i.name} x{i.qty}</span>
                  <span>${(i.price * i.qty).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <span>Subtotal</span><span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
