import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import FilterDropdown from "./FilterDropdown";
import { TextField, Box, Typography } from "@mui/material";

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
    <Box
      sx={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Product Catalog
      </Typography>

      <Box
        sx={{
          marginBottom: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "400px",
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by part number or description..."
          value={searchTerm}
          onChange={handleSearch}
          variant="outlined"
        />

        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Box sx={{ flex: 1 }}>
            <FilterDropdown
              label="Category"
              options={categories}
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="Select category..."
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <FilterDropdown
              label="Subcategory"
              options={subcategories}
              value={selectedSubcategory}
              onChange={handleSubcategoryChange}
              placeholder="Select subcategory..."
              disabled={!selectedCategory}
            />
          </Box>
        </Box>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            flex: 1,
          }}
        >
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
        </Box>
      )}
    </Box>
  );
}

export default App;
