// src/screens/OrderSuccess.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Home } from "lucide-react";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get real data from navigation state
  const { orderId, email } = location.state || {};

  // Format order ID
  const formattedOrderId = orderId
    ? `ORD-${orderId.toString().padStart(6, "0")}`
    : "N/A";

  return (
    <div className="order-success-page">
      <div className="success-card">
        <CheckCircle size={80} color="#10b981" />

        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. We're preparing your order for shipment.</p>

        <div className="order-details">
          <div className="detail-row">
            <span>Order ID</span>
            <strong>{formattedOrderId}</strong>
          </div>

          <div className="detail-row">
            <span>Email</span>
            <strong>{email || "N/A"}</strong>
          </div>

          <div className="detail-row">
            <span>Estimated Delivery</span>
            <strong>3-5 Business Days</strong>
          </div>
        </div>

        <button className="back-home-btn" onClick={() => navigate("/")}>
          <Home size={20} /> Back to Home
        </button>

        <button
          className="track-order-btn"
          onClick={() => navigate(`/track-order/${orderId}`)}
          disabled={!orderId}
        >
          Track Order
        </button>

        <p className="email-note">
          A confirmation email has been sent to {email || "your inbox"}.
        </p>
      </div>
    </div>
  );
}
