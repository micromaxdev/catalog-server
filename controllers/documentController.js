import { sequelize } from "../db/db.js";
import { extractTextFromPDF, formatExtractedText } from "../services/pdfExtractor.js";

// Get all documents for a product
export const getProductDocuments = async (req, res) => {
  try {
    const { model_number } = req.params;

    const query = `
      SELECT 
        pd.*,
        dt.type_name,
        dt.prefix
      FROM product_document pd
      LEFT JOIN document_type dt ON pd.document_type_id = dt.id
      WHERE pd.model_number = :model_number
      ORDER BY pd.document_type_id ASC, pd.created_at DESC
    `;

    const [documents] = await sequelize.query(query, {
      replacements: { model_number },
    });

    // Group documents by type
    const groupedDocuments = documents.reduce((acc, doc) => {
      const typeId = doc.document_type_id;
      if (!acc[typeId]) {
        acc[typeId] = {
          type_id: typeId,
          type_name: doc.type_name || `Type ${typeId}`,
          prefix: doc.prefix || `0${typeId}`,
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
      return acc;
    }, {});

    // Extract text from Key Features (7) and Specifications (10)
    const documentsByType = Object.values(groupedDocuments);
    
    for (const docType of documentsByType) {
      if (docType.type_id === 7 || docType.type_id === 10) {
        // Extract text from first document of each type
        if (docType.documents.length > 0) {
          const firstDoc = docType.documents[0];
          try {
            const extraction = await extractTextFromPDF(firstDoc.s3_url);
            
            if (extraction.success) {
              docType.extracted_text = extraction.text;
              docType.formatted_sections = formatExtractedText(extraction.text);
              docType.page_count = extraction.pages;
            }
          } catch (err) {
            console.error(`Error extracting text from ${firstDoc.file_name}:`, err);
          }
        }
      }
    }

    res.status(200).json({
      model_number,
      total_documents: documents.length,
      documents_by_type: documentsByType,
    });
  } catch (err) {
    console.error("Error fetching product documents:", err);
    res.status(500).json({ error: err.message });
  }
};