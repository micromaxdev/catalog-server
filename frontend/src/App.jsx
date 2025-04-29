import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);
  console.log(products);
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Product Catalogue</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <pre
          style={{ background: "#ffffff", padding: "1rem", color: "#000000" }}
        >
          {JSON.stringify(products, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
