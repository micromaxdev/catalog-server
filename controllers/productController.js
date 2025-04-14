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

    const [results] = await sequelize.query(
      `SELECT * FROM products ${whereClause} LIMIT 100`,
      { replacements }
    );

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
