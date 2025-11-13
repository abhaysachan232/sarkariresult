import sanitizeHtml from "sanitize-html";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","India"
];

/**
 * Clean RSS content
 */
export function cleanAndRewriteContent(html: string): string {
  let text = sanitizeHtml(html, {
    allowedTags: ["b", "strong", "i", "ul", "ol", "li", "br", "p", "a"],
    allowedAttributes: { a: ["href", "title"] },
  });

  text = text
    .replace(/Rojgar\s*Result/gi, "")
    .replace(/Sarkari\s*Result/gi, "")
    .replace(/rojgarresult\.com(\.cm)?/gi, "")
    .replace(/sarkariresult\.com(\.cm)?/gi, "")
    .replace(/\nRead more/gi, "")
    .trim();

  return text;
}

/**
 * Generate SEO fields
 */
export function generateSEO(title: string, description: string) {
  const cleanTitle = title.replace(/\s*\|\s*Rojgar\s*Result.*$/i, "").trim();

  return {
    metaTitle: `${cleanTitle} - Latest Update`,
    metaDescription: description.slice(0, 160),
    keywords: cleanTitle
      .split(" ")
      .filter((w) => w.length > 2)
      .join(", "),
  };
}

/**
 * Extract Important Dates / Fee / Links from HTML
 */
export function extractLists(html: string) {
  const result: {
    importantDates: Record<string, string>; // key 1 me table HTML
    applicationFee: Record<string, string>; // same table
    links: Record<string, string>;
  } = { importantDates: {}, applicationFee: {}, links: {} };

  // Normalize whitespace
  html = html.replace(/\n/g, " ").replace(/\s+/g, " ");

  // Match table containing Important Dates and Application Fee
  const tableMatch = html.match(
    /<table[^>]*>[\s\S]*?<h4[^>]*>.*?Important Dates.*?<\/h4>[\s\S]*?<\/table>/i
  );

  if (tableMatch) {
    const tableHTML = tableMatch[0];
    // store entire table HTML under key "1"
    result.importantDates["1"] = tableHTML;
    result.applicationFee["1"] = tableHTML;
  }

  // Extract links from any h2-h4 headings with <a>
  const linkMatches = html.matchAll(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/gi);
  for (const h of linkMatches) {
    const aMatch = h[0].match(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/i);
    if (aMatch) {
      const url = aMatch[1].trim();
      const text = aMatch[2].replace(/<[^>]+>/g, "").trim();
      if (url && text && !url.includes("rojgarresult.com")) {
        result.links[text] = url;
      }
    }
  }

  console.log("Table HTML:", tableMatch ? tableMatch[0] : "No table found");
  console.log("Links:", result.links);

  return result;
}


/**
 * Detect state from description
 */
export function detectState(description: string): string {
  for (let s of STATES) {
    if (description.toLowerCase().includes(s.toLowerCase())) return s;
  }
  return "India";
}
