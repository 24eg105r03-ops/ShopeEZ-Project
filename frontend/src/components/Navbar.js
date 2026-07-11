import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from './Toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <i className="fa-solid fa-bag-shopping fs-4"></i>
          <span>Shop<span className="text-primary">EZ</span></span>
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navContent"
          aria-controls="navContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navContent">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/">
                <i className="fa-solid fa-house-chimney me-1 d-lg-none"></i> Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium position-relative d-flex align-items-center gap-1" to="/cart">
                <i className="fa-solid fa-cart-shopping"></i>
                <span>Cart</span>
                {itemsCount > 0 && (
                  <span className="badge rounded-pill bg-primary ms-1" style={{ fontSize: '0.7rem' }}>{itemsCount}</span>
                )}
              </Link>
            </li>
            {user?.role === 'seller' && (
              <li className="nav-item">
                <Link className="nav-link fw-medium d-flex align-items-center gap-1 text-info" to="/seller/dashboard">
                  <i className="fa-solid fa-chart-line"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
            )}
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle fw-medium d-flex align-items-center gap-1 text-white"
                  href="#!"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fa-solid fa-circle-user fs-5 text-primary"></i>
                  <span>{user.name}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow border-light py-2">
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/profile">
                      <i className="fa-solid fa-user-gear text-secondary"></i>
                      <span>Account Settings</span>
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/orders">
                      <i className="fa-solid fa-box text-secondary"></i>
                      <span>My Orders</span>
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider border-light" /></li>
                  <li>
                    <button
                      className="dropdown-item py-2 d-flex align-items-center gap-2 text-danger"
                      onClick={handleLogout}
                    >
                      <i className="fa-solid fa-right-from-bracket"></i>
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <div className="d-flex align-items-center gap-2 ms-lg-2">
                <li className="nav-item list-unstyled">
                  <Link className="nav-link fw-medium" to="/login">Login</Link>
                </li>
                <li className="nav-item list-unstyled">
                  <Link className="btn btn-primary btn-sm px-3 fw-semibold rounded" to="/register">
                    Sign Up
                  </Link>
                </li>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
