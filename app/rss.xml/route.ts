import { NextResponse } from "next/server";
import datas from "../../public/jobs.json";
import articles from "../../public/articles.json";

export const runtime = "nodejs";

type Job = {
  title: string;
  updatedon: string;
  setPath: string;
  description:string;


};

type Article = {
  title: string;
  updatedAt: string;
  slug: string;
  description:string;
};

export async function GET() {
  try {
    const siteUrl = "https://sarkariresult.rest";

    const jobs: Job[] = (datas as any[]).map((job) => ({
      title: job.title,
      updatedon: job.updatedon || new Date().toISOString(),
      setPath: job.setPath,
      description:job.description,
    }));

    const arts: Article[] = (articles as any[]).map((a) => ({
      title: a.title,
      updatedAt: a.updatedAt || new Date().toISOString(),
      slug: a.slug,
      description:a.description,
    }));

    // 📰 Google News Compatible RSS
    const rssItems = [
      ...jobs.map(
        (job) => `
        <item>
          <title><![CDATA[${job.title}]]></title>
          <link>${siteUrl}/jobs/${job.setPath.split(" ").join("-")}</link>
          <guid>${siteUrl}/jobs/${job.setPath.split(" ").join("-")}</guid>
          <pubDate>${new Date(job.updatedon).toUTCString()}</pubDate>
          <description><![CDATA[${job.description}]]></description>
        </item>`
      ),
      ...arts.map(
        (art) => `
        <item>
          <title><![CDATA[${art.title}]]></title>
          <link>${siteUrl}/article/${art.slug}</link>
          <guid>${siteUrl}/article/${art.slug}</guid>
          <pubDate>${new Date(art.updatedAt).toUTCString()}</pubDate>
          <description><![CDATA[${art.description}]]></description>
        </item>`
      ),
    ].join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:g="http://base.google.com/ns/1.0"
     version="2.0">
  <channel>
    <title>Sarkari Result Rest</title>
    <link>${siteUrl}</link>
    <description>Latest Sarkari Result, Admit Card, and Job Updates</description>
    <language>en</language>
    <pubDate>${new Date().toUTCString()}</pubDate>
    ${rssItems}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
