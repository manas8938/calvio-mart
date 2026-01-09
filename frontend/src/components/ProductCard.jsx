// frontend/src/components/ProductCard.jsx - COMPLETE IMAGE FIX

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { normalizeImageUrl } from "../utils/imageHelper";
import toast from "react-hot-toast";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    toast.success("Added to cart!", {
      icon: "🛒",
      style: { background: "#10b981", color: "white" },
      duration: 2000,
    });
  };

  const price = Number(product?.price || 0).toFixed(2);
  const oldPrice = product?.oldPrice ? Number(product.oldPrice).toFixed(2) : null;
  const rating = Number(product?.ratingAvg ?? product?.rating ?? 0);
  const reviews = Number(product?.ratingCount ?? product?.reviews ?? 0);
  
  // Normalize image URL
  const imgSrc = normalizeImageUrl(product?.image);
  
  console.log(`🖼️ ProductCard ${product.id}:`, {
    rawImage: product?.image,
    normalizedImage: imgSrc,
    title: product?.title
  });

  const handleImageError = () => {
    console.error(`❌ Image failed for product ${product.id}:`, {
      rawPath: product?.image,
      normalizedUrl: imgSrc
    });
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log(`✅ Image loaded for product ${product.id}:`, imgSrc);
  };

  return (
    <div
      className="product-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleCardClick()}
    >
      {product?.discount ? (
        <span className="discount-badge">-{product.discount}%</span>
      ) : null}

      <div className="product-img" aria-hidden>
        <img
          src={imageError ? "https://via.placeholder.com/400x300?text=No+Image" : imgSrc}
          alt={product?.title || "Product image"}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
        {product?.category && <span className="category-tag">{product.category}</span>}
      </div>

      <div className="product-info">
        <h3 className="product-title">{product?.title || 'Untitled Product'}</h3>
        
        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < Math.floor(rating) ? "#fbbf24" : "none"}
              stroke={i < Math.floor(rating) ? "#fbbf24" : "#cbd5e1"}
            />
          ))}
          <span className="rating-text">
            {rating.toFixed(1)} ({reviews})
          </span>
        </div>

        <div className="price">
          <span className="current-price">${price}</span>
          {oldPrice && <span className="old-price">${oldPrice}</span>}
        </div>

        <button
          className="add-to-cart"
          onClick={handleAddToCart}
          aria-label={`Add ${product?.title} to cart`}
        >
          <ShoppingCart size={18} /> Add to Cart
        </button>
      </div>
    </div>
  );
}