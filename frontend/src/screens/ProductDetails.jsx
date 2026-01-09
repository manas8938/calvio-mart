// src/screens/ProductDetails.jsx - FIXED WITH CENTRALIZED IMAGE HELPER
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  ChevronLeft,
  Minus,
  Plus,
  Star,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { getProduct, getProducts } from "../api/api";
import { normalizeImageUrl } from "../utils/imageHelper";
import ProductCard from "../components/ProductCard";
import "./ProductDetails.css";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  /* =====================
     LOAD PRODUCT
  ====================== */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await getProduct(id);
        setProduct(res.data);
        window.scrollTo(0, 0);
        setTimeout(() => setIsLoaded(true), 80);
      } catch (err) {
        toast.error("Product not found");
        navigate("/");
      }
    };
    loadProduct();
  }, [id, navigate]);

  /* =====================
     LOAD RELATED PRODUCTS
  ====================== */
  useEffect(() => {
    if (!product?.category) return;

    const loadRelated = async () => {
      try {
        const res = await getProducts(1, 20);
        let list = res.data?.items || res.data || [];
        const filtered = list
          .filter(
            (p) =>
              p.category === product.category &&
              p.id !== product.id
          )
          .slice(0, 4);

        setRelatedProducts(filtered);
      } catch (err) {
        console.error("Related products failed");
      }
    };

    loadRelated();
  }, [product]);

  if (!product) {
    return (
      <div style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '24px',
        color: '#64748b'
      }}>
        Loading product...
      </div>
    );
  }

  /* =====================
     SAFE VALUES
  ====================== */
  const price = Number(product.price || 0).toFixed(2);
  const oldPrice = product.oldPrice
    ? Number(product.oldPrice).toFixed(2)
    : null;
  const savings =
    oldPrice && price
      ? (oldPrice - price).toFixed(2)
      : "0.00";

  // Use centralized image helper
  const imgSrc = normalizeImageUrl(product.image);

  const handleImageError = () => {
    console.warn(`Image failed to load for product ${product.id}:`, product.image);
    setImageError(true);
  };

  /* =====================
     HANDLERS
  ====================== */
  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    toast.success("Added to cart!", {
      icon: "🛒",
      style: { background: "#10b981", color: "white" },
    });
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    navigate("/checkout");
  };

  return (
    <div className={`product-detail-page ${isLoaded ? "loaded" : ""}`}>
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ChevronLeft size={20} /> Back to Shopping
      </button>

      <div className="detail-container">
        {/* LEFT — IMAGE */}
        <div className="image-section">
          <div className="main-image">
            <img
              src={imageError ? "https://via.placeholder.com/600x600?text=No+Image" : imgSrc}
              alt={product.title}
              onError={handleImageError}
              loading="eager"
            />

            <button
              className="wishlist-btn"
              onClick={() => setIsWishlisted(!isWishlisted)}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                size={28}
                fill={isWishlisted ? "#ef4444" : "none"}
                stroke={isWishlisted ? "#ef4444" : "#64748b"}
              />
            </button>

            {product.discount && (
              <div className="save-badge">
                Save {product.discount}%
              </div>
            )}
          </div>

          <div className="thumbnail-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="thumb">
                <img 
                  src={imageError ? "https://via.placeholder.com/100?text=No+Image" : imgSrc} 
                  alt={`thumbnail ${i}`}
                  onError={handleImageError}
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — INFO */}
        <div className="info-section">
          <h1>{product.title}</h1>

          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={22}
                fill={i < Math.floor(product.ratingAvg || product.rating || 0) ? "#fbbf24" : "none"}
                stroke="#fbbf24"
              />
            ))}
            <span className="rating-text">
              {(product.ratingAvg || product.rating || 0).toFixed(1)} ({product.ratingCount || product.reviews || 0} reviews)
            </span>
          </div>

          <div className="price-section">
            <span className="current-price">${price}</span>
            {oldPrice && <span className="old-price">${oldPrice}</span>}
            {oldPrice && <span className="savings">You save ${savings}</span>}
          </div>

          <div className="stock">
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </div>

          <div className="quantity-selector">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="qty">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="action-buttons">
            <button className="add-to-cart-big" onClick={handleAddToCart}>
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          <div className="guarantees">
            <div><strong>Free Shipping</strong><br />On orders over $50</div>
            <div><strong>2 Year Warranty</strong><br />Full coverage</div>
            <div><strong>Easy Returns</strong><br />30-day policy</div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="related-products">
          <h2>You May Also Like</h2>
          <div className="related-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}