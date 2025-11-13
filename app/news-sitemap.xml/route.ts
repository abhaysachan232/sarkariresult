import { NextResponse } from "next/server";
import jobs from "../../public/jobs.json";
import articles from "../../public/articles.json";

export const runtime = "nodejs";

type Job = {
  title: string;
  updatedon?: string;
  setPath: string;
  organization: string;
};

type Article = {
  title: string;
  datePublished?: string;
  slug?: string;
  publisher: string;
};

export async function GET() {
  try {
    const now = Date.now();

    const sanitize = (text: string) =>
      text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const recentJobsXml = (jobs as Job[])
      .filter((j) => j.updatedon && now - new Date(j.updatedon).getTime() < 48 * 60 * 60 * 1000)
      .map((j) => {
        const slug = j.setPath.split(" ").join("-");
        const pubDate = new Date(j.updatedon!).toISOString();
        const title = sanitize(j.title);
        const organization = j.organization;
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
              <image:image>
  <image:loc>${`https://sarkariresult.rest/api/og?title=${encodeURIComponent(
    title
  )}&footerText=${encodeURIComponent(
    organization
  )}&type=minimal`}</image:loc>
  <image:caption>${title}</image:caption>
</image:image>
  </url>`;
      })
      .join("");

    const recentArticlesXml = (articles as Article[])
      .filter(
        (a) =>
          a.datePublished &&
          a.slug &&
          now - new Date(a.datePublished).getTime() < 48 * 60 * 60 * 1000
      )
      .map((a) => {
        const pubDate = new Date(a.datePublished!).toISOString();
        const title = sanitize(a.title);
        const org = a.publisher;
        return `
  <url>
    <loc>https://sarkariresult.rest/article/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Sarkari Result</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
          <image:image>
  <image:loc>${`https://sarkariresult.rest/api/og?title=${encodeURIComponent(
    title
  )}&footerText=${encodeURIComponent(
    org
  )}&type=minimal`}</image:loc>
  <image:caption>${title}</image:caption>
</image:image>
  </url>`;
      })
      .join("");

    // Combine both XMLs
    const combinedXml = recentJobsXml + recentArticlesXml;

    // Fallback if nothing available
    const fallback = combinedXml ? "" : `<url><loc>https://sarkariresult.rest/</loc></url>`;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${combinedXml}
  ${fallback}
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  } catch (err) {
    console.error("Error generating news sitemap:", err);
    return new NextResponse("Error generating news sitemap", { status: 500 });
  }
}
