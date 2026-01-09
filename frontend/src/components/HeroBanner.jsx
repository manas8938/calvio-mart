// src/components/HeroBanner.jsx
import React from "react";
import "./HeroBanner.css";

export default function HeroBanner() {
  const scrollToProducts = () => {
    const productsSection = document.querySelector(".products-section");
    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="banner">
      <div className="overlay"></div>

      <div className="sale-ribbon">
        <span>SALE 50% OFF</span>
      </div>

      <div className="content">
        <h1 className="content-title">
          Your One Stop Shop for <br />
          Everything
        </h1>
        <p className="subtitle">
          Fresh groceries, beauty essentials, and household items <br />
          delivered to your door
        </p>
        <button className="shop-now" onClick={scrollToProducts}>
          Shop Now
        </button>
      </div>
    </section>
  );
}