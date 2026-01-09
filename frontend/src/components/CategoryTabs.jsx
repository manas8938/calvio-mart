import React, { useCallback } from "react";
import {
  Globe,
  ShoppingBasket,
  Sparkles,
  Cookie,
  CupSoda,
} from "lucide-react";
import "./CategoryTabs.css";

const categories = [
  { id: "all", name: "All", icon: Globe },
  { id: "groceries", name: "Groceries", icon: ShoppingBasket },
  { id: "cosmetics", name: "Cosmetics", icon: Sparkles },
  { id: "snacks", name: "Snacks", icon: Cookie },
  { id: "drinks", name: "Drinks", icon: CupSoda },
];

export default function CategoryTabs({
  selectedCategory = "all",
  onCategoryChange = () => {},
}) {
  const handleClick = useCallback(
    (id) => {
      onCategoryChange(id);
    },
    [onCategoryChange]
  );

  return (
    <div className="category-tabs">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            className={`cat-tab ${isActive ? "active" : ""}`}
            onClick={() => handleClick(cat.id)}
            aria-pressed={isActive}
          >
            <span className="cat-icon">
              <Icon size={20} strokeWidth={2.2} />
            </span>
            <span className="cat-label">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
