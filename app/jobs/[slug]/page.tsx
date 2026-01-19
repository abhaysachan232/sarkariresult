// app/job/[slug]/page.tsx
import sanitizeHtml from "sanitize-html";
import Image from "next/image";
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
          Object.entries(job.applicationFee).map(([k, v]) => [k, String(v)])
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
          Object.entries(job.applicationFee).map(([k, v]) => [k, String(v)])
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
  // If Post may include html formatting:
  const safePost = job.Post
    ? sanitizeHtml(String(job.Post), sanitizeOptions)
    : "";
  // For applicationFee we keep keys/values as plain text (no HTML expected) — but you can sanitize values if needed
  const safeApplicationFee = job.applicationFee
    ? Object.fromEntries(
        Object.entries(job.applicationFee).map(([k, v]) => [
          k,
          sanitizeHtml(String(v)),
        ])
      )
    : undefined;

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
    image: [
      `https://sarkariresult.rest/og/jobs/${job.slug}.webp`,
    ],
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

      <article className="min-h-screen">
        {/* Hero Banner */}
{/* ===== SarkariResult Style Top Description ===== */}
<section className="bg-white border border-gray-300 rounded-md p-5 space-y-4 text-[17px] leading-relaxed">
  {/* TITLE */}
  <h1 className="text-blue-800 font-extrabold text-2xl border-b pb-2">
    {job.title}
  </h1>

  {/* POST DATE */}
  <p className="text-red-600 font-bold">
    Post Date : {job.date}
  </p>

  {/* MAIN DESCRIPTION */}
  <p>
    <b className="text-blue-700">{job.organization}</b> Has Released A
    Notification On Its Official Website For The Recruitment Of{" "}
    <b>{job.title}</b> Post. This Recruitment Is For{" "}
    <b className="text-green-700">
      <span dangerouslySetInnerHTML={{ __html: safePost || "—" }} />
    </b>{" "}
    Positions.
  </p>

  <p>
    The Online Application Form Has Started On{" "}
    <b className="text-black">
      {job.importantDates?.["Online Apply Start Date"]}
    </b>{" "}
    And Candidates Can Apply Till{" "}
    <b className="text-red-700">
      {job.importantDates?.["Online Apply Last Date"]}
    </b>.
  </p>
  {/* AGE INFO HIGHLIGHT */}
  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3">
    <p>
      <b>Minimum Age Required :</b>{" "}
      <span
        className="font-bold"
        dangerouslySetInnerHTML={{ __html: safeAge }}
      />
    </p>
    <p className="text-sm text-gray-700 mt-1">
      Complete eligibility details are mentioned below in the notification.
    </p>
  </div>
</section>



        {/* Main content */}
        <section className="container max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <main className="lg:col-span-2 space-y-10">
            {/* Eligibility Table */}
