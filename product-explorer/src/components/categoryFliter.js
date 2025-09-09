import React, { useEffect, useState } from "react";

function CategoryFilter({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);

  // Fetch category list from API
  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <div style={{ marginBottom: "20px" }}>
      <select onChange={(e) => onSelectCategory(e.target.value)} style={{ padding: "8px" }}>
        <option value="">All Categories</option>
        {categories.map((category, index) => (
          <option key={index} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategoryFilter;
