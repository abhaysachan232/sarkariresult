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
import { generateJobFAQs } from "@/components/utils/generateFAQs";
// import JobImportantLinks from "@/components/JobImportantLinks";
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
  const safeminimumAge = job.minimumAge
    ? sanitizeHtml(String(job.minimumAge), sanitizeOptions)
    : "";
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

const isExpired =
  job.importantDates?.lastDate &&
  new Date(job.importantDates.lastDate) < new Date();
console.log(job.updatedon);

const jobPostingSchema =  {
      "@context": "https://schema.org/",
      "@type": "JobPosting",

      /* ================= CORE ================= */
      title: job.title,
      description: sanitizeHtml(String(job.description || ""), {
        allowedTags: [],
        allowedAttributes: {},
      }),
      url: `https://sarkariresult.rest/jobs/${slug}`,

      /* ================= DATES ================= */

      // 🔹 Posting date (jab job pehli baar publish hui)
      datePosted: job.postingDate
        ? new Date(job.postingDate).toISOString()
        : new Date(job.date).toISOString(),

      // 🔹 Modified date (jab job last time update hui)
      dateModified: job.modifiedDate
        ? new Date(job.modifiedDate).toISOString()
    : new Date(job.updatedon).toISOString(),
     
      

      // 🔹 Expiry date
validThrough: job.importantDates?.expiredDate
  ? new Date(job.importantDates.expiredDate).toISOString()
  : new Date("2027-01-29T23:59:59+05:30").toISOString(),


      /* ================= JOB DETAILS ================= */
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
          streetAddress: job.streetAddress || "",
          addressLocality: job.addressLocality || "",
          addressRegion: job.addressRegion || "",
          postalCode: job.postalCode || "",
          addressCountry: job.addressCountry || "IN",
        },
      },

      baseSalary: job.salary
        ? {
            "@type": "MonetaryAmount",
            currency: "INR",
            value: {
              "@type": "QuantitativeValue",
              value:
                Number(String(job.salary).replace(/[^0-9]/g, "")) || 0,
              unitText: "Monthly",
            },
          }
        : undefined,
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
      <article className="w-full md:max-w-[80%] mx-auto px-4">
        {/* ================= HERO ================= */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 md:py-16">
          <div className="container max-w-5xl mx-auto px-4">
            <h1
              className="text-3xl md:text-5xl font-extrabold mb-3"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.title) }}
            />
            <p className="text-lg md:text-xl font-medium">
              {job.organization} Recruitment | Apply Online
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 text-sm bg-white/20 rounded-full">
                {job.category}
              </span>
              <span className="px-3 py-1 text-sm bg-white/20 rounded-full">
                {job.Type}
              </span>
              {job.Post && (
                <span
                  className="px-3 py-1 text-sm bg-white/20 rounded-full"
                  dangerouslySetInnerHTML={{
                    __html: `Total Vacancies: ${safePost}`,
                  }}
                />
              )}
            </div>
          </div>
        </section>

        <ShareButtons
          url={`https://sarkariresult.rest/jobs/${slug}`}
          title={job.title}
        />

        {/* ================= HEADER TABLE ================= */}
        <table className="w-full border-collapse border border-gray-400 text-center">
          <tbody>
            <tr>
              <td className="p-3">
                <h2 className="text-fuchsia-600 font-bold text-xl">
                  {job.organization}
                </h2>
                <h3 className="text-green-700 font-bold text-lg">
                  {job.title}
                </h3>
                <p className="text-red-600 font-bold">
                  {job.advtNo || "Official Recruitment Notification"}
                </p>
                <p className="text-red-700 font-bold">WWW.SARKARIRESULT.REST</p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ================= TOP ADS ================= */}
        <div className="my-3 text-center">
          <FluidAd />
        </div>
        <div className="my-3 text-center">
          <FluidAd />
        </div>

        {/* ================= BASIC INFO ================= */}
        <table className="w-full border-collapse border border-gray-400">
          <tbody>
            <tr>
              <td className="p-3">
                <p className="text-red-600 font-bold">
                  Recruitment Post Date : {job.date}
                </p>

                <p className="mt-2">
                  <b className="text-blue-700">{job.organization}</b> has
                  released an
                  <b> official recruitment notification</b> for{" "}
                  <b>{job.title}</b> posts. Total Vacancies :
                  <b className="text-green-700">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: safePost ? ` ${safePost} posts` : "",
                      }}
                    />
                  </b>
                </p>

                <p className="mt-2">
                  <b>Minimum Age Eligibility :</b>{" "}
                  <span dangerouslySetInnerHTML={{ __html: safeminimumAge }} />
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ================= IN-ARTICLE AD ================= */}
        <div className="my-4">
          <InArticleAd />
        </div>

        {/* ================= DATES + FEE ================= */}
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="bg-[#6b0033] text-white border p-2 w-1/2">
                Recruitment Important Dates
              </th>
              <th className="bg-[#6b0033] text-white border p-2 w-1/2">
                Recruitment Application Fee
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
                  "No Recruitment Fee"
                )}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="my-4 text-center">
          <FluidAd />
        </div>

        {/* ================= AGE + POST ================= */}
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="bg-green-700 text-white border p-2 w-3/4">
                Age Limit & Eligibility (As per Recruitment Rules)
              </th>
              <th className="bg-orange-600 text-white border p-2 w-1/4">
                Total Vacancies
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border">
                <ul className="list-disc ml-5">
                  <li dangerouslySetInnerHTML={{ __html: safeAge }} />
                  <li>Age Relaxation As Per Recruitment Rules</li>
                </ul>
              </td>
              <td className="p-3 border text-center font-bold text-xl">
                <span
                  dangerouslySetInnerHTML={{
                    __html: safePost ? `${safePost} posts` : "",
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        {relatedJobs.length > 0 && (
          <div className="mt-6 border p-4 bg-gray-50">
            <h3 className="font-bold mb-2">You May Also Like</h3>
            <ul className="list-disc ml-5 space-y-1">
              {relatedJobs.map((rj) => (
                <li key={rj.id}>
                  <Link
                    href={`/jobs/${rj.setPath}`}
                    className="text-blue-600 hover:underline"
                  >
                    {rj.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* ================= VACANCY DETAILS ================= */}
        {job.posts && job.posts.length > 0 && (
          <table className="w-full border-collapse border border-gray-400 mt-4 text-[16px]">
            <thead>
              <tr>
                <th
                  colSpan={Object.keys(job.posts[0]).length}
                  className="border p-3 text-center font-bold text-lg"
                >
                  <span className="text-fuchsia-600">{job.title}</span> :
                  <span className="text-green-700">
                    {" "}
                    Recruitment Vacancy Details
                  </span>
                </th>
              </tr>
              <tr className="bg-gray-100">
                {Object.entries(job.posts[0]).map(([key]) => (
                  <th key={key} className="border p-2 capitalize">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {job.posts.map((post: any, i: any) => (
                <tr key={i}>
                  {Object.entries(post).map(([k, v]) => (
                    <td key={k} className="border p-2">
                      {renderCellValue(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="my-4 text-center">
          <FluidAd />
        </div>

        {/* ================= HOW TO APPLY ================= */}
        {job.howToApply && (
          <table className="w-full border-collapse border border-gray-400 mt-2">
            <thead>
              <tr>
                <th className="bg-[#000066] text-white border p-2">
                  How to Apply Online for Recruitment
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border">
                  {Array.isArray(job.howToApply) ? (
                    <ul className="list-disc ml-5 space-y-1">
                      {job.howToApply.map((s: any, i: number) => (
                        <li
                          key={i}
                          dangerouslySetInnerHTML={{ __html: String(s) }}
                        />
                      ))}
                    </ul>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: job.howToApply }} />
                  )}
                  <p className="mt-2 font-semibold">
                    Candidates seeking a <b>government job opportunity</b> can
                    <b> apply online</b> through the official recruitment
                    portal.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        )}
{job.links && (
  <table className="w-full border-collapse border border-gray-500 mt-4">
    <thead>
      <tr>
        <th
          colSpan={2}
          className="bg-[#000066] text-white border p-2"
        >
          Some Useful Important Links
        </th>
      </tr>
    </thead>

    <tbody>
      {Object.entries(job.links).map(([label, url], i) => {
        const isApply = label.toLowerCase().includes("apply");
        const isNotification =
          label.toLowerCase().includes("notification") ||
          label.toLowerCase().includes("pdf");
        const isOfficial = label.toLowerCase().includes("official");

        return (
          <tr key={i}>
            {/* LEFT COLUMN */}
            <td className="border border-gray-500 p-3 text-center font-bold text-lg">
              <span
                className={
                  isApply || isNotification || isOfficial
                    ? "text-pink-600"
                    : "text-teal-700"
                }
              >
                {label}
              </span>
            </td>

            {/* RIGHT COLUMN */}
            <td className="border border-gray-500 p-3 text-center text-lg font-bold">
              <a
                href={String(url)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline"
              >
                Click Here
              </a>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
)}

        {job.content && (
          <div className="space-y-6">
            {job.content.map((section: any, index: number) => (
              <table className="w-full border-collapse border border-gray-400 mt-2">
                <thead>
                  <tr>
                    <th className="bg-[#000066] text-white border p-2">
                      <h2 className="text-lg font-semibold">
                        {section.heading}
                      </h2>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border">
                      {Array.isArray(section.body) ? (
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                          {section.body.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 leading-relaxed">
                          {section.body}
                        </p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            ))}
          </div>
        )}
        <JobFAQFooter
          faqs={generateJobFAQs({
            title: job.title,
            organization: job.organization,
            type: job.type,
          })}
        />
      </article>
      {relatedJobs.length > 0 && (
        <div className="mt-6 border p-4 bg-gray-50">
          <h3 className="font-bold mb-2">You May Also Like</h3>
          <ul className="list-disc ml-5 space-y-1">
            {relatedJobs.map((rj) => (
              <li key={rj.id}>
                <Link
                  href={`/jobs/${rj.setPath}`}
                  className="text-blue-600 hover:underline"
                >
                  {rj.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
