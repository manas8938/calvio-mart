// src/screens/MyOrders.jsx - COMPLETE & UPDATED
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, ShoppingBag, Loader } from 'lucide-react';
import { getUserOrders } from '../api/api';
import toast from 'react-hot-toast';
import './MyOrders.css';

const BACKEND_BASE = 'http://localhost:3000';

function normalizeImage(src) {
  if (!src) return 'https://via.placeholder.com/60';
  if (src.startsWith('http')) return src;
  if (src.startsWith('/')) return `${BACKEND_BASE}${src}`;
  if (src.startsWith('uploads')) return `${BACKEND_BASE}/${src}`;
  return src;
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('calvio_user_email');

  useEffect(() => {
    if (!userEmail) {
      toast.error('Please login to view orders');
      navigate('/');
      return;
    }
    fetchOrders();
  }, [userEmail, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getUserOrders(userEmail);
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const statusMap = {
      PENDING: 'status-pending',
      EMAIL_VERIFIED: 'status-verified',
      WHATSAPP_CONFIRMED: 'status-confirmed',
      CONFIRMED: 'status-confirmed',
      SHIPPED: 'status-shipped',
      DELIVERED: 'status-delivered',
      CANCELLED: 'status-cancelled',
    };
    return statusMap[status] || 'status-pending';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="loading-container">
          <Loader size={48} className="animate-spin text-indigo-600" />
          <p style={{ marginTop: '20px', fontSize: '18px', color: '#64748b' }}>
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <button className="back-btn" onClick={() => navigate('/')}>
        <ChevronLeft size={20} /> Back to Home
      </button>

      <div className="orders-container">
        <div className="orders-header">
          <Package size={36} className="header-icon" />
          <div>
            <h1>My Orders</h1>
            <p>Track and manage your orders</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <ShoppingBag size={64} className="empty-icon" />
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders yet.</p>
            <button className="shop-btn" onClick={() => navigate('/')}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <span className="order-id">Order #{order.id.toString().padStart(6, '0')}</span>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <span className={`order-status ${getStatusClass(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="order-items">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="order-item">
                      <img
                        src={normalizeImage(item.image)}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/60';
                        }}
                      />
                      <div className="item-details">
                        <h3 className="item-title">{item.title}</h3>
                        <p className="item-qty">Quantity: {item.quantity}</p>
                      </div>
                      <span className="item-price">${item.price}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="more-items">
                      +{order.items.length - 3} more item(s)
                    </div>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total Amount</span>
                    <strong>${order.totalAmount}</strong>
                  </div>
                  <button
                    className="view-details-btn"
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}