<table className="w-full border mt-6 text-[16px]">
  <thead>
    <tr className="bg-[#6b0033] text-white">
      <th className="w-1/2 p-2 border">Important Dates</th>
      <th className="w-1/2 p-2 border">Application Fee</th>
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
        {safeApplicationFee ? (
          <ul className="list-disc ml-5 space-y-1">
            {Object.entries(safeApplicationFee).map(([k, v]) => (
              <li key={k}>
                <b>{k}</b> : {v}
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
<table className="w-full border mt-6 text-[16px]">
  <thead>
    <tr>
      <th className="bg-green-700 text-white p-2 border w-3/4">
        Age Limit As On Cutoff Date
      </th>
      <th className="bg-orange-600 text-white p-2 border w-1/4">
        Total Post
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="p-3 border">
        <ul className="list-disc ml-5 space-y-1">
          <li dangerouslySetInnerHTML={{ __html: safeAge }} />
          <li>Age Relaxation As Per Rules</li>
        </ul>
      </td>
      <td className="p-3 border text-center font-bold text-xl">
        <span dangerouslySetInnerHTML={{ __html: safePost }} />
      </td>
    </tr>
  </tbody>
            </table>
            <table className="w-full border mt-6 text-[16px]">
  <thead>
    <tr className="bg-[#000066] text-white">
      <th className="p-2 border">Vacancy Details & Education Qualification</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="p-3 border">
        <div dangerouslySetInnerHTML={{ __html: safeEligibility }} />
      </td>
    </tr>
  </tbody>
</table>
<table className="w-full border mt-6 text-[16px]">
  <thead>
    <tr className="bg-[#000066] text-white">
      <th className="p-2 border">How To Fill Online Form</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="p-3 border">
        <ul className="list-disc ml-5 space-y-1">
          <li>Read Full Notification Carefully</li>
          <li>Fill Application Before Last Date</li>
          <li>Upload Required Documents</li>
          <li>Take Printout Of Final Submitted Form</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>
<table className="w-full border mt-6 text-[16px]">
  <thead>
    <tr className="bg-[#000066] text-white">
      <th className="p-2 border">Mode Of Selection</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="p-3 border">
        <ul className="list-disc ml-5 space-y-1">
          <li>Written Exam</li>
          <li>Physical Test</li>
          <li>Document Verification</li>
          <li>Medical Examination</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>


            {job.content && (
              <div className="rounded-xl border bg-white dark:bg-card shadow p-6 space-y-3">
                {Array.isArray(job.content) && job.content.length > 0 && (
                  <div className="space-y-10">
                    {job.content.map((section: any, index: number) => (
                      <div
                        key={index}
                        className="prose dark:prose-invert max-w-none"
                      >
                        {/* Heading */}
                        {section.heading && (
                          <h2 className="text-2xl font-bold mb-3">
                            {section.heading}
                          </h2>
                        )}

                        {/* BODY CHECK */}
                        {section.body &&
                          (typeof section.body === "string" ? (
                            <p>{section.body}</p>
                          ) : Array.isArray(section.body) ? (
                            <ul className="list-disc list-inside space-y-1">
                              {section.body.map(
                                (point: string, idx: number) => (
                                  <li key={idx}>{point}</li>
                                )
                              )}
                            </ul>
                          ) : null)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
<div className="rounded-xl border bg-[#fff4a3] shadow overflow-hidden">
  <h2 className="text-center font-extrabold text-red-600 text-lg py-3 border-b">
    SOME USEFUL IMPORTANT LINKS
  </h2>

  <table className="w-full border-collapse text-base">
    <tbody>
      {Object.entries(job.links || {}).map(([key, value]) => {
        if (!value) return null;

        const labelMap: Record<string, string> = {
          apply: "Apply Online",
          notification: "Official Notification",
          official: "Official Website",
          admitCard: "Admit Card",
          result: "Result",
          answerKey: "Answer Key",
        };

        return (
          <tr key={key} className="border-b last:border-b-0">
            {/* LEFT COLUMN */}
            <td className="w-1/2 text-center font-bold py-4 border-r">
              {labelMap[key] ?? key.toUpperCase()}
            </td>

            {/* RIGHT COLUMN */}
            <td className="w-1/2 text-center py-4">
              <a
                href={String(value)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 font-bold hover:underline"
              >
                Click Here
              </a>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

<JobFAQFooter
  faqs={[
    {
      question: `${job.title} apply online kab se start hai?`,
      answer: `Is recruitment ke liye apply online dates official notification ke according hongi.`,
    },
    {
      question: `${job.title} age limit kya hai?`,
      answer: job.age || "Age limit notification ke anusaar hogi.",
    },
    {
      question: `${job.organization} selection process kya hai?`,
      answer:
        job.selectionProcess ||
        "Selection process written exam, physical test aur document verification par adharit hota hai.",
    },
    {
      question: `${job.title} official website kya hai?`,
      answer: job.links?.official || "Official website notification me di gayi hoti hai.",
    },
  ]}
/>

          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="rounded-xl border bg-white dark:bg-card shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" /> Location
              </h2>
              <p>{job.location}</p>
            </div>

            <div className="rounded-xl border bg-white dark:bg-card shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-600" /> Organization
              </h2>
              <p>{job.organization}</p>
            </div>

            <div className="rounded-xl border bg-white dark:bg-card shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" /> Job Type
              </h2>
              <p>{job.type}</p>
            </div>

            <ShareButtons
              url={`https://sarkariresult.rest/jobs/${slug}`}
              title={job.title}
            />

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <div className="rounded-xl border bg-white shadow p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  📰 Related Jobs
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {relatedJobs.map((rj) => (
                    <li key={rj.id}>
                      <div className="w-16 h-16 relative flex-shrink-0">
                        <Image
                          src={`https://sarkariresult.rest/og/jobs/${rj.slug}.webp`}
                          alt={rj.title}                         
                          className="object-cover rounded"
                          width={1200}
                          height={600}
                          unoptimized
                        />
                      </div>
                      <li key={rj.id}>
                        <Link
                          href={`/jobs/${rj.setPath.split(" ").join("-")}`}
                          className="text-blue-600 hover:underline"
                        >
                          {rj.title}
                        </Link>
                      </li>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </section>

      </article>
    </>
  );
}
