// import { NextResponse } from "next/server";
// import Parser from "rss-parser";
// import * as cheerio from "cheerio";
// import fs from "fs";
// import path from "path";
// import { cleanHtml, extractTableData, generateSEO } from "@/utils/helpers";

// export async function GET() {
//   try {
//     const parser = new Parser();
//     const feed = await parser.parseURL("https://www.rojgarresult.com/rss.php");

//     const jobsFile = path.join(process.cwd(), "public", "jobs.json");
//     const existingData = fs.existsSync(jobsFile)
//       ? JSON.parse(fs.readFileSync(jobsFile, "utf-8"))
//       : [];

//     const updated = [];

//     for (const item of feed.items || []) {
//       const $ = cheerio.load(item["content:encoded"] || "");
//       const title = item.title?.trim() || "";
//       const link = item.link || "";
//       const date = $("li:contains('Post Date') strong").last().text().trim() || "";
//       const description = cleanHtml($.root().text());

//       // Remove RojgarResult.com links
//       $("a").each((_, a) => {
//         const href = $(a).attr("href");
//         if (href?.includes("rojgarresult.com")) $(a).removeAttr("href").text($(a).text());
//       });

//       // Extract structured data from tables
//       const importantDates = extractTableData($, "Important Dates");
//       const applicationFee = extractTableData($, "Application Fee");
//       const ageLimit = extractTableData($, "Age Limit");
//       const eligibility = extractTableData($, "Eligibility");
//       const howToApply = extractTableData($, "How to Apply");
//       const importantLinks = extractTableData($, "Important Links");

//       const stateMatches = description.match(/\b(Uttar Pradesh|Madhya Pradesh|Bihar|Rajasthan|Delhi|Haryana|Punjab|Gujarat|Jharkhand|Chhattisgarh|Maharashtra)\b/i);
//       const location = stateMatches ? stateMatches[0] + ", India" : "India";

//       const seo = generateSEO(title, description);

//       const jobData = {
//         title,
//         setPath: title.toLowerCase().replace(/[^\w]+/g, "-"),
//         organization: $("td:contains('Organization')").next().text().trim() || "Not Specified",
//         date,
//         location,
//         type: "job",
//         category: "job",
//         description,
//         importantDates,
//         applicationFee,
//         ageLimit,
//         eligibility,
//         howToApply,
//         links: importantLinks,
//         seo,
//         updatedon: new Date().toISOString().split("T")[0],
//       };

//       updated.push(jobData);
//     }

//     fs.writeFileSync(jobsFile, JSON.stringify(updated, null, 2));
//     return NextResponse.json({ success: true, count: updated.length });
//   } catch (err: any) {
//     return NextResponse.json({ success: false, error: err.toString() });
//   }
// }


// app/api/rss/route.ts
import { NextResponse } from "next/server";
import { fetchAndAppendJobs } from "@/utils/AutoFetcher";

export async function GET() {
  try {
    const result = await fetchAndAppendJobs();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
