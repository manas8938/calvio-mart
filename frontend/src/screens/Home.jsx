// src/screens/Home.jsx - FIXED VERSION
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";
import { getProducts, searchProducts } from "../api/api";
import "./Home.css";

export default function Home() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayedSearchQuery, setDisplayedSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      try {
        let res;
        
        // If there's a search query, use search API
        if (searchQuery && searchQuery.trim()) {
          if (isMounted) setDisplayedSearchQuery(searchQuery);
          res = await searchProducts(searchQuery, 1, 50);
        } else {
          if (isMounted) setDisplayedSearchQuery("");
          res = await getProducts(1, 50);
        }

        if (!isMounted) return;

        let data = res?.data;
        
        // Handle different response structures
        if (data?.items) data = data.items;
        if (!Array.isArray(data)) data = [];

        // Normalize product data
        const normalized = data.map((p) => ({
          id: p.id || p.product_id,
          title: p.title || "Untitled Product",
          category: p.category || "Uncategorized",
          price: parseFloat(p.price || 0),
          oldPrice: p.oldPrice ? parseFloat(p.oldPrice) : null,
          discount: p.discount ?? null,
          rating: parseFloat(p.ratingAvg || p.rating || 0),
          reviews: parseInt(p.ratingCount || p.reviews || 0),
          image: p.image || p.imageUrl || null,
          stock: parseInt(p.stock || 0),
          ratingAvg: parseFloat(p.ratingAvg || 0),
          ratingCount: parseInt(p.ratingCount || 0),
        }));

        if (isMounted) {
          setProducts(normalized);
        }
      } catch (err) {
        console.error("❌ Failed to load products:", err);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCategory]);

  const filteredProducts = products.filter((product) => {
    // If searching, show all search results
    if (displayedSearchQuery) return true;
    
    // Otherwise filter by category
    return selectedCategory === "all"
      ? true
      : (product.category || "").toLowerCase() === selectedCategory.toLowerCase();
  });

  console.log('🎨 Filtered products to display:', filteredProducts);

  return (
    <>
      <HeroBanner />

      {!displayedSearchQuery && (
        <CategoryTabs 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory} 
        />
      )}

      <section className="products-section">
        <div className="products-header">
          <h2>
            {displayedSearchQuery 
              ? `Search Results for "${displayedSearchQuery}"` 
              : selectedCategory === "all" 
                ? "Featured Products" 
                : `${selectedCategory} Products`}
          </h2>
          {displayedSearchQuery && (
            <button 
              onClick={() => window.location.href = '/'}
              className="text-indigo-600 hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {filteredProducts.length === 0 && (
              <div className="no-products">
                <p>
                  {displayedSearchQuery 
                    ? `No products found for "${displayedSearchQuery}"` 
                    : "No products available yet."}
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}