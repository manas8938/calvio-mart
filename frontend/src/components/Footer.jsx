import React from "react";
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="main">
        <div className="brand">
          <h2 className="logo-name">
            <span>Calvio Mart</span>
          </h2>
          <p className="tagline">Your Trusted partner for Groceries, Cosmetics, and Household Essentials.</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Shipping Info</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Customer Service</h3>
          <ul>
            <li><a href="#">Track Order</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Calvio Mart. All rights reserved.</p>
      </div>
    </footer>
  );
}
