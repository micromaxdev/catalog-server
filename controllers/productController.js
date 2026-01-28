import { sequelize } from "../db/db.js";

export const getAllProducts = async (req, res) => {
  try {
    const { model_number, category, description } = req.query;

    let whereClause = "WHERE 1=1";
    const replacements = {};

    if (model_number) {
      whereClause += " AND p.model_number LIKE :model_number";
      replacements.model_number = `%${model_number}%`;
    }

    if (category) {
      whereClause += " AND p.category LIKE :category";
      replacements.category = `%${category}%`;
    }

    if (description) {
      whereClause += " AND p.description LIKE :description";
      replacements.description = `%${description}%`;
    }

    await sequelize.query("SET SESSION group_concat_max_len = 1000000");

    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(
          CONCAT(
            '{"url":"', i.s3_url, 
            '","is_primary":', i.is_primary, 
            ',"display_order":', i.display_order, 
            ',"file_name":"', i.file_name, '"}'
          )
          ORDER BY i.is_primary DESC, i.display_order ASC
          SEPARATOR '|||'
        ) as image_data
      FROM product p
      LEFT JOIN product_image i ON p.model_number = i.model_number
      ${whereClause}
      GROUP BY p.id, p.model_number
      ORDER BY p.model_number
    `;

    const [results] = await sequelize.query(query, {
      replacements,
    });

    const transformedResults = results.map((product) => {
      let images = [];
      if (product.image_data) {
        try {
          const imageStrings = product.image_data.split("|||");
          images = imageStrings
            .map((str) => {
              try {
                return JSON.parse(str);
              } catch (e) {
                return null;
              }
            })
            .filter(Boolean)
            .map((img) => img.url);
        } catch (e) {
          console.error("Error parsing image data:", e);
        }
      }

      return {
        model_number: product.model_number || "Unknown",
        description: product.description || "No description available",
        category: product.category || "General",
        subcategory: product.sub_category || null,
        brand: product.brand || null,
        image_path: images.length > 0 ? JSON.stringify(images) : null,
        datasheet_path: product.documents || null,
        data_hash:
          product.data_hash || Math.random().toString(36).substring(2, 15),
        last_modified:
          product.last_modified ||
          product.updated_at ||
          product.created_at ||
          new Date().toISOString(),
      };
    });

    res.status(200).json(transformedResults);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: err.message });
  }
};