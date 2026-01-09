// src/screens/ProfilePage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Shield, ChevronLeft } from 'lucide-react';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('calvio_user_email');
  const userData = localStorage.getItem('calvio_user');
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    if (!userEmail) {
      navigate('/');
    }
  }, [userEmail, navigate]);

  const joinDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown';

  return (
    <div className="profile-page">
      <button className="back-btn" onClick={() => navigate('/')}>
        <ChevronLeft size={20} /> Back to Home
      </button>

      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar">
            <User size={48} />
          </div>
          <h1>My Profile</h1>
          <p className="profile-subtitle">Manage your account information</p>
        </div>

        <div className="profile-card">
          <div className="profile-section">
            <h2>Account Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <Mail size={20} />
                </div>
                <div className="info-content">
                  <label>Email Address</label>
                  <p>{userEmail}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <User size={20} />
                </div>
                <div className="info-content">
                  <label>Full Name</label>
                  <p>{user?.fullName || 'Not provided'}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Calendar size={20} />
                </div>
                <div className="info-content">
                  <label>Member Since</label>
                  <p>{joinDate}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Shield size={20} />
                </div>
                <div className="info-content">
                  <label>Account Status</label>
                  <p className="status-verified">✓ Verified</p>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button
              className="action-btn primary"
              onClick={() => navigate('/my-orders')}
            >
              View My Orders
            </button>
            <button
              className="action-btn secondary"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}