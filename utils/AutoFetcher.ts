import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import {
  cleanAndRewriteContent,
  generateSEO,
  extractLists,
  detectState,
} from "./helpers";

const parser = new Parser();

export async function fetchAndAppendJobs() {
  const feedUrls = ["https://www.rojgarresult.com/feed/"];
  const jobsFile = path.join(process.cwd(), "public", "jobs.json");

  const currentData = fs.existsSync(jobsFile)
    ? JSON.parse(fs.readFileSync(jobsFile, "utf-8"))
    : [];
console.log(currentData);

  for (const url of feedUrls) {
    console.log(url);
    
    const feed = await parser.parseURL(url);
// console.log(feed);

    for (const item of feed.items) {
      const setPath = new URL(item.link!).pathname.replace(/\//g, "");
      if (currentData.some((j: any) => j.setPath === setPath)) continue;

      const cleanDesc = cleanAndRewriteContent(
        item.contentSnippet || item.content || ""
      );


      const { importantDates, applicationFee, links } = extractLists(
        item.content || ""
      );

      const seo = generateSEO(item.title || "", cleanDesc);
      const jobLocation = detectState(cleanDesc);

      currentData.push({
            id: currentData.length + 1,
            title: item.title || "Untitled",
            setPath,
            organization: "To be detected",
            date: new Date(item.pubDate || Date.now())
              .toISOString()
              .split("T")[0],
            location: jobLocation,
            state:jobLocation,
            type: "recruitment",
            category: "job",
            year: new Date().getFullYear(),
            Type: "Sarkari Result",
            description: cleanDesc,
            importantDates,
            eligibility: "", // currently not in feed
            applicationFee,
            image: "/default-job.png",
            jobLocation,
            howToApply: "",
            links,
            seo,
    
            updatedon: new Date().toISOString().split("T")[0],
          });
    }
  }

  fs.writeFileSync(jobsFile, JSON.stringify(currentData, null, 2), "utf-8");
  return { success: true, added: currentData.length };
}
