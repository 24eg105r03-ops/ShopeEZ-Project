import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { toast } from '../components/Toast';

const emptyForm = { name: '', description: '', image: '', category: '', price: '', discountPercent: 0, countInStock: '' };

const SellerDashboard = () => {
  const [tab, setTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search filters inside the tables
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [a, p, o] = await Promise.all([
        api.get('/seller/analytics'),
        api.get('/seller/products'),
        api.get('/seller/orders'),
      ]);
      setAnalytics(a.data);
      setProducts(p.data);
      setOrders(o.data);
    } catch (err) {
      toast.error('Failed to load dashboard data. Are you logged in?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const submitProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPercent: Number(form.discountPercent),
        countInStock: Number(form.countInStock),
        image: form.image || undefined,
      };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', payload);
        toast.success('Product added successfully!');
      }
      setForm(emptyForm);
      setEditingId(null);
      setTab('products');
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    }
  };

  const editProduct = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description,
      image: p.image,
      category: p.category,
      price: p.price,
      discountPercent: p.discountPercent,
      countInStock: p.countInStock,
    });
    setTab('add');
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product removed.');
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting product');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/seller/orders/${id}/status`, { status });
      toast.success(`Order status updated to "${status}"`);
      loadAll();
    } catch (err) {
      toast.error('Error changing order status');
    }
  };

  // Filter lists based on search bars
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) =>
    o._id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    (o.user?.name || '').toLowerCase().includes(orderSearch.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-success-subtle text-success border border-success-subtle';
      case 'Shipped':
        return 'bg-info-subtle text-info border border-info-subtle';
      case 'Processing':
        return 'bg-warning-subtle text-warning border border-warning-subtle';
      case 'Cancelled':
        return 'bg-danger-subtle text-danger border border-danger-subtle';
      default:
        return 'bg-secondary-subtle text-secondary border border-secondary-subtle';
    }
  };

  if (loading && !analytics) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Dashboard Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <div>
          <h1 className="fw-bold mb-1 text-dark">Seller Operations Console</h1>
          <p className="text-muted mb-0">Monitor catalog items, process buyer orders, and view sales performance metrics.</p>
        </div>
        <button className="btn btn-outline-primary fw-semibold d-flex align-items-center gap-2" onClick={loadAll}>
          <i className="fa-solid fa-arrows-rotate"></i> Refresh Dashboard
        </button>
      </div>

      {/* Tabs Menu Nav */}
      <ul className="nav nav-pills mb-5 bg-light p-1.5 rounded-3 d-inline-flex gap-1" style={{ border: '1px solid var(--border-light)' }}>
        {[
          { id: 'overview', label: 'Overview Metrics', icon: 'fa-chart-line' },
          { id: 'products', label: 'My Products', icon: 'fa-tags' },
          { id: 'orders', label: 'Incoming Orders', icon: 'fa-dolly' },
          { id: 'add', label: editingId ? 'Edit Product' : 'Add Product', icon: editingId ? 'fa-pen-to-square' : 'fa-circle-plus' }
        ].map((t) => (
          <li className="nav-item" key={t.id}>
            <button
              className={`nav-link fw-semibold px-4 py-2 d-flex align-items-center gap-2 border-0 rounded-3 ${tab === t.id ? 'active btn-primary text-white shadow-sm' : 'text-secondary'}`}
              onClick={() => setTab(t.id)}
            >
              <i className={`fa-solid ${t.icon}`}></i> {t.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Overview Analytics Page */}
      {tab === 'overview' && analytics && (
        <div>
          {/* Main KPI Stat Cards */}
          <div className="row g-4 mb-5">
            <div className="col-sm-6 col-lg-3">
              <div className="card stat-card p-3 h-100 border-light">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-wrapper stat-icon-purple">
                    <i className="fa-solid fa-cubes"></i>
                  </div>
                  <div>
                    <h6 className="text-muted small fw-semibold mb-1">Total Products</h6>
                    <h3 className="fw-bold mb-0 text-dark">{analytics.totalProducts}</h3>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-sm-6 col-lg-3">
              <div className="card stat-card p-3 h-100 border-light">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-wrapper stat-icon-blue">
                    <i className="fa-solid fa-receipt"></i>
                  </div>
                  <div>
                    <h6 className="text-muted small fw-semibold mb-1">Orders Received</h6>
                    <h3 className="fw-bold mb-0 text-dark">{analytics.totalOrders}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card stat-card p-3 h-100 border-light">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-wrapper stat-icon-green">
                    <i className="fa-solid fa-indian-rupee-sign"></i>
                  </div>
                  <div>
                    <h6 className="text-muted small fw-semibold mb-1">Total Revenue</h6>
                    <h3 className="fw-bold mb-0 text-dark">₹{analytics.totalRevenue.toFixed(2)}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card stat-card p-3 h-100 border-light">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-wrapper stat-icon-orange">
                    <i className="fa-solid fa-truck-ramp-box"></i>
                  </div>
                  <div>
                    <h6 className="text-muted small fw-semibold mb-1">Units Shipped</h6>
                    <h3 className="fw-bold mb-0 text-dark">{analytics.totalUnitsSold}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Visual breakdown lists */}
            <div className="col-md-6">
              <div className="card shadow-sm border-light rounded-3 p-4 h-100">
                <h5 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                  <i className="fa-solid fa-ranking-star text-primary"></i> Sales Distribution
                </h5>
                {Object.keys(analytics.salesByProduct).length === 0 ? (
                  <p className="text-muted small py-4 text-center">No units have been purchased yet.</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {Object.entries(analytics.salesByProduct).map(([name, qty]) => {
                      const percentage = Math.min(100, (qty / (analytics.totalUnitsSold || 1)) * 100);
                      return (
                        <div key={name}>
                          <div className="d-flex justify-content-between text-dark small fw-semibold mb-1">
                            <span>{name}</span>
                            <span>{qty} sold</span>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${percentage}%` }} aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm border-light rounded-3 p-4 h-100">
                <h5 className="fw-bold mb-4 text-danger d-flex align-items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation"></i> Stock Alerts
                </h5>
                {analytics.lowStock.length === 0 ? (
                  <div className="text-center py-4 text-success small">
                    <i className="fa-regular fa-circle-check fs-3 mb-2"></i>
                    <p className="mb-0 fw-semibold">All products are adequately stocked.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {analytics.lowStock.map((p) => (
                      <div key={p.name} className="d-flex justify-content-between align-items-center border-bottom border-light pb-2 text-danger small">
                        <span className="fw-medium">{p.name}</span>
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle fw-bold">
                          {p.countInStock} Left
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Catalog Manager Table */}
      {tab === 'products' && (
        <div className="card shadow-sm border-light rounded-3 p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <h5 className="fw-bold mb-0 text-dark">Manage Catalog Items</h5>
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <span className="input-group-text bg-light border-end-0 text-muted"><i className="fa-solid fa-magnifying-glass"></i></span>
              <input
                className="form-control border-start-0 ps-0 bg-light"
                placeholder="Filter items..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary small fw-bold">
                <tr>
                  <th>Display</th>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th className="text-end">Base Price</th>
                  <th className="text-center">Stock</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="small">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No items found matching criteria.</td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <img src={p.image} alt={p.name} className="rounded border border-light" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
                      </td>
                      <td>
                        <span className="fw-bold text-dark d-block">{p.name}</span>
                        {p.discountPercent > 0 && (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle" style={{ fontSize: '0.65rem' }}>
                            -{p.discountPercent}% Off
                          </span>
                        )}
                      </td>
                      <td>{p.category}</td>
                      <td className="text-end fw-bold text-dark">₹{p.price.toFixed(2)}</td>
                      <td className="text-center">
                        <span className={`badge ${p.countInStock <= 5 ? 'bg-danger-subtle text-danger border border-danger-subtle' : 'bg-light text-secondary border border-light'}`}>
                          {p.countInStock} units
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <button className="btn btn-sm btn-outline-primary border-0" onClick={() => editProduct(p)} title="Edit Details">
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger border-0" onClick={() => deleteProduct(p._id)} title="Delete Item">
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Manager Table */}
      {tab === 'orders' && (
        <div className="card shadow-sm border-light rounded-3 p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <h5 className="fw-bold mb-0 text-dark">Incoming Orders</h5>
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <span className="input-group-text bg-light border-end-0 text-muted"><i className="fa-solid fa-magnifying-glass"></i></span>
              <input
                className="form-control border-start-0 ps-0 bg-light"
                placeholder="Search Order ID / Buyer..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary small fw-bold">
                <tr>
                  <th>Order Ref</th>
                  <th>Customer</th>
                  <th>Billing Total</th>
                  <th className="text-center">Status</th>
                  <th>Actions Manager</th>
                </tr>
              </thead>
              <tbody className="small">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">No orders matching query.</td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o._id}>
                      <td className="fw-bold text-dark">{o._id.slice(-8).toUpperCase()}</td>
                      <td>
                        <span className="d-block text-dark fw-semibold">{o.user?.name}</span>
                        <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>{o.user?.email}</span>
                      </td>
                      <td className="fw-bold text-dark">₹{o.totalPrice.toFixed(2)}</td>
                      <td className="text-center">
                        <span className={`badge px-2 py-1.5 rounded-pill ${getStatusBadge(o.status)}`}>
                          {o.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm bg-light text-dark fw-semibold rounded"
                          style={{ maxWidth: '140px' }}
                          value={o.status}
                          onChange={(e) => updateStatus(o._id, e.target.value)}
                        >
                          {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Form */}
      {tab === 'add' && (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-light rounded-3 p-4">
              <h5 className="fw-bold mb-4 text-dark">
                {editingId ? `Update Catalog Details: ${form.name}` : 'Introduce a New Catalog Item'}
              </h5>
              
              <form onSubmit={submitProduct}>
                <div className="row g-3">
                  <div className="col-md-6 mb-2">
                    <label className="form-label small fw-semibold text-secondary">Product Name</label>
                    <input className="form-control bg-light" placeholder="e.g. Mechanical Keyboard" required
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>

                  <div className="col-md-6 mb-2">
                    <label className="form-label small fw-semibold text-secondary">Category</label>
                    <input className="form-control bg-light" placeholder="e.g. Electronics, Office" required
                      value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                  </div>

                  <div className="col-12 mb-2">
                    <label className="form-label small fw-semibold text-secondary">Product Description</label>
                    <textarea className="form-control bg-light" rows="3" placeholder="Describe product details, specs, package dimensions..." required
                      value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>

                  <div className="col-md-8 mb-2">
                    <label className="form-label small fw-semibold text-secondary">Image URL Link</label>
                    <input className="form-control bg-light" placeholder="e.g. https://placehold.co/400x400"
                      value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                  </div>

                  {form.image && (
                    <div className="col-md-4 mb-2 d-flex align-items-center justify-content-center">
                      <div className="p-2 border border-light rounded bg-white">
                        <img src={form.image} alt="Preview" style={{ maxHeight: '60px', objectFit: 'contain' }}
                          onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=Invalid+URL'; }} />
                      </div>
                    </div>
                  )}

                  <div className="col-md-4 mb-2">
                    <label className="form-label small fw-semibold text-secondary">Unit Price (₹)</label>
                    <input type="number" step="0.01" className="form-control bg-light" placeholder="0.00" required
                      value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  </div>

                  <div className="col-md-4 mb-2">
                    <label className="form-label small fw-semibold text-secondary">Discount Percentage (%)</label>
                    <input type="number" className="form-control bg-light" placeholder="0" min="0" max="90"
                      value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} />
                  </div>

                  <div className="col-md-4 mb-4">
                    <label className="form-label small fw-semibold text-secondary">Initial Stock Count</label>
                    <input type="number" className="form-control bg-light" placeholder="Quantity" required
                      value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} />
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-primary px-4 py-2 fw-semibold" type="submit">
                    {editingId ? 'Update Product Details' : 'Add Item to Catalog'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-link text-muted text-decoration-none fw-medium"
                      onClick={() => { setEditingId(null); setForm(emptyForm); setTab('products'); }}>
                      Cancel Customization
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
