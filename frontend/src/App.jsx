import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import FilterDropdown from "./FilterDropdown";

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [loading, setLoading] = useState(true);

  // Extract unique categories and subcategories
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
        product?.part_number?.toLowerCase().includes(term) ||
        product?.long_description?.toLowerCase().includes(term);
      const matchesCategory = category ? product?.category === category : true;
      const matchesSubcategory = subcategory
        ? product?.subcategory === subcategory
        : true;
      return matchesSearch && matchesCategory && matchesSubcategory;
    });
    setFilteredProducts(filtered);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Product Catalogue</h1>

      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "400px",
        }}
      >
        <input
          type="text"
          placeholder="Search by part number or description..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            padding: "0.5rem",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "1rem",
          }}
        />

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <FilterDropdown
              label="Category"
              options={categories}
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="Select category..."
            />
          </div>
          <div style={{ flex: 1 }}>
            <FilterDropdown
              label="Subcategory"
              options={subcategories}
              value={selectedSubcategory}
              onChange={handleSubcategoryChange}
              placeholder="Select subcategory..."
              disabled={!selectedCategory}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.part_number}
              part_number={product.part_number}
              long_description={product.long_description}
              category={product.category}
              image_path={product.image_path}
              datasheet_path={product.datasheet_path}
              last_modified={product.last_modified}
              data_hash={product.data_hash}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
