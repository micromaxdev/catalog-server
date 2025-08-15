import { sequelize } from "../db/db.js";

export const getAllProducts = async (req, res) => {
  try {
    const { model_number, category, description } = req.query;

    let whereClause = "WHERE 1=1";
    const replacements = {};

    if (model_number) {
      whereClause += " AND model_number LIKE :model_number";
      replacements.model_number = `%${model_number}%`;
    }

    if (category) {
      whereClause += " AND category LIKE :category";
      replacements.category = `%${category}%`;
    }

    if (description) {
      whereClause += " AND description LIKE :description";
      replacements.description = `%${description}%`;
    }

    // Get all products with S3 URLs
    const [results] = await sequelize.query(
      `SELECT * FROM product ${whereClause} LIMIT 100`,
      { replacements }
    );

    // Transform the results to match frontend expectations
    const transformedResults = results.map((product) => ({
      model_number: product.model_number || "Unknown",
      description: product.description || "No description available",
      category: product.category || "General",
      subcategory: product.subcategory || null,
      brand: product.brand || null,
      // Map database columns to frontend expectations
      image_path: product.images || null,
      datasheet_path: product.datasheets || null,
      data_hash:
        product.data_hash || Math.random().toString(36).substring(2, 15),
      last_modified:
        product.last_modified ||
        product.updated_at ||
        product.created_at ||
        new Date().toISOString(),
    }));

    console.log(`Found ${transformedResults.length} products`);

    // Log sample of products with images/datasheets for debugging
    const productsWithAssets = transformedResults.filter(
      (p) => p.image_path || p.datasheet_path
    );
    if (productsWithAssets.length > 0) {
      console.log(`Products with assets: ${productsWithAssets.length}`);
      console.log("Sample product with assets:", {
        model: productsWithAssets[0].model_number,
        hasImage: !!productsWithAssets[0].image_path,
        hasDatasheet: !!productsWithAssets[0].datasheet_path,
        imageUrl: productsWithAssets[0].image_path?.substring(0, 50) + "...",
        datasheetUrl:
          productsWithAssets[0].datasheet_path?.substring(0, 50) + "...",
      });
    }

    res.status(200).json(transformedResults);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: err.message });
  }
};
