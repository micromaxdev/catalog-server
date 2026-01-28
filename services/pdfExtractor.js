import fetch from "node-fetch";

/**
 * Extract text from PDF using pdf-parse v2.4.5
 * Correct API: new PDFParse(uint8Array).getText()
 */
export const extractTextFromPDF = async (pdfUrl) => {
  try {
    // Fetch PDF from S3
    console.log(`Fetching PDF from: ${pdfUrl}`);
    const response = await fetch(pdfUrl, { timeout: 30000 });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`PDF downloaded, size: ${buffer.length} bytes`);
    
    // Import pdf-parse v2.4.5
    console.log("Loading pdf-parse...");
    const pdfModule = await import("pdf-parse");
    const PDFParse = pdfModule.PDFParse;
    
    if (!PDFParse) {
      throw new Error("PDFParse class not found");
    }
    
    // Convert Buffer to Uint8Array (required by pdf-parse v2.4.5)
    const uint8Array = new Uint8Array(buffer);
    
    // Create parser instance
    console.log("Creating PDFParse instance...");
    const pdfParser = new PDFParse(uint8Array);
    
    // Extract text using getText() method
    console.log("Extracting text...");
    const result = await pdfParser.getText();
    
    console.log(`PDF parsed successfully: ${result.total} pages, ${result.text.length} characters`);
    
    return {
      success: true,
      text: result.text,
      pages: result.total,
      info: {},
    };
  } catch (error) {
    console.error("Error extracting PDF text:", error.message);
    
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Format extracted text into readable sections
 */
export const formatExtractedText = (text) => {
  if (!text) return [];

  // Remove excessive whitespace and newlines
  let formatted = text
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

  // Split into sections based on headers
  const sections = [];
  const lines = formatted.split("\n");
  let currentSection = { title: "", content: [] };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Detect headers (all caps, short, ends with colon)
    const isHeader =
      trimmed.length < 60 &&
      trimmed.length > 2 &&
      (trimmed === trimmed.toUpperCase() || trimmed.endsWith(":"));

    if (isHeader) {
      // Save previous section if it has content
      if (currentSection.content.length > 0) {
        sections.push({ ...currentSection });
      }
      // Start new section
      currentSection = {
        title: trimmed.replace(/:$/, ""),
        content: [],
      };
    } else {
      currentSection.content.push(trimmed);
    }
  });

  // Add final section
  if (currentSection.content.length > 0) {
    sections.push(currentSection);
  }

  // If no sections found, return all as one section
  return sections.length > 0
    ? sections
    : [{ title: "", content: [formatted] }];
};