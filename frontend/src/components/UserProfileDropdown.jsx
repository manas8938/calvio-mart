// src/components/UserProfileDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, LogOut, Mail } from 'lucide-react';
import './UserProfileDropdown.css';

export default function UserProfileDropdown({ userEmail }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserIconClick = () => {
    if (userEmail) {
      setIsOpen(!isOpen);
    } else {
      setShowEmailModal(true);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem('calvio_user_email', email.trim().toLowerCase());
      setShowEmailModal(false);
      navigate('/verify-otp', { state: { email: email.trim().toLowerCase() } });
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('calvio_user_email');
    localStorage.removeItem('calvio_token');
    localStorage.removeItem('calvio_user');
    setIsOpen(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <div className="user-profile-dropdown" ref={dropdownRef}>
        <button
          className="user-icon"
          onClick={handleUserIconClick}
          aria-label="User menu"
          title={userEmail || 'Login'}
        >
          <User size={24} />
        </button>

        {isOpen && userEmail && (
          <div className="dropdown-menu">
            <div className="dropdown-header">
              <span className="user-email">{userEmail}</span>
            </div>
            <button
              className="dropdown-item"
              onClick={() => {
                navigate('/profile');
                setIsOpen(false);
              }}
            >
              <User size={18} />
              My Profile
            </button>
            <button
              className="dropdown-item"
              onClick={() => {
                navigate('/my-orders');
                setIsOpen(false);
              }}
            >
              <Package size={18} />
              Recent Orders
            </button>
            <button className="dropdown-item signout" onClick={handleSignOut}>
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        )}
      </div>

      {showEmailModal && (
        <div className="email-modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="email-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <Mail size={48} />
            </div>
            <h2>Enter Your Email</h2>
            <p>We'll send you a verification code</p>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoFocus
              />
              <button type="submit" className="submit-btn">
                Send Verification Code
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowEmailModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}