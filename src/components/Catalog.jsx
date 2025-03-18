import { useState, useEffect } from "react";
import Products from "./Products";

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState(
    localStorage.getItem("catalogSearch") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    localStorage.setItem("catalogSearch", searchQuery);
  }, [searchQuery]);

  return (
    <div className="catalog">
      <div className="catalog-search-container">
        <input
          type="text"
          placeholder="Mahsulotlarni qidirish..."
          className="catalog-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Display products based on search */}
      <Products selectedCategory={selectedCategory} searchQuery={searchQuery} />
    </div>
  );
};

export default Catalog;
