import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import UserProfileDropdown from "./UserProfileDropdown";
import "./Header.css";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount } = useCart();
  const { user } = useAuth(); // get logged-in user
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    // Navigate to home with search query
    navigate(`/?search=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleCartClick = () => navigate("/cart");

  return (
    <header className="navbar">
      <div>
        <Link to="/" className="logo">
          Calvio Mart
        </Link>
      </div>

      <form className="searchBar" onSubmit={handleSearchSubmit} role="search">
        <span className="search-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" fill="none" />
            <line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        <input
          className="search-input"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for Products..."
          aria-label="Search for Products"
        />
      </form>

      <div className="header-rightside">
        <button
          className="icon-cart"
          title="Cart"
          onClick={handleCartClick}
          aria-label={`Shopping cart with ${cartCount} items`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 6h15l-1.5 9h-11z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="20" r="1.2" fill="currentColor" />
            <circle cx="19" cy="20" r="1.2" fill="currentColor" />
          </svg>
          {cartCount > 0 && (
            <span className="jm-badge" aria-live="polite">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>

        {/* Use context user instead of prop */}
        <UserProfileDropdown userEmail={user?.email} />
      </div>
    </header>
  );
}
