import { dbConnection } from "./db/db.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./routes/productRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

const app = express();

const PORT = 4000;

// Connect to the database
dbConnection();

// Enable JSON parsing
app.use(express.json());

// Mount routes
app.use("/api", productRoutes);
app.use("/api", documentRoutes);

// Serve React frontend in production
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "frontend", "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
