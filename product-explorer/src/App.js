import React, { useEffect, useState } from "react";
import SearchBar from "./components/searchBar";
import CategoryFilter from "./components/categoryFliter"; // 👈 new import


function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const limit = 10;

  // Fetch products with pagination
  useEffect(() => {
    setLoading(true);
    fetch(`https://dummyjson.com/products?limit=${limit}&skip=${page * limit}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch products");
        setLoading(false);
      });
  }, [page]);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite
  const toggleFavorite = (product) => {
    if (favorites.some((fav) => fav.id === product.id)) {
      // Remove from favorites
      setFavorites(favorites.filter((fav) => fav.id !== product.id));
    } else {
      // Add to favorites
      setFavorites([...favorites, product]);
    }
  };

  // Search function
  const handleSearch = (query) => {
    if (!query) {
      fetch(`https://dummyjson.com/products?limit=${limit}&skip=${page * limit}`)
        .then((res) => res.json())
        .then((data) => setProducts(data.products));
    } else {
      fetch(`https://dummyjson.com/products/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => setProducts(data.products));
    }
  };

  // Category filter function
  const handleCategory = (category) => {
    if (!category) {
      fetch(`https://dummyjson.com/products?limit=${limit}&skip=${page * limit}`)
        .then((res) => res.json())
        .then((data) => setProducts(data.products));
    } else {
      fetch(`https://dummyjson.com/products/category/${category}`)
        .then((res) => res.json())
        .then((data) => setProducts(data.products));
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div style={{ background: darkMode ? "#222" : "#fff", color: darkMode ? "#fff" : "#000", minHeight: "100vh", padding: "20px" }}>
      <h1>Product Explorer</h1>

      {/* 🌙 Dark mode toggle */}
      <button onClick={() => setDarkMode(!darkMode)} style={{ marginBottom: "20px", padding: "8px" }}>
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>

      <SearchBar onSearch={handleSearch} />
      <CategoryFilter onSelectCategory={handleCategory} />

      {/* Products grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: "1px solid #ddd", padding: "10px", background: darkMode ? "#333" : "#f9f9f9" }}>
            <img src={product.thumbnail} alt={product.title} width="100%" />
            <h3>{product.title}</h3>
            <p>💰 ${product.price}</p>
            <p>⭐ {product.rating}</p>

            {/* ❤️ Favorite button */}
            <button onClick={() => toggleFavorite(product)}>
              {favorites.some((fav) => fav.id === product.id) ? "💔 Remove Favorite" : "❤️ Add Favorite"}
            </button>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0}>
          ⬅️ Previous
        </button>
        <span style={{ margin: "0 10px" }}> Page {page + 1} </span>
        <button onClick={() => setPage((prev) => prev + 1)}>Next ➡️</button>
      </div>

      {/* Favorites Section */}
      <div style={{ marginTop: "40px" }}>
        <h2>❤️ Your Favorites</h2>
        {favorites.length === 0 ? (
          <p>No favorites yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {favorites.map((fav) => (
              <div key={fav.id} style={{ border: "1px solid #ddd", padding: "10px", background: darkMode ? "#444" : "#f1f1f1" }}>
                <img src={fav.thumbnail} alt={fav.title} width="100%" />
                <h3>{fav.title}</h3>
                <p>💰 ${fav.price}</p>
                <p>⭐ {fav.rating}</p>
                <button onClick={() => toggleFavorite(fav)}>💔 Remove Favorite</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;