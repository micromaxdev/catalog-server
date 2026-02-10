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
      .map((item) => item.trim())
      .filter((item) => item.length > 10);

    return [
      {
        title: "",
        content: bulletItems,
      },
    ];
  }

  const productPattern =
    /((?:Vehicle Dock|Office Dock|VESA Cradle|Battery Charger|Desk Stand|Battery Pack)\s+[A-Z0-9-]+)/gi;

  if (productPattern.test(cleaned)) {
    const sections = [];
    const parts = cleaned.split(productPattern);

    let currentTitle = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      if (!part) continue;

      // Check if this part matches a product name
      const isProductName =
        /^(Vehicle Dock|Office Dock|VESA Cradle|Battery Charger|Desk Stand|Battery Pack)\s+[A-Z0-9-]+$/i.test(
          part
        );

      if (isProductName) {
        currentTitle = part;
      } else if (part.length > 50 && currentTitle) {
        // This is content for the current product
        sections.push({
          title: currentTitle,
          content: [part],
        });
        currentTitle = "";
      }
    }

    return sections.length > 0 ? sections : [{ title: "", content: [cleaned] }];
  }

  return [{ title: "", content: [cleaned] }];
};
