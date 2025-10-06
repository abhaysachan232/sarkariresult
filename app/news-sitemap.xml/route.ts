import { NextResponse } from "next/server";
import jobs from "../../public/jobs.json";
import Articles from"../../public/articles.json";

export const runtime = "nodejs";

type Job = {
  title: string;
  updatedon?: string;
  setPath?: string;
};

type Articles = {
  title: string;
  datePublished?: string;
  slug?: string;
};

export async function GET() {
  try {
    const now = Date.now();
console.log(Articles);

    const recentJobs = (jobs as Job[])
      .filter((a) => {
        if (!a.updatedon) return false;
        const d = new Date(a.updatedon);
        // Check if updated within 48 hours
        return now - d.getTime() < 48 * 60 * 60 * 1000;
      })
      .map((a) => {
        const slug =
          a.title.split(" ").join("-");
        const pubDate = new Date(a.updatedon || new Date()).toISOString();
        const title = a.title?.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `
  <url>
    <loc>https://sarkariresult.rest/jobs/${slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Sarkari Result</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
      })
      .join("");



    const recentArticles = (Articles as Articles[])
      .filter((a) => {
        if (!a.datePublished) return false;
        const d = new Date(a.datePublished);
        // Check if updated within 48 hours
        return now - d.getTime() < 48 * 60 * 60 * 1000;
      })
      .map((a) => {
        const slug =
          a.slug ;
        const pubDate = new Date(a.datePublished || new Date()).toISOString();
        const title = a.title?.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `
  <url>
    <loc>https://sarkariresult.rest/article/${slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Sarkari Result</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${recentJobs || ""}
${recentArticles || ""}
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (err) {
    console.error("Error generating news sitemap:", err);
    return new NextResponse("Error generating news sitemap", { status: 500 });
  }
}
