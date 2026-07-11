import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from '../components/Toast';

const statusBadgeColor = {
  Processing: 'bg-warning-subtle text-warning border border-warning-subtle',
  Shipped: 'bg-info-subtle text-info border border-info-subtle',
  Delivered: 'bg-success-subtle text-success border border-success-subtle',
  Cancelled: 'bg-danger-subtle text-danger border border-danger-subtle',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders')
      .then((res) => setOrders(res.data))
      .catch(() => toast.error('Failed to load order history.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-dark">Order History</h2>
      
      {orders.length === 0 ? (
        <div className="card text-center p-5 border-light shadow-sm bg-white rounded-3">
          <i className="fa-solid fa-box-open text-muted display-4 mb-3"></i>
          <h4 className="fw-bold text-secondary">No orders found</h4>
          <p className="text-muted mb-4 small">You haven't placed any orders with us yet.</p>
          <Link to="/" className="btn btn-primary px-4 py-2 fw-semibold shadow-sm">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div key={order._id} className="card shadow-sm border-light rounded-3 bg-white overflow-hidden">
              <div className="card-header bg-light border-bottom border-light px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex gap-4">
                  <div>
                    <span className="text-muted small d-block">ORDER PLACED</span>
                    <span className="fw-semibold text-dark small">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-muted small d-block">TOTAL VALUE</span>
                    <span className="fw-bold text-dark small">₹{order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted small d-block">ORDER REF</span>
                    <span className="fw-semibold text-dark small">#{order._id.toUpperCase()}</span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge px-3 py-2 rounded-pill fw-semibold ${statusBadgeColor[order.status] || 'bg-light text-secondary'}`}>
                    {order.status}
                  </span>
                  <Link to={`/order-confirmation/${order._id}`} className="btn btn-outline-primary btn-sm px-3 py-1.5 fw-semibold rounded no-print">
                    <i className="fa-solid fa-file-invoice me-1"></i> Invoice Details
                  </Link>
                </div>
              </div>
              
              <div className="card-body p-4">
                <div className="d-flex flex-column gap-3">
                  {order.items.map((item) => (
                    <div key={item.product} className="d-flex align-items-center justify-content-between pb-3 border-bottom border-light last-border-none">
                      <div className="d-flex align-items-center gap-3">
                        <div className="p-1 border border-light rounded bg-light" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                        <div>
                          <strong className="text-dark small d-block">{item.name}</strong>
                          <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Qty: {item.qty} @ ₹{item.price.toFixed(2)} each</span>
                        </div>
                      </div>
                      <span className="fw-bold text-dark small">₹{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
