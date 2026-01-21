// app/job/[slug]/page.tsx
import sanitizeHtml from "sanitize-html";
import Image from "next/image";
import FluidAd from "@/components/fluidad";
import InArticleAd from "@/components/inarticle";
import {
  Calendar,
  MapPin,
  FileText,
  UserCheck,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import datas from "../../../public/jobs.json";
import NotFound from "../../not-found";
import ShareButtons from "../../../components/sharebtn";
import JobFAQFooter from "../../../components/faq";
import { getShortTitle } from "@/components/utils/getShortTitle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  type JobType = { /* ...same as before... */ [key: string]: any };

  const jobs: JobType[] = datas.map((job: any) => ({
    ...job,
    applicationFee: job.applicationFee
      ? Object.fromEntries(
          Object.entries(job.applicationFee).map(([k, v]) => [k, String(v)]),
        )
      : undefined,
  }));
  const job = jobs.find((j) => j.setPath.split(" ").join("-") === slug);
  const shortTitle = getShortTitle(job?.title || "");



  if (!job) return { title: "Job Not Found" };

  return {
    title: job.id < 43 ? `${shortTitle}` : `${job.seo.metaTitle}`,
    description:
      job.id < 43 ? `${job.description}` : `${job.seo.metaDescription}`,
    keywords:
      job.id < 43
        ? `${job.title}, ${job.category}, ${job.organization}, Sarkari Naukri, Sarkari Result, Government Jobs`
        : `${job.seo.keywords}, Sarkari Naukri, Sarkari Result, Government Jobs`,
    alternates: { canonical: `https://sarkariresult.rest/jobs/${slug}` },
    openGraph: {
      title: job.title,
      description: job.description,
      url: `https://sarkariresult.rest/jobs/${slug}`,
      type: "article",
      images: [
        {
          url: `https://sarkariresult.rest/og/jobs/${job.slug}.webp`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: job.title,
      description: job.description,
      images: `https://sarkariresult.rest/og/jobs/${job.slug}.webp`,
    },
  };
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  type JobType = { /* ...same shape... */ [key: string]: any };

  // Map and normalize data
  const jobs: JobType[] = datas.map((job: any) => ({
    ...job,
    applicationFee: job.applicationFee
      ? Object.fromEntries(
          Object.entries(job.applicationFee).map(([k, v]) => [k, String(v)]),
        )
      : undefined,
  }));

  console.log(jobs, "abh");

  const job = jobs.find((j) => j.setPath.split(" ").join("-") === slug);
  if (!job) return NotFound();

  // --- Related jobs (2 before, 2 after) ---
  const currentIndex = jobs.findIndex((j) => j.id === job.id);
  const startIndex = Math.max(currentIndex - 2, 0);
  const endIndex = Math.min(currentIndex + 2, jobs.length - 1);
  const relatedJobs = jobs
    .slice(startIndex, endIndex + 1)
    .filter((j) => j.id !== job.id);
  // ---------- SANITIZE HTML STRINGS (server-side) ----------
  // Allowed tags/attributes: adjust to your needs.
  const sanitizeOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "br",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height"],
      a: ["href", "name", "target", "rel"],
    },
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
      a: ["http", "https", "mailto"],
    },
  };

  // sanitize fields that may contain HTML
  const safeDescription = job.description
    ? sanitizeHtml(String(job.description), sanitizeOptions)
    : "";
  const safeEligibility = job.eligibility
    ? sanitizeHtml(String(job.eligibility), sanitizeOptions)
    : "";
  const safeAge = job.age ? sanitizeHtml(String(job.age), sanitizeOptions) : "";
  const safeminimumAge = job.minimumAge ? sanitizeHtml(String(job.minimumAge), sanitizeOptions) : "";
  // If Post may include html formatting:
  const safePost = job.totalPost
    ? sanitizeHtml(String(job.totalPost), sanitizeOptions)
    : "";
  // For applicationFee we keep keys/values as plain text (no HTML expected) — but you can sanitize values if needed
  const safeApplicationFee = job.applicationFee
    ? Object.fromEntries(
        Object.entries(job.applicationFee).map(([k, v]) => [
          k,
          sanitizeHtml(String(v)),
        ]),
      )
    : undefined;

  const renderCellValue = (value: unknown): React.ReactNode => {
  if (Array.isArray(value)) {
    return (
      <ul className="list-disc ml-5">
        {value.map((v, i) => (
          <li key={i}>{String(v)}</li>
        ))}
      </ul>
    );
  }
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }
  return value ? String(value) : "";
};
  // Structured data schema: remove HTML tags from description for schema
  const jobPostingSchema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: sanitizeHtml(String(job.description || ""), {
      allowedTags: [],
      allowedAttributes: {},
    }),
    datePosted: job.date,
    validThrough: job.importantDates?.lastDate || null,
    author: {
      "@type": "Person",
      name: "Abhay Sachan",
      url: "https://sarkariresult.rest",
    },
    employmentType: job.type,
    hiringOrganization: {
      "@type": "Organization",
      name: job.organization,
      sameAs: job.links?.official || undefined,
      logo: job.image || undefined,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: job.streetAddress || "", // added
        addressLocality: job.addressLocality || "", // existing
        addressRegion: job.addressRegion || "", // added
        postalCode: job.postalCode || "", // added
        addressCountry: job.addressCountry || "IN", // added default to IN
      },
    },
    baseSalary: job.salary
      ? {
          "@type": "MonetaryAmount",
          currency: "INR",
          value: {
            "@type": "QuantitativeValue",
            value: Number(String(job.salary).replace(/[^0-9]/g, "")) || 0,
            unitText: "Monthly",
          },
        }
      : undefined,
    url: `https://sarkariresult.rest/jobs/${slug}`,
  };
  const newsSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: job.title,
    description: sanitizeHtml(String(job.description || ""), {
      allowedTags: [],
      allowedAttributes: {},
    }),
    image: [`https://sarkariresult.rest/og/jobs/${job.slug}.webp`],
    datePublished: job.date,
    dateModified: job.updatedon || job.date,
    author: {
      "@type": "Organization",
      name: "Sarkari Result",
    },
    publisher: {
      "@type": "Organization",
      name: "Sarkari Result",
      logo: {
        "@type": "ImageObject",
        url: "https://sarkariresult.rest/jobs-images/logo.png",
      },
    },
    mainEntityOfPage: `https://sarkariresult.rest/jobs/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([jobPostingSchema, newsSchema]),
        }}
      />

<article className="max-w-5xl mx-auto my-4 border border-gray-400 text-[16px] leading-relaxed">
   {/* ================= TOP HEADER ================= */}
      <table className="w-full border-collapse border border-gray-400 text-center">
        <tbody>
          <tr>
            <td className="p-3">
              <h1 className="text-fuchsia-600 font-bold text-xl">
                {job.organization}
              </h1>
              <h2 className="text-green-700 font-bold text-lg">
                {job.title}
              </h2>
              <p className="text-red-600 font-bold">
                {job.advtNo || "Short Details of Notification"}
              </p>
              <p className="text-red-700 font-bold">
                WWW.SARKARIRESULT.REST
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ================= TOP AD ================= */}
      <div className="my-3 text-center">
        <FluidAd />
      </div>

      {/* ================= BASIC INFO ================= */}
      <table className="w-full border-collapse border border-gray-400">
        <tbody>
          <tr>
            <td className="p-3">
              <p className="text-red-600 font-bold">
                Post Date : {job.date}
              </p>

              <p className="mt-2">
                <b className="text-blue-700">{job.organization}</b> has released
                notification for <b>{job.title}</b>. Total Posts :
                <b className="text-green-700">
                  <span dangerouslySetInnerHTML={{ __html:safePost? `${safePost } post`:''}} />
                </b>
              </p>

              <p className="mt-2">
                Online Apply Start :
                <b> {job.importantDates?.["Apply Start"]}</b> |
                Last Date :
                <b className="text-red-600">
                  {" "}
                  {job.importantDates?.["Last Date to Apply"]}
                </b>
              </p>

              <p className="mt-2">
                <b>Minimum Age Required :</b>{" "}
                <span dangerouslySetInnerHTML={{ __html: safeminimumAge }} />
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ================= IN ARTICLE AD ================= */}
      <div className="my-4">
        <InArticleAd />
      </div>

      {/* ================= IMPORTANT DATES + FEE ================= */}
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="bg-[#6b0033] text-white border p-2 w-1/2">
              Important Dates
            </th>
            <th className="bg-[#6b0033] text-white border p-2 w-1/2">
              Application Fee
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="align-top p-3 border">
              <ul className="list-disc ml-5 space-y-1">
                {Object.entries(job.importantDates || {}).map(([k, v]) => (
                  <li key={k}>
                    <b>{k}</b> : {String(v)}
                  </li>
                ))}
              </ul>
            </td>

            <td className="align-top p-3 border">
              {job.applicationFee ? (
                <ul className="list-disc ml-5 space-y-1">
                  {Object.entries(job.applicationFee).map(([k, v]) => (
                    <li key={k}>
                      <b>{k}</b> : {String(v)}
                    </li>
                  ))}
                </ul>
              ) : (
                "No Fee"
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="my-4 text-center">
        <FluidAd />
      </div>

      {/* ================= AGE + TOTAL POST ================= */}
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="bg-green-700 text-white border p-2 w-3/4">
              Age Limit (As on Cutoff Date)
            </th>
            <th className="bg-orange-600 text-white border p-2 w-1/4">
              Total Post
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 border">
              <ul className="list-disc ml-5">
                <li dangerouslySetInnerHTML={{ __html: safeAge }} />
                <li>Age Relaxation As Per Rules</li>
              </ul>
            </td>
            <td className="p-3 border text-center font-bold text-xl">
              <span dangerouslySetInnerHTML={{ __html:safePost? `${safePost } post`:''}} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* ================= POST WISE VACANCY ================= */}
{/* ================= POST WISE VACANCY (100% DYNAMIC) ================= */}
{job.posts && job.posts.length > 0 && (
  <table className="w-full border-collapse border border-gray-400 mt-4 text-[16px]">
    <thead>
      {/* TABLE TITLE */}
      <tr>
        <th
          colSpan={Object.keys(job.posts[0]).length}
          className="border p-3 text-center font-bold text-lg"
        >
          <span className="text-fuchsia-600">{job.title}</span> :
          <span className="text-green-700"> Vacancy Details</span>
        </th>
      </tr>

      {/* DYNAMIC HEADERS */}
      <tr className="bg-gray-100">
        {Object.entries(job.posts[0]).map(([key]) => (
          <th key={key} className="border p-2 capitalize">
            {key}
          </th>
        ))}
      </tr>
    </thead>

    <tbody>
      {job.posts.map((post:any, rowIndex:any) => (
        <tr key={rowIndex}>
          {Object.entries(post).map(([key, value]) => (
            <td
              key={key}
              className={`border p-2 ${
                key === "postName"
                  ? "font-bold text-center"
                  : typeof value === "number"
                  ? "text-center"
                  : ""
              }`}
            >
              {/* ARRAY → BULLET LIST (eligibility) */}
              {renderCellValue(value)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)}


      {/* ================= FINAL AD ================= */}
      <div className="my-4 text-center">
        <FluidAd />
      </div>
{job.howToApply && (
  <table className="w-full border-collapse border border-gray-400 mt-2">
    <thead>
      <tr>
        <th className="bg-[#000066] text-white border p-2">
          How to Apply
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="p-3 border">
          {Array.isArray(job.howToApply) ? (
            <ul className="list-disc ml-5 space-y-1">
              {job.howToApply.map((step: any, i: number) => (
                <li
                  key={i}
                  dangerouslySetInnerHTML={{ __html: String(step) }}
                />
              ))}
            </ul>
          ) : (
            <div
              className="space-y-1"
              dangerouslySetInnerHTML={{ __html: job.howToApply }}
            />
          )}
        </td>
      </tr>
    </tbody>
  </table>
)}

      {/* ================= IMPORTANT LINKS ================= */}
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th colSpan={2} className="bg-yellow-300 text-red-700 border p-2">
              SOME USEFUL IMPORTANT LINKS
            </th>
          </tr>
          </thead>
        <tbody>
          {Object.entries(job.links || {}).map(([k, v]) => (
            <tr key={k}>
              <td className="border p-3 text-center font-bold w-1/2">
                {k.toUpperCase()}
              </td>
              <td className="border p-3 text-center w-1/2">
                <a
                  href={String(v)}
                  target="_blank"
                  className="text-blue-700 font-bold underline"
                >
                  Click Here
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  {/* ================= CONTENT SECTIONS ================= */}
  {job.content?.map((section:any, i:any) => (
    <table
      key={i}
      className="w-full border-collapse border border-gray-400 mt-2"
    >
      <thead>
        <tr>
          <th className="bg-[#000066] text-white border p-2">
            {section.heading}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-3 border">
            {typeof section.body === "string" ? (
              <p>{section.body}</p>
            ) : (
              <ul className="list-disc ml-5 space-y-1">
                {section.body.map((p:any, idx:any) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  ))}

{relatedJobs.length > 0 && (
  <div className="mt-6 border p-4 bg-gray-50">
    <h3 className="font-bold mb-2">You May Also Like</h3>
    <ul className="list-disc ml-5 space-y-1">
      {relatedJobs.map((rj) => (
        <li key={rj.id}>
          <Link href={`/jobs/${rj.slug}`} className="text-blue-600 hover:underline">
            {rj.title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)}

</article>

    </>
  );
}
