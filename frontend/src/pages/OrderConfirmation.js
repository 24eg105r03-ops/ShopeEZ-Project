import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from '../components/Toast';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => {
        setError('Order not found');
        toast.error('Failed to load order details');
      });
  }, [id]);

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger border-0 shadow-sm p-4 rounded-3 d-inline-block">
          <i className="fa-solid fa-circle-exclamation fs-3 mb-2 text-danger"></i>
          <h5>Order Query Failed</h5>
          <p className="text-muted">{error}</p>
          <Link to="/" className="btn btn-primary btn-sm fw-semibold">Back to Shopping</Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading invoice...</span>
        </div>
      </div>
    );
  }

  // Get active timeline index based on status
  const getTimelineStepIndex = (status) => {
    switch (status) {
      case 'Processing':
        return 1;
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      case 'Cancelled':
        return -1;
      default:
        return 0; // Placed
    }
  };

  const currentStep = getTimelineStepIndex(order.status);

  return (
    <div className="container py-5">
      {/* Success Hero Header (hidden on print) */}
      <div className="text-center mb-5 no-print">
        <div className="display-4 text-success mb-2">
          <i className="fa-solid fa-circle-check"></i>
        </div>
        <h2 className="fw-bold text-dark">Order Confirmed!</h2>
        <p className="text-muted">Thank you for shopping with us. We have received your order details.</p>
      </div>

      {/* Progress Timeline Track (hidden on print) */}
      {order.status !== 'Cancelled' ? (
        <div className="card shadow-sm border-light rounded-3 p-4 mb-5 no-print">
          <h6 className="fw-bold text-secondary text-uppercase mb-3 small tracking-wider">Delivery Tracker</h6>
          <div className="timeline-track">
            {[
              { label: 'Order Placed', icon: 'fa-file-invoice-dollar' },
              { label: 'Processing', icon: 'fa-gear' },
              { label: 'Shipped', icon: 'fa-truck' },
              { label: 'Delivered', icon: 'fa-house-circle-check' }
            ].map((step, index) => {
              let stepClass = '';
              if (index < currentStep) stepClass = 'completed';
              else if (index === currentStep) stepClass = 'active';
              return (
                <div key={index} className={`timeline-step ${stepClass}`}>
                  <div className="timeline-bubble">
                    <i className={`fa-solid ${step.icon}`}></i>
                  </div>
                  <span className="small fw-semibold d-none d-md-block text-dark">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="alert alert-danger border-0 shadow-sm p-3 mb-5 no-print text-center rounded-3">
          <i className="fa-solid fa-ban me-2"></i> This order has been cancelled by the seller.
        </div>
      )}

      {/* Main Invoice Card (styled for printing) */}
      <div className="card shadow border-light rounded-3 overflow-hidden p-4 p-md-5 bg-white">
        {/* Invoice Header */}
        <div className="d-flex justify-content-between align-items-start border-bottom border-light pb-4 mb-4">
          <div>
            <h3 className="fw-bold text-primary mb-1">ShopEZ Invoice</h3>
            <span className="text-muted small">Ref: {order._id.toUpperCase()}</span>
            <div className="small text-muted mt-2">
              <strong>Invoice Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="text-end">
            <h5 className="fw-bold mb-0">ShopEZ Corp</h5>
            <span className="text-muted small d-block">100 E-Commerce Way</span>
            <span className="text-muted small d-block">San Francisco, CA 94103</span>
            <span className="text-muted small d-block">support@shopez.com</span>
          </div>
        </div>

        {/* Invoice Info Grid */}
        <div className="row g-4 mb-4">
          <div className="col-sm-6">
            <h6 className="fw-bold text-secondary text-uppercase small mb-2">Ship To</h6>
            <div className="small text-dark">
              <strong className="d-block mb-1">{order.user?.name}</strong>
              <span className="d-block">{order.shippingAddress.address}</span>
              <span className="d-block">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</span>
              <span className="d-block">{order.shippingAddress.country}</span>
              <span className="text-muted d-block mt-1">{order.user?.email}</span>
            </div>
          </div>
          
          <div className="col-sm-6 text-sm-end">
            <h6 className="fw-bold text-secondary text-uppercase small mb-2">Billing Details</h6>
            <div className="small text-dark">
              <span className="d-block"><strong>Payment Method:</strong> {order.paymentMethod}</span>
              <span className="d-block"><strong>Payment Status:</strong> {order.isPaid ? 'Paid in Full' : 'Pending COD Payment'}</span>
              {order.paidAt && (
                <span className="d-block text-muted"><strong>Settled:</strong> {new Date(order.paidAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="table-responsive mb-4">
          <table className="table align-middle">
            <thead className="table-light">
              <tr className="small text-secondary fw-bold">
                <th>Product Description</th>
                <th className="text-center">Rate</th>
                <th className="text-center">Qty</th>
                <th className="text-end">Line Total</th>
              </tr>
            </thead>
            <tbody className="small">
              {order.items.map((item) => (
                <tr key={item.product}>
                  <td>
                    <span className="fw-bold text-dark d-block">{item.name}</span>
                    <span className="text-muted small">ID: {item.product}</span>
                  </td>
                  <td className="text-center">₹{item.price.toFixed(2)}</td>
                  <td className="text-center">{item.qty}</td>
                  <td className="text-end fw-bold text-dark">₹{(item.price * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Details */}
        <div className="row justify-content-end">
          <div className="col-md-5 col-lg-4 text-end">
            <div className="d-flex justify-content-between py-1 small">
              <span className="text-muted">Subtotal:</span>
              <span className="fw-semibold text-dark">₹{order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between py-1 small">
              <span className="text-muted">Shipping & Handling:</span>
              <span className="fw-semibold text-dark">
                {order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice.toFixed(2)}`}
              </span>
            </div>
            <hr className="my-2 border-light" />
            <div className="d-flex justify-content-between align-items-center py-1">
              <span className="fw-bold text-dark">Invoice Total:</span>
              <span className="fw-bold text-primary fs-4">₹{order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Invoice Footer Disclaimer */}
        <div className="border-top border-light pt-4 mt-5 text-center text-muted small">
          <p className="mb-1">Thank you for your business. For refunds, returns, or support, please email support@shopez.com.</p>
          <span className="text-muted" style={{ fontSize: '0.7rem' }}>ShopEZ platform © 2026. All rights reserved.</span>
        </div>
      </div>

      {/* Action triggers (hidden on print) */}
      <div className="d-flex justify-content-center gap-3 mt-4 no-print">
        <Link to="/" className="btn btn-outline-secondary fw-semibold px-4 py-2 rounded">
          <i className="fa-solid fa-chevron-left me-1"></i> Shop Catalog
        </Link>
        <button className="btn btn-primary fw-semibold px-4 py-2 rounded d-flex align-items-center gap-2" onClick={() => window.print()}>
          <i className="fa-solid fa-print"></i> Print Invoice
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
