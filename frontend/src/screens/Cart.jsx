// src/screens/Cart.jsx — FINAL & 100% WORKING
import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { ChevronLeft, Trash2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-content">
          <ShoppingCart size={80} className="empty-icon" />
          <h1>Your Cart is Empty</h1>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button className="empty-btn" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ChevronLeft size={20} /> Back to Shopping
      </button>

      <div className="cart-containers-wrapper">
        {/* CART ITEMS */}
        <div className="cart-items-container">
          <h1>Your Cart ({cartItems.length} items)</h1>
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                <img src={item.image} alt={item.title} />
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p className="price">${item.price} each</p>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={22} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="order-summary-container">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-total">
            <strong>Total</strong>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>
          {/* FIXED: Proceed to Checkout now works! */}
          <button 
            className="checkout-btn" 
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}