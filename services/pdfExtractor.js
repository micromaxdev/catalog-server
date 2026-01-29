import fetch from "node-fetch";
import PDFParser from "pdf2json";

/**
 * Extract text from PDF using pdf2json
 */
export const extractTextFromPDF = async (pdfUrl) => {
  try {
    console.log(`Fetching PDF from: ${pdfUrl}`);
    const response = await fetch(pdfUrl, { timeout: 30000 });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`PDF downloaded, size: ${buffer.length} bytes`);
    console.log("Extracting text with pdf2json...");
    
    const pdfParser = new PDFParser();
    
    return new Promise((resolve) => {
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        try {
          let fullText = "";
          
          pdfData.Pages.forEach((page) => {
            page.Texts.forEach((text) => {
              const decodedText = decodeURIComponent(text.R[0].T);
              fullText += decodedText + " ";
            });
            fullText += "\n";
          });
          
          console.log(`✅ PDF parsed successfully: ${pdfData.Pages.length} pages, ${fullText.length} characters`);
          
          resolve({
            success: true,
            text: fullText.trim(),
            pages: pdfData.Pages.length,
            info: {},
          });
        } catch (error) {
          console.error("❌ Error processing PDF data:", error.message);
          resolve({
            success: false,
            error: error.message,
          });
        }
      });
      
      pdfParser.on("pdfParser_dataError", (error) => {
        console.error("❌ Error parsing PDF:", error.parserError);
        resolve({
          success: false,
          error: error.parserError,
        });
      });
      
      pdfParser.parseBuffer(buffer);
    });
  } catch (error) {
    console.error("❌ Error extracting PDF text:", error.message);
    
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

  // Clean up the text
  let cleaned = text.replace(/\s+/g, " ").trim();

  // Check for bullet points (for Key Features)
  const bulletPattern = /[•●○▪▫■□]/g;
  const hasBullets = bulletPattern.test(cleaned);

  if (hasBullets) {
    // Split by bullet points
    const items = cleaned.split(bulletPattern);
    
    const bulletItems = items
      .map(item => item.trim())
      .filter(item => item.length > 10);
    
    return [{
      title: "",
      content: bulletItems,
    }];
  }

  const domainPattern = /(www\.[a-zA-Z0-9-]+\.com\s+\d{4}\s+\d{2}\s+\d{2})/g;
  const hasDomains = domainPattern.test(cleaned);
  
  if (hasDomains) {
    // Split by domain + date pattern
    const parts = cleaned.split(domainPattern);
    const sections = [];
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      
      // Skip empty parts and the domain separator itself
      if (!part || domainPattern.test(part)) continue;
      
      // Each part becomes a section
      if (part.length > 50) {
        // Try to extract a title from the first line
        const sentences = part.split(/[.!?]\s+/);
        const firstSentence = sentences[0];
        
        // If first sentence is short, use it as title
        if (firstSentence && firstSentence.length < 100 && firstSentence.length > 10) {
          sections.push({
            title: "",
            content: [part],
          });
        } else {
          sections.push({
            title: "",
            content: [part],
          });
        }
      }
    }
    
    return sections.length > 0 ? sections : [{ title: "", content: [cleaned] }];
  }

  // Fallback: Return as single section
  return [{ title: "", content: [cleaned] }];
};