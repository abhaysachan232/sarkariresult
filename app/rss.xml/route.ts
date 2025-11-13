import { NextResponse } from "next/server";
import datas from "../../public/jobs.json";
import articles from "../../public/articles.json";

export const runtime = "nodejs";

type Job = {
  title: string;
  updatedon: string;
  setPath: string;
  description?: string;
};

type Article = {
  title: string;
  updatedAt: string;
  slug: string;
  description?: string;
};

export async function GET() {
  try {
    const siteUrl = "https://sarkariresult.rest";

    // Clean HTML tags from description
    const cleanText = (str: string = "") =>
      str.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();

    const jobs: Job[] = (datas as any[]).map((job) => ({
      title: cleanText(job.title),
      updatedon: job.updatedon || new Date().toISOString(),
      setPath: job.setPath,
      description: cleanText(job.description || job.title),
    }));

    const articleData: Article[] = (articles as any[]).map((a) => ({
      title: cleanText(a.title),
      updatedAt: a.updatedAt || new Date().toISOString(),
      slug: a.slug,
      description: cleanText(a.description || a.title),
    }));

    // Generate RSS feed
    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sarkari Result - Latest Govt Jobs, Admit Cards, Results</title>
    <link>${siteUrl}</link>
    <description>Get all Sarkari Result updates, latest jobs, admit cards, and exam results.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />

    ${jobs
      .map(
        (job) => `
      <item>
        <title><![CDATA[${job.title}]]></title>
        <link>${siteUrl}/jobs/${job.setPath
          .split(" ")
          .join("-")
          .toLowerCase()}</link>
        <description><![CDATA[${job.description}]]></description>
        <pubDate>${new Date(job.updatedon).toUTCString()}</pubDate>
        <guid>${siteUrl}/jobs/${job.setPath
          .split(" ")
          .join("-")
          .toLowerCase()}</guid>
      </item>`
      )
      .join("")}

    ${articleData
      .map(
        (art) => `
      <item>
        <title><![CDATA[${art.title}]]></title>
        <link>${siteUrl}/article/${art.slug}</link>
        <description><![CDATA[${art.description}]]></description>
        <pubDate>${new Date(art.updatedAt).toUTCString()}</pubDate>
        <guid>${siteUrl}/article/${art.slug}</guid>
      </item>`
      )
      .join("")}

  </channel>
</rss>`;

    return new NextResponse(rssFeed, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("RSS Feed Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
