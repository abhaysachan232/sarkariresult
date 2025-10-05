// app/article/[slug]/page.tsx
import React from "react";
import Script from "next/script";
import data from "../../../public/articles.json";
import Link from "next/link";

const Table: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => (
  <div className="overflow-x-auto my-4">
    <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead className="bg-blue-100">
        <tr>
          {headers.map((header, idx) => (
            <th
              key={idx}
              className="border px-4 py-2 text-left font-semibold text-blue-800"
            >
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
  datePublished: string;
  dateModified: string;
  image: string;
  content: Section[];
  apply: string;
}

interface Params {
  slug: string;
}

interface PageProps {
  params: Promise<Params>;
}

const Page = async ({ params }: PageProps) => {
  // await kar ke real object le rahe ho
  const { slug } = await params;

  // const article = data.find((art) => art.slug === slug);
  
  const article = data.find((art: Article) => art.slug === slug);
  console.log(article);
  

  if (!article) {
    return <p className="text-center mt-10 text-red-500">Article not found</p>;
  }

  const jobSchema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: article.title,
    description: article.description,
    datePosted: article.datePublished,
    validThrough: "2025-12-31",
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "Delhi Police",
      sameAs: "https://www.delhipolice.nic.in/",
      logo: article.image,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Delhi Police Headquarters",
        addressLocality: "New Delhi",
        postalCode: "110001",
        addressCountry: "IN",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        minValue: 21700,
        maxValue: 69100,
        unitText: "MONTH",
      },
    },
  };

  const lastSections = article.content.slice(-3);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* JSON-LD for SEO */}
      <Script
        id="job-posting-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />

      {/* Hero Section */}
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

      {/* Article Sections */}
      {article.content.map((section, idx) => (
        <section
          key={idx}
          className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-3 text-blue-800">{section.heading}</h2>
          <p className="mb-4 whitespace-pre-line text-gray-800">{section.body}</p>
          {section.table && <Table headers={section.table.headers} rows={section.table.rows} />}
        </section>
      ))}

      {/* Highlight Last 3 Sections */}
      {lastSections.length > 0 && (
        <div className="bg-blue-50 p-6 rounded-lg space-y-4">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Key Highlights</h2>
          {lastSections.map((sec, idx) => (
            <div key={idx}>
              <h3 className="font-semibold text-blue-800">{sec.heading}</h3>
              <p className="text-gray-700 whitespace-pre-line">{sec.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* Internal Links Section */}
      <div className="bg-gray-100 p-6 rounded-lg space-y-3">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Articles</h2>
        {data
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

      {/* Footer */}
      <p className="text-sm text-gray-500 text-center mt-8">
        Published on: {article.datePublished} | Last Updated: {article.dateModified}
      </p>
    </main>
  );
};

export default Page;
