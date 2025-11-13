// import fs from "fs";
// import path from "path";
// import { fetchRojgarResultRSS, parseFullArticleSections } from "./helpers";

// export async function AutoFetcher() {
//   try {
//     const filePath = path.join(process.cwd(), "public", "jobs.json");
//     let existingData: any[] = [];

//     if (fs.existsSync(filePath)) {
//       existingData = JSON.parse(fs.readFileSync(filePath, "utf8"));
//     }

//     const rssItems = await fetchRojgarResultRSS();
//     const newJobs: any[] = [];

//     for (const item of rssItems) {
//       if (!item.title) continue;
//       if (!item.link) continue;

//       const slug = item.title
//         .toLowerCase()
//         .replace(/[^\w\s]/gi, "")
//         .trim()
//         .replace(/\s+/g, "-");

//       const {
//         importantDates,
//         applicationFee,
//         links,
//         eligibility,
//         ageLimit,
//         howToApply,
//         description,
//         seo,
//       } = await parseFullArticleSections(item.link);

//       const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();

//       const newJob = {
//         id: existingData.length ? existingData[0].id + 1 : 1,
//         title: item.title,
//         setPath: slug,
//         organization: "Various Departments",
//         date: publishedAt.toISOString().split("T")[0],
//         location: "India",
//         type: "job",
//         category: "latest",
//         year: new Date().getFullYear(),
//         Type: "Sarkari Result",
//         description,
//         importantDates,
//         applicationFee,
//         eligibility,
//         ageLimit,
//         howToApply,
//         links,
//         seo,
//         updatedon: new Date().toISOString().split("T")[0],
//       };

//       newJobs.push(newJob);
//     }

//     const merged = [
//       ...newJobs.filter((n) => !existingData.some((e) => e.title === n.title)),
//       ...existingData,
//     ];

//     fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
//     console.log("✅ jobs.json updated successfully");
//   } catch (error) {
//     console.error("❌ AutoFetcher error:", error);
//   }
// }

import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import { cleanAndRewriteContent, generateSEO } from "./helpers";

const parser = new Parser();

export async function fetchAndAppendJobs() {
  const feedUrls = [
    "https://www.rojgarresult.com/feed/",
  ];

  const jobsFile = path.join(process.cwd(), "public", "jobs.json");
  const currentData = fs.existsSync(jobsFile)
    ? JSON.parse(fs.readFileSync(jobsFile, "utf-8"))
    : [];

  for (const url of feedUrls) {
    const feed = await parser.parseURL(url);

    for (const item of feed.items) {
      const exists = currentData.some(
        (j: any) => j.setPath === new URL(item.link!).pathname.replace(/\//g, "")
      );
      if (exists) continue;

      // Clean and rewrite description
      const cleanDesc = cleanAndRewriteContent(item.contentSnippet || item.content || "");

      // Generate SEO
      const seo = generateSEO(item.title || "", cleanDesc);

      const newJob = {
        id: currentData.length + 1,
        title: item.title || "Untitled",
        setPath: new URL(item.link!).pathname.replace(/\//g, ""),
        organization: "To be detected",
        date: new Date(item.pubDate || Date.now()).toISOString().split("T")[0],
        location: "India",
        type: "recruitment",
        category: "job",
        year: new Date().getFullYear(),
        Type: "Sarkari Result",
        description: cleanDesc,
        importantDates: {},
        eligibility: "",
        applicationFee: {},
        image: "/default-job.png",
        jobLocation: "India",
        howToApply: "",
        links: { officialWebsite: item.link },
        seo,
        updatedon: new Date().toISOString().split("T")[0],
      };

      currentData.push(newJob);
    }
  }

  fs.writeFileSync(jobsFile, JSON.stringify(currentData, null, 2), "utf-8");
  return { success: true, added: currentData.length ,};
}


