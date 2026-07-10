import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = { name: '', description: '', image: '', category: '', price: '', discountPercent: 0, countInStock: '' };

const SellerDashboard = () => {
  const [tab, setTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  const loadAll = async () => {
    const [a, p, o] = await Promise.all([
      api.get('/seller/analytics'),
      api.get('/seller/products'),
      api.get('/seller/orders'),
    ]);
    setAnalytics(a.data);
    setProducts(p.data);
    setOrders(o.data);
  };

  useEffect(() => { loadAll(); }, []);

  const submitProduct = async (e) => {
    e.preventDefault();
    setMsg('');
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
        setMsg('Product updated!');
      } else {
        await api.post('/products', payload);
        setMsg('Product added!');
      }
      setForm(emptyForm);
      setEditingId(null);
      loadAll();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error saving product');
    }
  };

  const editProduct = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name, description: p.description, image: p.image, category: p.category,
      price: p.price, discountPercent: p.discountPercent, countInStock: p.countInStock,
    });
    setTab('add');
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    loadAll();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/seller/orders/${id}/status`, { status });
    loadAll();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Seller Dashboard</h2>

      <ul className="nav nav-tabs mb-4">
        {['overview', 'products', 'orders', 'add'].map((t) => (
          <li className="nav-item" key={t}>
            <button className={`nav-link ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'add' ? (editingId ? 'Edit Product' : 'Add Product') : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {tab === 'overview' && analytics && (
        <div className="row g-3">
          <div className="col-md-3">
            <div className="card text-center shadow-sm"><div className="card-body">
              <h6 className="text-muted">Total Products</h6><h3>{analytics.totalProducts}</h3>
            </div></div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm"><div className="card-body">
              <h6 className="text-muted">Total Orders</h6><h3>{analytics.totalOrders}</h3>
            </div></div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm"><div className="card-body">
              <h6 className="text-muted">Revenue</h6><h3>${analytics.totalRevenue.toFixed(2)}</h3>
            </div></div>
          </div>
          <div className="col-md-3">
            <div className="card text-center shadow-sm"><div className="card-body">
              <h6 className="text-muted">Units Sold</h6><h3>{analytics.totalUnitsSold}</h3>
            </div></div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm"><div className="card-body">
              <h5>Sales by Product</h5>
              {Object.keys(analytics.salesByProduct).length === 0 && <p className="text-muted">No sales yet.</p>}
              {Object.entries(analytics.salesByProduct).map(([name, qty]) => (
                <div key={name} className="d-flex justify-content-between border-bottom py-1">
                  <span>{name}</span><span>{qty} sold</span>
                </div>
              ))}
            </div></div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm"><div className="card-body">
              <h5>Low Stock Alerts</h5>
              {analytics.lowStock.length === 0 && <p className="text-muted">All stocked up.</p>}
              {analytics.lowStock.map((p) => (
                <div key={p.name} className="d-flex justify-content-between border-bottom py-1 text-danger">
                  <span>{p.name}</span><span>{p.countInStock} left</span>
                </div>
              ))}
            </div></div>
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td><img src={p.image} alt={p.name} width="50" /></td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.countInStock}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editProduct(p)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'orders' && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead><tr><th>Order</th><th>Buyer</th><th>Total</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o._id.slice(-8).toUpperCase()}</td>
                  <td>{o.user?.name}</td>
                  <td>${o.totalPrice.toFixed(2)}</td>
                  <td>{o.status}</td>
                  <td>
                    <select className="form-select form-select-sm" value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                      {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'add' && (
        <div className="row">
          <div className="col-md-6">
            <form onSubmit={submitProduct}>
              <div className="mb-2">
                <input className="form-control" placeholder="Product Name" required
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="mb-2">
                <textarea className="form-control" placeholder="Description" required
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="mb-2">
                <input className="form-control" placeholder="Image URL (optional)"
                  value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>
              <div className="mb-2">
                <input className="form-control" placeholder="Category" required
                  value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="row">
                <div className="col-4 mb-2">
                  <input type="number" step="0.01" className="form-control" placeholder="Price" required
                    value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="col-4 mb-2">
                  <input type="number" className="form-control" placeholder="Discount %"
                    value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} />
                </div>
                <div className="col-4 mb-2">
                  <input type="number" className="form-control" placeholder="Stock" required
                    value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} />
                </div>
              </div>
              {msg && <div className="alert alert-info py-2">{msg}</div>}
              <button className="btn btn-primary" type="submit">{editingId ? 'Update Product' : 'Add Product'}</button>
              {editingId && (
                <button type="button" className="btn btn-link" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
