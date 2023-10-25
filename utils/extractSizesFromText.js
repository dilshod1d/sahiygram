export default function extractSizesFromText(htmlText) {
  // Define a case-insensitive regular expression pattern for size
  const sizePattern =
    /\brazmer(?:lari)?\s*[:\-]?\s*([\d\.\/\-\s]+|[a-zA-Z]+)\b/i;

  // Find all matches in the text
  const matches = htmlText.match(sizePattern);

  // If there are no matches, return null
  if (!matches) {
    return null;
  }

  // Split the matched sizes by common separators, or return the text size
  if (isNaN(matches[1])) {
    return [matches[1]];
  } else {
    const sizes = matches[1].split(/[\s\/\-.]+/);
    return sizes.filter((size) => size.trim() !== "");
  }
}
