import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }
    if (password && password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    
    setLoading(true);
    try {
      await updateProfile(name, email, password || undefined);
      toast.success("Profile updated successfully!");
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow border-light rounded-3 overflow-hidden">
            <div className="card-header bg-primary bg-gradient text-white py-3 text-center border-0">
              <i className="fa-solid fa-circle-user fs-1 mb-2"></i>
              <h4 className="mb-0 fw-bold">My Account Settings</h4>
              <p className="small text-white-50 mb-0">Role: <span className="text-capitalize fw-semibold">{user?.role}</span></p>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><i className="fa-solid fa-user"></i></span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0 bg-light"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><i className="fa-solid fa-envelope"></i></span>
                    <input
                      type="email"
                      className="form-control border-start-0 ps-0 bg-light"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <hr className="my-4 border-light" />
                <p className="text-muted small mb-3">Leave password fields blank if you don't want to change it.</p>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary">New Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><i className="fa-solid fa-lock"></i></span>
                    <input
                      type="password"
                      className="form-control border-start-0 ps-0 bg-light"
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary">Confirm New Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><i className="fa-solid fa-lock"></i></span>
                    <input
                      type="password"
                      className="form-control border-start-0 ps-0 bg-light"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-semibold rounded shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving Changes...
                    </>
                  ) : (
                    "Save Profile Settings"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
