// "use client";
// import React, { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import dataJson from "../../../public/articles.json";
import Link from "next/link";
// import { useParams } from "next/navigation";

// ✅ Types
interface TableProps {
  headers: string[];
  rows: string[][];
}

interface Section {
  heading: string;
  body: string;
  table?: {
    headers: string[];
    rows: string[][];
  };
}

interface Article {
  slug: string;
  title: string;
  description: string;
  keywords?: string;
  datePublished: string;
  dateModified: string;
  image: string;
  content: Section[];
  apply: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  type JobType = { /* ...same as before... */ [key: string]: any };

  const jobs: JobType[] = dataJson.map((job: any) => ({
    ...job,
    applicationFee: job.applicationFee
      ? Object.fromEntries(
          Object.entries(job.applicationFee).map(([k, v]) => [k, String(v)])
        )
      : undefined,
  }));
  const job = jobs.find((j) => j.slug === slug);
  if (!job) return { title: "Job Not Found" };

  return {
    title: `${job.title}`,
    description: job.description,
    keywords: `${job.title}, ${job.category}, ${job.organization}, Sarkari Naukri, Sarkari Result, Government Jobs`,
    alternates: { canonical: `https://sarkariresult.rest/article/${slug}` },
    openGraph: {
      title: job.title,
      description: job.description,
      url: `https://sarkariresult.rest/article/${slug}`,
      type: "article",
      images: [
        {
          url: job.image || "https://example.com/default-image.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: job.title,
      description: job.description,
      images: [job.image || "https://example.com/default-image.png"],
    },
  };
}




const Table: React.FC<TableProps> = ({ headers, rows }) => (
  <div className="overflow-x-auto my-4">
    <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead className="bg-blue-100">
        <tr>
          {headers.map((header, idx) => (
            <th key={idx} className="border px-4 py-2 text-left font-semibold text-blue-800">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr
            key={idx}
            className={`${idx % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-200 transition-colors`}
          >
            {row.map((cell, i) => (
              <td key={i} className="border px-4 py-2">
                <span dangerouslySetInnerHTML={{ __html: cell }} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // const params = useParams();
   const { slug } = await params;
  // const resolvedParams = await params;
  // const slug = resolvedParams.slug;

  const article = (dataJson as Article[]).find((art) => art.slug === slug);

  // useEffect(() => {
  //   if (article?.title) {
  //     document.title = `${article.title} | Sarkari Result`;
  //     const metaDesc = document.querySelector("meta[name='description']");
  //     if (metaDesc) metaDesc.setAttribute("content", article.description);
  //   }
  // }, [article]);

  if (!article)
    return <p className="text-center mt-10 text-red-500">Article not found</p>;

  const combinedSchema = [
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "description": article.description,
      "image": [article.image],
      "datePublished": article.datePublished,
      "dateModified": article.dateModified,
      "author": {
        "@type": "Person",
        "name": "Abhay Sachan",
        "url": "https://sarkariresult.rest",
      },
      "publisher": {
        "@type": "Organization",
        "name": "Sarkari Result",
        "logo": {
          "@type": "ImageObject",
          "url": "https://sarkariresult.rest/logo.png",
        },
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://sarkariresult.rest/article/${article.slug}`,
      },
      "articleSection": "Government Jobs",
      "keywords": article.keywords || "Sarkari Result, Government Jobs, Sarkari Naukri",
      "inLanguage": "en-IN",
      "isAccessibleForFree": true,
    },
    {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": article.title,
      "description": article.description,
      "datePosted": article.datePublished,
      "validThrough": "2026-12-31",
      "employmentType": "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "Government of India",
        "sameAs": "https://www.india.gov.in/",
        "logo": article.image,
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "India",
          "addressCountry": "IN",
        },
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": 21700,
          "maxValue": 69100,
          "unitText": "MONTH",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://sarkariresult.rest/",
        },       
        {
          "@type": "ListItem",
          "position": 2,
          "name": article.title,
          "item": `https://sarkariresult.rest/article/${article.slug}`,
        },
      ],
    },
  ];

  const lastSections = article.content.slice(-3);

  return (
    <>
      {/* ✅ Combined structured data (NewsArticle + JobPosting + BreadcrumbList) */}
      <Script
        id="combined-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedSchema),
        }}
      />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            {article.title}
          </h1>
          <p className="text-gray-700 text-lg md:text-xl">{article.description}</p>
          <Link
            href={article.apply}
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Apply Now
          </Link>
        </div>

        {article.content.map((section: Section, idx: number) => (
          <section
            key={idx}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold mb-3 text-blue-800">
              {section.heading}
            </h2>
            <p className="mb-4 whitespace-pre-line text-gray-800">
              {section.body}
            </p>
            {section.table && (
              <Table headers={section.table.headers} rows={section.table.rows} />
            )}
          </section>
        ))}

        {lastSections.length > 0 && (
          <div className="bg-blue-50 p-6 rounded-lg space-y-4">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              Key Highlights
            </h2>
            {lastSections.map((sec: Section, idx: number) => (
              <div key={idx}>
                <h3 className="font-semibold text-blue-800">{sec.heading}</h3>
                <p className="text-gray-700 whitespace-pre-line">{sec.body}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-gray-100 p-6 rounded-lg space-y-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Related Articles
          </h2>
          {(dataJson as Article[])
            .filter((art) => art.slug !== article.slug)
            .slice(0, 5)
            .map((art) => (
              <Link
                key={art.slug}
                href={`/article/${art.slug}`}
                className="text-blue-700 hover:underline block"
              >
                {art.title}
              </Link>
            ))}
        </div>

        <p className="text-sm text-gray-500 text-center mt-8">
          Published on: {article.datePublished} | Last Updated:{" "}
          {article.dateModified}
        </p>
      </main>
    </>
  );
}
