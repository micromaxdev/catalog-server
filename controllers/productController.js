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

    const [results] = await sequelize.query(`SELECT * FROM product`, {
      replacements,
    });

    // Transform the results to match frontend expectations
    const transformedResults = results.map((product) => ({
      model_number: product.model_number || "Unknown",
      description: product.description || "No description available",
      category: product.category || "General",
      subcategory: product.sub_category || null,
      brand: product.brand || null,
      // Map database columns to frontend expectations
      image_path: product.images || null,
      datasheet_path: product.documents || null,
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
    res.status(500).json({ error: err.message });
  }
};
