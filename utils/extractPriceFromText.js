export default function extractPriceFromText(htmlText) {
  // Define regular expressions for different price patterns
  const patterns = [
    /\b(?:narx|narxi|цена)\s*(\d+\s*\d*\s*\d*|\d+)(?:\s*(?:min|ming|som|цена)?)?\b/i,
    /(\d+\s*\d*\s*\d*|\d+)\s*(?:min|ming|som|цена)\b/i,
  ];

  // Split the text by <br> tags
  const lines = htmlText.split(/<br\s*\/?>/i);

  // Check each line for a price
  for (const line of lines) {
    // Check each pattern to find a match
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        // If there is an explicit price indicator, return the price directly
        if (line.match(/\b(?:narx|narxi|цена)\b/i)) {
          return formatPrice(match[1]);
        }

        // Otherwise, check the number of digit groups
        const numberGroups = match[1].split(/\s+/);
        if (numberGroups.length === 3) {
          // Clean up and return the matched price
          return formatPrice(match[1]);
        }
      }
    }
  }

  // Return null if no price is found
  return null;
}

// Format the price by adding trailing zeros if necessary
function formatPrice(price) {
  price = price.replace(/[^0-9]/g, "");
  if (price.length <= 3) {
    price = price.padEnd(6, "0");
  }
  return price;
}
