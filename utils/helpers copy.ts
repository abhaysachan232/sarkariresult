// import axios from "axios";
// import * as cheerio from "cheerio";

// // Clean HTML text
// export function cleanHtml(html: string): string {
//   return html
//     .replace(/\s+/g, " ")
//     .replace(/Rojgar\s*Result/gi, "")
//     .replace(/https?:\/\/[^\s"]+/gi, "")
//     .replace(/\n/g, " ")
//     .replace(/ +/g, " ")
//     .trim();
// }

// // Fetch RSS feed
// export async function fetchRojgarResultRSS() {
//   const rssUrl = "https://www.rojgarresult.com/feed/";
//   const { data } = await axios.get(rssUrl);
//   const $ = cheerio.load(data, { xmlMode: true });
//   const items: any[] = [];

//   $("item").each((_, el) => {
//     items.push({
//       title: $(el).find("title").text(),
//       link: $(el).find("link").text(),
//       pubDate: $(el).find("pubDate").text(),
//       description: $(el).find("description").text(),
//       category: $(el).find("category").text(),
//     });
//   });

//   return items;
// }

// // Generic table extractor
// export function extractTableData(
//   $: cheerio.CheerioAPI,
//   sectionTitle: string
// ) {
//   const result: Record<string, string> = {};
//   const header = $(`strong:contains("${sectionTitle}")`).first();
//   if (!header.length) return result;

//   const table = header.closest("table");
//   if (!table.length) return result;

//   table.find("tr").each((_, row) => {
//     const key = $(row).find("td").first().text().trim();
//     const val = $(row).find("td").last().text().trim();
//     if (key && val) result[key] = val;
//   });

//   return result;
// }

// // Extract key-value from <ul><li>
// export function extractKeyValueList($: cheerio.CheerioAPI, title: string) {
//   const result: Record<string, string> = {};

//   $(`strong:contains("${title}")`)
//     .closest("table")
//     .find("ul li")
//     .each((_, li) => {
//       const text = cleanHtml($(li).text());
//       const [key, ...rest] = text.split(":");
//       const val = rest.join(":").trim();
//       if (key && val) result[key.trim()] = val;
//     });

//   return result;
// }

// // Extract important links table
// export function extractLinks($: cheerio.CheerioAPI) {
//   const links: Record<string, string> = {};
//   $(`h3 strong:contains("Important Links")`)
//     .closest("table")
//     .find("tr")
//     .each((_, row) => {
//       const key = cleanHtml($(row).find("td").first().text());
//       const val = $(row).find("a").attr("href") || "";
//       if (key) links[key] = val.includes("rojgarresult.com") ? "" : val;
//     });
//   return links;
// }

// // Extract text section (eligibility, age, howToApply)
// function extractTextSection($: cheerio.CheerioAPI, sectionTitle: string) {
//   const header = $(`strong:contains("${sectionTitle}")`).first();
//   if (!header.length) return "";
//   return cleanHtml(header.closest("table").text());
// }

// // SEO meta generator
// export function generateSEO(title: string, desc: string) {
//   const metaDescription = desc
//     .replace(/Rojgar\s*Result/gi, "")
//     .split(".")
//     .slice(0, 2)
//     .join(". ")
//     .substring(0, 160);

//   const keywords = [
//     title,
//     `${title} Online Form`,
//     `${title} Apply Now`,
//     `${title} Notification`,
//     "Sarkari Result",
//     "Govt Jobs 2025",
//   ].join(", ");

//   return {
//     metaTitle: `${title} - Apply Online for Latest Govt Job`,
//     metaDescription,
//     keywords,
//   };
// }

// // Parse full article
// export async function parseFullArticleSections(url: string) {
//   try {
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     const description = cleanHtml($("article").text() || $("body").text());
//     const importantDates = extractKeyValueList($, "Important Dates");
//     const applicationFee = extractKeyValueList($, "Application Fee");
//     const eligibility = extractTextSection($, "Eligibility") || extractTextSection($, "Qualification");
//     const ageLimit = extractTextSection($, "Age Limit");
//     const howToApply = extractTextSection($, "How to Apply") || extractTextSection($, "How to Fill Form");
//     const links = extractLinks($);
//     const seo = generateSEO($("title").text(), description);

//     return {
//       importantDates,
//       applicationFee,
//       eligibility,
//       ageLimit,
//       howToApply,
//       links,
//       description,
//       seo,
//     };
//   } catch (err) {
//     console.error("❌ parseFullArticleSections error:", err);
//     return {
//       importantDates: {},
//       applicationFee: {},
//       eligibility: "",
//       ageLimit: "",
//       howToApply: "",
//       links: {},
//       description: "",
//       seo: {},
//     };
//   }
// }


// utils/helper.ts
import sanitizeHtml from "sanitize-html";

/**
 * Clean and rewrite RSS content uniquely
 */
export function cleanAndRewriteContent(html: string): string {
  // remove unwanted tags, inline styles, and source names
  let text = sanitizeHtml(html, {
    allowedTags: ["b", "strong", "i", "ul", "ol", "li", "br", "p", "a"],
    allowedAttributes: { a: ["href", "title"] },
  });

  // remove site references (rojgarresult, sarkariresult, etc.)
  text = text
    .replace(/Rojgar\s*Result/gi, "")
    .replace(/Sarkari\s*Result/gi, "")
    .replace(/rojgarresult\.com(\.cm)?/gi, "")
    .replace(/sarkariresult\.com(\.cm)?/gi, "");

  // make content unique (basic rewrite)
  text = text
    .replace(/Apply Online/gi, "Submit Your Application Online")
    .replace(/Download Admit Card/gi, "Get Your Hall Ticket Now")
    .replace(/Check Result/gi, "View the Latest Result Update")
    .replace(/Notification/gi, "Official Notice")
    .replace(/\bRecruitment\b/gi, "Job Opening");

  return text.trim();
}

/**
 * Generate SEO fields automatically
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
