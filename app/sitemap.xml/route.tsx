import { NextResponse } from 'next/server';
import datas from '../../public/jobs.json';
import article from '../../public/articles.json';

export const runtime = 'nodejs';

type Job = {
  title: string;
  updatedon: string;
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

export async function GET() {
  try {
    const jobs: Job[] = (datas as any[]).map((job) => ({
          title: job.title,
          updatedon: job.updatedon || new Date().toISOString(),
        }));
console.log(jobs);
const Articl: art[] = (article as any[]).map((job) => ({
      title: job.title,
      updatedAt: new Date().toISOString(),
      slug: job.slug
    }));

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${menuItems
    .map(
      (item) => `
    <url>
      <loc>https://sarkariresult.rest${item.href}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    </url>
  `
    )
    .join('')}

  ${jobs
    .map(
      (job) => {
        const lastmod = new Date(job.updatedon).toISOString().split('T')[0];
        return `
    <url>
      <loc>https://sarkariresult.rest/jobs/${job.title.split(" ").join("-")}</loc>
      <lastmod>${lastmod}</lastmod>
    </url>
  `;
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
    </url>
  `;
      }
    )
    .join('')}
  ${["about", "contact", "disclaimer", "faq", "privacy","terms"]
    .map(
      (page) => `
    <url>
      <loc>https://sarkariresult.rest/${page}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    </url>
  `
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
