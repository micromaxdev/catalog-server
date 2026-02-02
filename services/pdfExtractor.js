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
  
    // Check for bullet points
    const bulletPattern = /[•●○▪▫■□]/g;
    const hasBullets = bulletPattern.test(cleaned);
  
    if (hasBullets) {
      // Split by bullet points for Key Features
      const items = cleaned.split(bulletPattern);
      
      const bulletItems = items
        .map(item => item.trim())
        .filter(item => item.length > 10);
      
      return [{
        title: "",
        content: bulletItems,
      }];
    }
  
    // For Technical Specifications: Split by OPM product codes
    // Pattern: "Vehicle Dock OPM-T016-A3" or "VESA Cradle OPM-T021-A1"
    const productPattern = /((?:Vehicle Dock|Office Dock|VESA Cradle|Battery Charger|Desk Stand|Battery Pack)\s+[A-Z0-9-]+)/gi;
    
    if (productPattern.test(cleaned)) {
      const sections = [];
      const parts = cleaned.split(productPattern);
      
      let currentTitle = "";
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim();
        if (!part) continue;
        
        // Check if this part matches a product name
        const isProductName = /^(Vehicle Dock|Office Dock|VESA Cradle|Battery Charger|Desk Stand|Battery Pack)\s+[A-Z0-9-]+$/i.test(part);
        
        if (isProductName) {
          currentTitle = part;
        } else if (part.length > 50 && currentTitle) {
          // This is content for the current product
          sections.push({
            title: currentTitle,
            content: [part],
          });
          currentTitle = ""; // Reset
        }
      }
      
      return sections.length > 0 ? sections : [{ title: "", content: [cleaned] }];
    }
  
    // Fallback: Return as single section
    return [{ title: "", content: [cleaned] }];
  };