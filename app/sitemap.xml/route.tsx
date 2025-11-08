import { NextResponse } from 'next/server';
import datas from '../../public/jobs.json';
import article from '../../public/articles.json';

export const runtime = 'nodejs';

type Job = {
  title: string;
  updatedon: string;
  setpath:string;
};
type art = {
  title: string;
  updatedAt: string;
  slug?:string;
};

const menuItems = [
  { name: "Home", href: "/", target: '' },
  { name: "Latest Jobs", href: "/latest-jobs", target: '_blank' },
  { name: "Results", href: "/results", target: '_blank' },
  { name: "Admit Card", href: "/admit-card", target: '_blank' },
  { name: "Answer Key", href: "/answer-key", target: '_blank' },
  { name: "Syllabus", href: "/syllabus", target: '_blank' },
  { name: "Admission", href: "/admission", target: '_blank' },
  { name: "Certificate Verification", href: "/certificate-verification", target: '_blank' },
  { name: "Important", href: "/important", target: '_blank' },
];

const STATE_LINKS = [
  { name: "UP Govt Jobs", slug: "/state/uttar-pradesh" },
  { name: "Bihar Govt Jobs", slug: "/state/bihar" },
  { name: "MP Govt Jobs", slug: "/state/madhya-pradesh" },
  { name: "Rajasthan Govt Jobs", slug: "/state/rajasthan" },
  { name: "Delhi Govt Jobs", slug: "/state/delhi" },
  { name: "Haryana Govt Jobs", slug: "/state/haryana" },
  { name: "Jharkhand Govt Jobs", slug: "/state/jharkhand" },
  { name: "Punjab Govt Jobs", slug: "/state/punjab" },
  { name: "Gujarat Govt Jobs", slug: "/state/gujarat" },
  { name: "Maharashtra Govt Jobs", slug: "/state/maharashtra" },
];

export async function GET() {
  try {
    const jobs: Job[] = (datas as any[]).map((job) => ({
      title: job.title,
      updatedon: job.updatedon || new Date().toISOString(),
    }));

    const Articl: art[] = (article as any[]).map((job) => ({
      title: job.title,
      updatedAt: new Date().toISOString(),
      slug: job.slug
    }));

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://sarkariresult.rest</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>
       <url>
      <loc>http://sarkariresult.rest</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>
  ${menuItems
    .map(
      (item) => `
    <url>
      <loc>https://sarkariresult.rest${item.href}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.9</priority>
    </url>`
    )
    .join('')}

  ${STATE_LINKS
    .map(
      (state) => `
    <url>
      <loc>https://sarkariresult.rest${state.slug}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.85</priority>
    </url>`
    )
    .join('')}

  ${jobs
    .map(
      (job) => {
        const lastmod = new Date(job.updatedon).toISOString().split('T')[0];
        return `
    <url>
      <loc>https://sarkariresult.rest/jobs/${job.setpath.split(" ").join("-")}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.9</priority>
    </url>`;
      }
    )
    .join('')}

  ${Articl
    .map(
      (job) => {
        const lastmod = new Date(job.updatedAt).toISOString().split('T')[0];
        return `
    <url>
      <loc>https://sarkariresult.rest/article/${job.slug}</loc>
      <lastmod>${lastmod}</lastmod>
    </url>`;
      }
    )
    .join('')}

  ${["about", "contact", "disclaimer", "faq", "privacy-policy","terms-conditions"]
    .map(
      (page) => `
    <url>
      <loc>https://sarkariresult.rest/${page}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <priority>0.8</priority>
    </url>`
    )
    .join('')}

</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
