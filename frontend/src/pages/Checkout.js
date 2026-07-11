import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { toast } from '../components/Toast';

const Checkout = () => {
  const { cartItems, itemsPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [gatewayProcessing, setGatewayProcessing] = useState(false);
  const [gatewayStep, setGatewayStep] = useState(0);

  // Credit Card Form States
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardFlipped, setCardFlipped] = useState(false);

  const shipping = itemsPrice > 999 ? 0 : 99;
  const total = +(itemsPrice + shipping).toFixed(2);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value).slice(0, 19));
  };

  const handleExpiryChange = (e) => {
    setCardExpiry(formatExpiry(e.target.value).slice(0, 5));
  };

  const handleCvvChange = (e) => {
    setCardCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 3));
  };

  const triggerGatewaySimulation = (orderData) => {
    setGatewayProcessing(true);
    setGatewayStep(0);

    const steps = [
      'BOOTING SECURE GATEWAY ENCRYPTION...',
      'ESTABLISHING 64-BIT CRYPTO HANDSHAKE...',
      'VERIFYING CREDIT LINE BALANCE IN MEMORY...',
      'TRANSACTION AUTHORIZED BY SHOPEZ BANK!',
    ];

    const runSim = (idx) => {
      if (idx < steps.length) {
        setGatewayStep(idx);
        setTimeout(() => runSim(idx + 1), 1000);
      } else {
        clearCart();
        setGatewayProcessing(false);
        toast.success('Transaction Settled Successfully!');
        navigate(`/order-confirmation/${orderData._id}`);
      }
    };

    runSim(0);
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'Credit Card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        return toast.error('Please enter a valid 16-digit card number');
      }
      if (cardExpiry.length < 5) {
        return toast.error('Please enter card expiry (MM/YY)');
      }
      if (cardCvv.length < 3) {
        return toast.error('Please enter a valid 3-digit CVV');
      }
      if (!cardName.trim()) {
        return toast.error("Please enter the cardholder's name");
      }
    }

    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: cartItems.map((i) => ({ productId: i.productId, qty: i.qty })),
        shippingAddress: address,
        paymentMethod,
      });

      if (paymentMethod === 'Credit Card') {
        triggerGatewaySimulation(data);
      } else {
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-info border-0 shadow-sm p-4 rounded-3 d-inline-block">
          <i className="fa-solid fa-cart-shopping fs-3 mb-2 text-primary"></i>
          <h5>Your Bag is Empty</h5>
          <p className="text-muted small">Cannot proceed to checkout with an empty bag.</p>
          <Link to="/" className="btn btn-primary btn-sm fw-semibold px-3">Go Shop Items</Link>
        </div>
      </div>
    );
  }

  // Simulated retro arcade loader
  if (gatewayProcessing) {
    const steps = [
      'BOOTING SECURE GATEWAY ENCRYPTION...',
      'ESTABLISHING 64-BIT CRYPTO HANDSHAKE...',
      'VERIFYING CREDIT LINE BALANCE IN MEMORY...',
      'TRANSACTION AUTHORIZED BY SHOPEZ BANK!',
    ];
    return (
      <div className="container py-5 text-center d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="card shadow-lg border-dark p-5 rounded bg-dark text-success font-mono-retro text-start" style={{ maxWidth: '600px', width: '100%', border: '4px solid var(--success-color)' }}>
          <div className="mb-4 text-center">
            <i className="fa-solid fa-server fa-spin fs-2 text-success mb-2"></i>
            <h4 className="text-success fw-bold">SHOPEZ AUTHORIZATION TERMINAL v1.02</h4>
            <hr style={{ borderColor: 'var(--success-color)' }} />
          </div>
          <div className="d-flex flex-column gap-3 mb-4">
            {steps.map((step, idx) => (
              <div key={idx} className={idx <= gatewayStep ? 'opacity-100' : 'opacity-25'}>
                {idx < gatewayStep ? (
                  <span className="text-success">✔ {step}</span>
                ) : idx === gatewayStep ? (
                  <span className="text-warning font-mono-retro">▶ {step}</span>
                ) : (
                  <span className="text-muted">⚡ {step}</span>
                )}
              </div>
            ))}
          </div>
          <div className="progress bg-secondary border border-dark rounded-0 mb-2" style={{ height: '24px' }}>
            <div
              className="progress-bar progress-bar-striped progress-bar-animated bg-success"
              role="progressbar"
              style={{ width: `${((gatewayStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <p className="small text-muted text-center mt-2 font-mono-retro">DO NOT REFRESH OR CLOSE THE CONSOLE WINDOW</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Checkout header step */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1 text-dark">Checkout Details</h2>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb font-mono-retro small">
            <li className="breadcrumb-item"><Link to="/cart" className="text-decoration-none text-muted">Shopping Bag</Link></li>
            <li className="breadcrumb-item active text-primary fw-bold" aria-current="page">Secure Checkout</li>
          </ol>
        </nav>
      </div>

      <div className="row g-4">
        {/* Shipping details and payment forms */}
        <div className="col-lg-7">
          <form onSubmit={placeOrder} className="d-flex flex-column gap-4">
            <div className="card shadow-sm border-light rounded-3 p-4 bg-white">
              <h5 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                <i className="fa-solid fa-truck text-primary"></i> Shipping Address
              </h5>
              
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Street Address</label>
                <input
                  className="form-control bg-light border-light"
                  placeholder="123 Main St, Apt 4B"
                  required
                  value={address.address}
                  onChange={(e) => setAddress({ ...address, address: e.target.value })}
                />
              </div>
              
              <div className="row g-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-semibold text-secondary">City</label>
                  <input
                    className="form-control bg-light border-light"
                    placeholder="San Francisco"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-semibold text-secondary">Postal Code</label>
                  <input
                    className="form-control bg-light border-light"
                    placeholder="94103"
                    required
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label small fw-semibold text-secondary">Country</label>
                <input
                  className="form-control bg-light border-light"
                  placeholder="United States"
                  required
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                />
              </div>
            </div>

            <div className="card shadow-sm border-light rounded-3 p-4 bg-white">
              <h5 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                <i className="fa-solid fa-credit-card text-primary"></i> Payment Method
              </h5>
              
              <div className="d-flex flex-column gap-2 mb-4">
                {[
                  { id: 'Cash on Delivery', desc: 'Pay with cash upon package receipt', icon: 'fa-money-bill-wave' },
                  { id: 'Credit Card', desc: 'Secure payment via Stripe gateway', icon: 'fa-credit-card' },
                  { id: 'PayPal', desc: 'Pay instantly with your PayPal wallet', icon: 'fa-paypal' }
                ].map((m) => (
                  <label
                    htmlFor={m.id}
                    key={m.id}
                    className={`d-flex align-items-center justify-content-between p-3 border rounded-3 transition-all ${paymentMethod === m.id ? 'border-primary bg-primary-subtle' : 'border-light bg-light-subtle'}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <input
                        className="form-check-input mt-0 border-secondary"
                        type="radio"
                        name="paymentMethod"
                        id={m.id}
                        checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id)}
                      />
                      <div>
                        <span className="fw-bold text-dark d-block small">{m.id}</span>
                        <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{m.desc}</span>
                      </div>
                    </div>
                    <i className={`fa-brands ${m.icon.startsWith('fa-paypal') ? 'fa-paypal text-primary fs-4' : `fa-solid ${m.icon} text-secondary fs-4`}`}></i>
                  </label>
                ))}
              </div>

              {/* Interactive Flipping Credit Card Form */}
              {paymentMethod === 'Credit Card' && (
                <div className="mt-2 pt-3 border-top border-light">
                  <h6 className="fw-bold mb-3 text-secondary font-mono-retro small">Interactive Card Preview</h6>
                  
                  <div className="flip-card-container">
                    <div className={`flip-card-inner ${cardFlipped ? 'flipped' : ''}`}>
                      {/* CARD FRONT */}
                      <div className="card-front">
                        <div className="d-flex justify-content-between align-items-start mb-4">
                          <span className="fw-bold fs-5 tracking-wide">SECURE PLATINUM</span>
                          <i className="fa-brands fa-cc-visa fs-2"></i>
                        </div>
                        <div className="fs-5 mb-3 tracking-widest text-center py-2" style={{ letterSpacing: '4px' }}>
                          {cardNumber || '•••• •••• •••• ••••'}
                        </div>
                        <div className="d-flex justify-content-between mt-2 small font-mono-retro">
                          <div>
                            <span className="text-white-50 d-block" style={{ fontSize: '0.55rem' }}>CARDHOLDER</span>
                            <span className="fw-semibold text-uppercase">{cardName || 'YOUR FULL NAME'}</span>
                          </div>
                          <div className="text-end">
                            <span className="text-white-50 d-block" style={{ fontSize: '0.55rem' }}>VAL THRU</span>
                            <span className="fw-semibold">{cardExpiry || 'MM/YY'}</span>
                          </div>
                        </div>
                      </div>

                      {/* CARD BACK */}
                      <div className="card-back position-relative">
                        <div className="card-magnetic-strip"></div>
                        <div className="card-signature-box font-mono-retro">
                          {cardCvv || '•••'}
                        </div>
                        <div className="position-absolute bottom-0 end-0 p-3 small text-white-50 font-mono-retro" style={{ fontSize: '0.6rem' }}>
                          NOT VALID WITHOUT SIGNATURE
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-secondary">Card Number</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        onFocus={() => setCardFlipped(false)}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-secondary">Cardholder Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        onFocus={() => setCardFlipped(false)}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-secondary">Expiration Date</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        onFocus={() => setCardFlipped(false)}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-secondary">CVV Security Code</label>
                      <input
                        className="form-control"
                        type="password"
                        placeholder="123"
                        value={cardCvv}
                        onChange={handleCvvChange}
                        onFocus={() => setCardFlipped(true)}
                        onBlur={() => setCardFlipped(false)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="btn btn-primary w-100 py-3 fw-bold rounded shadow d-flex align-items-center justify-content-center gap-2" type="submit" disabled={loading}>
              <i className="fa-solid fa-shield-halved"></i>
              <span>{loading ? 'Securing Transaction...' : `Pay & Place Order - ₹${total.toFixed(2)}`}</span>
            </button>
          </form>
        </div>

        {/* Order details review card */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-light rounded-3 p-4 bg-white sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold text-dark mb-4">Review Order</h5>
            <div className="d-flex flex-column gap-3 mb-4" style={{ maxHeight: '240px', overflowY: 'auto' }}>
              {cartItems.map((item) => (
                <div key={item.productId} className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <img src={item.image} alt={item.name} className="rounded border border-light" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
                    <div>
                      <span className="fw-semibold text-dark d-block small text-truncate" style={{ maxWidth: '180px' }}>{item.name}</span>
                      <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Qty: {item.qty}</span>
                    </div>
                  </div>
                  <span className="fw-bold text-dark small">₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <hr className="border-light my-3" />
            
            <div className="d-flex justify-content-between mb-2 small text-secondary">
              <span>Subtotal:</span>
              <span className="fw-semibold text-dark">₹{itemsPrice.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 small text-secondary">
              <span>Shipping Fee:</span>
              <span className="fw-semibold text-dark">
                {shipping === 0 ? <span className="text-success fw-bold">FREE</span> : `₹${shipping.toFixed(2)}`}
              </span>
            </div>
            
            <hr className="border-light my-3" />
            
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold text-dark">Grand Total:</span>
              <span className="fw-bold text-primary fs-4">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
