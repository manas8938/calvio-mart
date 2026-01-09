// src/screens/Checkout.jsx - UPDATED
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder, sendOtp } from "../api/api";
import toast from "react-hot-toast";
import "./Checkout.css";

const BACKEND_BASE = "http://localhost:3000";

function normalizeImage(src) {
  if (!src) return "https://via.placeholder.com/100";
  if (typeof src === "string") {
    if (src.startsWith("http")) return src;
    if (src.startsWith("/")) return `${BACKEND_BASE}${src}`;
    if (src.startsWith("uploads")) return `${BACKEND_BASE}/${src}`;
    return src;
  }
  return "https://via.placeholder.com/100";
}

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    whatsappNumber: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const email = formData.email.trim().toLowerCase();
      const whatsappNumber = formData.whatsappNumber.trim();

      // Create order
      const orderPayload = {
        email,
        whatsappNumber,
        address: formData.address.trim(),
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const orderResponse = await createOrder(orderPayload);
      const orderId = orderResponse.data?.id || orderResponse.data?.orderId;

      if (!orderId) {
        throw new Error("Failed to create order");
      }

      // Send OTP
      await sendOtp(email);

      toast.success("Order created! Please verify your email.");

      // Clear cart
      clearCart();

      // Navigate to OTP verification
      navigate("/verify-otp", {
        state: {
          email,
          orderId,
          redirectTo: "/order-success",
        },
      });
    } catch (err) {
      console.error("Checkout failed:", err);
      const message = err?.response?.data?.message || "Checkout failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>

        <div className="checkout-grid">
          {/* LEFT: FORM */}
          <div className="checkout-form">
            <h2>Shipping Information</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address *"
                required
              />

              <input
                type="tel"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="WhatsApp Number * (e.g., +923001234567)"
                required
              />

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street Address (Optional)"
                rows={4}
              />

              <button
                type="submit"
                className="place-order-btn"
                disabled={loading}
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <img
                    src={normalizeImage(item.image)}
                    alt={item.title}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginRight: "12px",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: "14px", color: "#64748b" }}>
                      Qty: {item.quantity} × ${item.price}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: "#4f46e5" }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <strong>Total</strong>
              <strong>${cartTotal.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}