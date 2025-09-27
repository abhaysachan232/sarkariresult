import { NextResponse } from 'next/server';
import datas from '../../public/jobs.json';

export const runtime = 'nodejs';

type Job = {
  title: string;
  updatedAt: string;
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
      updatedAt: job.updatedAt || job.date || new Date().toISOString(),
    }));

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${menuItems
    .map(
      (item) => `
    <url>
      <loc>https://sarkariresult.rest${item.href}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
  `
    )
    .join('')}
  ${jobs
    .map(
      (job) => `
    <url>
      <loc>https://sarkariresult.rest/jobs/${job.title.split(" ").join("-")}</loc>
      <lastmod>${job.updatedAt}</lastmod>
    </url>
  `
    )
    .join('')}

     ${["about", "contact", "disclaimer", "faq", "privacy","terms"]
    .map(
      (job) => `
    <url>
      <loc>https://sarkariresult.rest/${job}</loc>
      <lastmod>${job}</lastmod>
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
