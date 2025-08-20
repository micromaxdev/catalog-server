import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import FilterDropdown from "./FilterDropdown";
import { TextField } from "@mui/material";
import { ViewList } from "@mui/icons-material";
import { ViewModule } from "@mui/icons-material";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list");

  const categories = [
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];
  const subcategories = [
    ...new Set(
      products
        .filter((product) => product.category === selectedCategory)
        .map((product) => product.subcategory)
        .filter(Boolean)
    ),
  ];

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterProducts(term, selectedCategory, selectedSubcategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("");
    filterProducts(searchTerm, category, "");
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
    filterProducts(searchTerm, selectedCategory, subcategory);
  };

  const filterProducts = (term, category, subcategory) => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product?.model_number?.toLowerCase().includes(term) ||
        product?.description?.toLowerCase().includes(term);
      const matchesCategory = category ? product?.category === category : true;
      const matchesSubcategory = subcategory
        ? product?.subcategory === subcategory
        : true;
      return matchesSearch && matchesCategory && matchesSubcategory;
    });
    setFilteredProducts(filtered);
  };

  return (
    <div className="app-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="header-content">
          <h1 className="main-title">Micromax Product Catalogue</h1>
          <p className="subtitle">
            Comprehensive technology solutions and components for your business
            needs
          </p>
          <div className="company-tagline">
            Professional Grade • Reliable • Innovative
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stats-item">
          <span className="stats-number">{products.length}</span>
          <span className="stats-label">Total Products</span>
        </div>
        <div className="stats-item">
          <span className="stats-number">{categories.length}</span>
          <span className="stats-label">Categories</span>
        </div>
        <div className="stats-item">
          <span className="stats-number">{filteredProducts.length}</span>
          <span className="stats-label">Results Found</span>
        </div>
        <div className="stats-item">
          <span className="stats-number">24/7</span>
          <span className="stats-label">Support</span>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <h2 className="search-title">Find Your Product</h2>

          <div className="search-controls">
            <div className="search-input-wrapper">
              <TextField
                fullWidth
                placeholder="Search by model number, description, or specifications..."
                value={searchTerm}
                onChange={handleSearch}
                variant="outlined"
                size="large"
              />
            </div>

            <div className="filter-controls">
              <div className="filter-item">
                <FilterDropdown
                  label="Product Category"
                  options={categories}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  placeholder="All Categories"
                />
              </div>
              <div className="filter-item">
                <FilterDropdown
                  label="Subcategory"
                  options={subcategories}
                  value={selectedSubcategory}
                  onChange={handleSubcategoryChange}
                  placeholder="All Subcategories"
                  disabled={!selectedCategory}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <div className="products-header">
          <h2 className="products-title">Product Listings</h2>
          <div className="products-controls">
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <ViewList />
              </button>
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <ViewModule />
              </button>
            </div>
            <div className="products-count">
              {filteredProducts.length} Products
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading product catalog...</p>
          </div>
        ) : (
          <div className={`products-grid ${viewMode}`}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.model_number}
                  model_number={product.model_number}
                  description={product.description}
                  category={product.category}
                  brand={product.brand}
                  image_path={product.image_path}
                  datasheet_path={product.datasheet_path}
                  last_modified={product.last_modified}
                  data_hash={product.data_hash}
                  viewMode={viewMode}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No Products Found</h3>
                <p>
                  We couldn't find any products matching your search criteria.
                </p>
                <p>
                  Try adjusting your search terms or filters to find what you're
                  looking for.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
