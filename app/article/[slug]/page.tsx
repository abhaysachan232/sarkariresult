"use client";
import React, { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import dataJson from "../../../public/articles.json";
import Link from "next/link";
import { useParams } from "next/navigation";

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

export default function Page() {
  const params = useParams();
  const slug = params?.slug as string;

  const article = (dataJson as Article[]).find((art) => art.slug === slug);

  useEffect(() => {
    if (article?.title) {
      document.title = `${article.title} | Sarkari Result`;
      const metaDesc = document.querySelector("meta[name='description']");
      if (metaDesc) metaDesc.setAttribute("content", article.description);
    }
  }, [article]);

  if (!article) return <p className="text-center mt-10 text-red-500">Article not found</p>;

  const newsSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: [article.image],
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: { "@type": "Person", name: "Abhay Sachan", url: "https://sarkariresult.rest" },
    publisher: {
      "@type": "Organization",
      name: "Sarkari Result",
      logo: { "@type": "ImageObject", url: "https://sarkariresult.rest/logo.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://sarkariresult.rest/article/${article.slug}` },
  };

  const lastSections = article.content.slice(-3);

  return (
    <>
      <Head>
        <meta name="description" content={article.description} />
        <meta name="keywords" content={article.keywords || "Sarkari Naukri, Government Jobs"} />
        <link rel="canonical" href={`https://sarkariresult.rest/article/${article.slug}`} />
      </Head>

      <Script
        id="news-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }}
      />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">{article.title}</h1>
          <p className="text-gray-700 text-lg md:text-xl">{article.description}</p>
          <Link
            href={article.apply}
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Apply Now
          </Link>
        </div>

        {/* ✅ Section typed properly */}
        {article.content.map((section: Section, idx: number) => (
          <section key={idx} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-3 text-blue-800">{section.heading}</h2>
            <p className="mb-4 whitespace-pre-line text-gray-800">{section.body}</p>
            {section.table && <Table headers={section.table.headers} rows={section.table.rows} />}
          </section>
        ))}

        {lastSections.length > 0 && (
          <div className="bg-blue-50 p-6 rounded-lg space-y-4">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Key Highlights</h2>
            {lastSections.map((sec: Section, idx: number) => (
              <div key={idx}>
                <h3 className="font-semibold text-blue-800">{sec.heading}</h3>
                <p className="text-gray-700 whitespace-pre-line">{sec.body}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-gray-100 p-6 rounded-lg space-y-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Articles</h2>
          {(dataJson as Article[])
            .filter((art) => art.slug !== article.slug)
            .slice(0, 5)
            .map((art) => (
              <Link key={art.slug} href={`/article/${art.slug}`} className="text-blue-700 hover:underline block">
                {art.title}
              </Link>
            ))}
        </div>

        <p className="text-sm text-gray-500 text-center mt-8">
          Published on: {article.datePublished} | Last Updated: {article.dateModified}
        </p>
      </main>
    </>
  );
}
