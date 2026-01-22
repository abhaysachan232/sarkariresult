import { NextResponse } from "next/server";
import article from "../../public/articles.json";

export const runtime = "nodejs";

type Job = {
  title: string;
  updatedon: string;
  setPath: string;
  organization: string;
};
type art = {
  title: string;
  updatedAt: string;
  slug?: string;
  organization: string;
};



export async function GET() {
  try {


    const Articl: art[] = (article as any[]).map((job) => ({
      title: job.title,
      updatedAt: new Date().toISOString(),
      slug: job.slug,
      organization: job.organization,
    }));

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://education.education.sarkariresult.rest</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>
       <url>
      <loc>http://education.education.sarkariresult.rest</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>




 

  ${Articl.map((job) => {
    const lastmod = new Date(job.updatedAt).toISOString().split("T")[0];
    return `
    <url>
      <loc>https://education.education.sarkariresult.rest/article/${job.slug}</loc>
      <lastmod>${lastmod}</lastmod>
    </url>`;
  }).join("")}

  ${[
    "about",
    "contact",
    "disclaimer",
    "faq",
    "privacy-policy",
    "terms-conditions",
  ]
    .map(
      (page) => `
    <url>
      <loc>https://education.education.sarkariresult.rest/${page}</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <priority>0.8</priority>
    </url>`
    )
    .join("")}

</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
