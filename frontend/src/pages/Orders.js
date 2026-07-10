import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const statusColor = {
  Processing: 'warning',
  Shipped: 'info',
  Delivered: 'success',
  Cancelled: 'danger',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders').then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Orders</h2>
      {orders.length === 0 && <p className="text-muted">You haven't placed any orders yet. <Link to="/">Shop now</Link></p>}
      {orders.map((o) => (
        <div key={o._id} className="card shadow-sm mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between flex-wrap">
              <div>
                <strong>Order #{o._id.slice(-8).toUpperCase()}</strong>
                <div className="text-muted small">{new Date(o.createdAt).toLocaleDateString()}</div>
              </div>
              <span className={`badge bg-${statusColor[o.status] || 'secondary'} align-self-start`}>{o.status}</span>
            </div>
            <div className="mt-2">
              {o.items.map((i) => (
                <div key={i.product} className="small text-muted">{i.name} x{i.qty}</div>
              ))}
            </div>
            <div className="fw-bold mt-2">Total: ${o.totalPrice.toFixed(2)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
