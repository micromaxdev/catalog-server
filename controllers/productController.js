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

    // First, let's get all available columns and data
    const [results] = await sequelize.query(
      `SELECT * FROM product ${whereClause} LIMIT 100`,
      { replacements }
    );

    // Transform the results to ensure all expected fields exist
    const transformedResults = results.map((product) => ({
      model_number: product.model_number || "Unknown",
      description: product.description || "No description available",
      category: product.category || "General",
      subcategory: product.subcategory || null,
      image_path: product.image_path || null,
      datasheet_path: product.datasheet_path || null,
      data_hash:
        product.data_hash || Math.random().toString(36).substring(2, 15),
      last_modified:
        product.last_modified ||
        product.updated_at ||
        product.created_at ||
        new Date().toISOString(),
    }));

    res.status(200).json(transformedResults);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: err.message });
  }
};
