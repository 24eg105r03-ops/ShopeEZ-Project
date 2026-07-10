import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data)).catch(() => setError('Order not found'));
  }, [id]);

  if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;
  if (!order) return <div className="container py-5 text-center"><div className="spinner-border text-primary" /></div>;

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <i className="fa-solid fa-circle-check text-success" style={{ fontSize: 60 }}></i>
        <h2 className="mt-3">Order Placed Successfully!</h2>
        <p className="text-muted">Order ID: {order._id}</p>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h5>Items</h5>
          {order.items.map((i) => (
            <div key={i.product} className="d-flex justify-content-between border-bottom py-2">
              <span>{i.name} x{i.qty}</span>
              <span>${(i.price * i.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="d-flex justify-content-between mt-2">
            <span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice.toFixed(2)}`}</span>
          </div>
          <div className="d-flex justify-content-between fw-bold fs-5">
            <span>Total</span><span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h5>Shipping Address</h5>
          <p className="mb-0">
            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link to="/" className="btn btn-primary">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
