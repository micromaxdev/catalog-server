import { sequelize } from "../db/db.js";
import { formatExtractedText } from "../services/pdfFormatter.js";

// Get all documents for a product
export const getProductDocuments = async (req, res) => {
  try {
    const { model_number } = req.params;

    const query = `
      SELECT 
        pd.*,
        dt.type_name,
        dt.prefix,
        dt.slug,
        dt.display_format,
        dt.sort_order
      FROM product_document pd
      LEFT JOIN document_type dt ON pd.document_type_id = dt.id
      WHERE pd.model_number = :model_number
      ORDER BY dt.sort_order ASC, pd.document_type_id ASC, pd.created_at DESC
    `;

    const [documents] = await sequelize.query(query, {
      replacements: { model_number },
    });

    const groupedDocuments = documents.reduce((acc, doc) => {
      const typeId = doc.document_type_id;
      if (!acc[typeId]) {
        acc[typeId] = {
          type_id: typeId,
          type_name: doc.type_name || `Type ${typeId}`,
          prefix: doc.prefix || `0${typeId}`,
          slug: doc.slug || null,
          display_format: doc.display_format || "bullets",
          sort_order: doc.sort_order || 0,
          documents: [],
        };
      }

      acc[typeId].documents.push({
        id: doc.id,
        file_name: doc.file_name,
        s3_url: doc.s3_url,
        file_size: doc.file_size,
        mime_type: doc.mime_type,
        created_at: doc.created_at,
      });

      // Format extracted text from first document
      if (acc[typeId].documents.length === 1 && doc.extracted_text) {
        acc[typeId].extracted_text = doc.extracted_text;
        acc[typeId].formatted_sections = formatExtractedText(
          doc.extracted_text
        );
      }

      return acc;
    }, {});

    res.status(200).json({
      model_number,
      total_documents: documents.length,
      documents_by_type: Object.values(groupedDocuments),
    });
  } catch (err) {
    console.error("Error fetching product documents:", err);
    res.status(500).json({ error: err.message });
  }
};
