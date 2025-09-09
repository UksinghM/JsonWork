import React from "react";

function SearchBar({ onSearch }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Search products..."
        onChange={(e) => onSearch(e.target.value)}
        style={{ padding: "8px", width: "300px" }}
      />
    </div>
  );
}

export default SearchBar;
