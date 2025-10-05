// app/delhi-police-recruitment-2025/[slug]/page.tsx
import React from "react";
import Script from "next/script";
import data from "../../../public/articles.json";
import Link from "next/link";

interface Section {
  heading: string;
  body: string;
  table?: { headers: string[]; rows: string[][] };
  internalLinks?: { text: string; slug: string }[];
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

interface PageProps {
  params: { slug: string };
}

const Page = ({ params }: PageProps) => {
  const article = data.find((a: Article) => a.slug === params.slug);

  if (!article) return <p>Article not found</p>;

  const Table: React.FC<{ headers: string[]; rows: string[][] }> = ({
    headers,
    rows,
  }) => (
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
            <tr key={idx} className={`${idx % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-200 transition-colors`}>
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
      value: { "@type": "QuantitativeValue", minValue: 21700, maxValue: 69100, unitText: "MONTH" },
    },
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <Script
        id="job-posting-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />

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

      {article.content.map((section, idx) => (
        <section key={idx} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-3 text-blue-800">{section.heading}</h2>
          <p className="mb-4 whitespace-pre-line text-gray-800">{section.body}</p>
          {section.table && <Table headers={section.table.headers} rows={section.table.rows} />}
         {section.internalLinks && <h4 className="mt-4 font-semibold text-blue-700">Related Links:</h4>}
          {section.internalLinks &&
            section.internalLinks.map((link, i) => (              
              <Link key={i} href={`${link.slug}`} className="text-blue-600 underline mr-4">
                {link.text}
              </Link>
            ))}
        </section>
      ))}

      <p className="text-sm text-gray-500 text-center mt-8">
        Published on: {article.datePublished} | Last Updated: {article.dateModified}
      </p>
    </main>
  );
};

export default Page;
