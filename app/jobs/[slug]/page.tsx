// app/job/[slug]/page.tsx
import sanitizeHtml from "sanitize-html";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  FileText,
  Banknote,
  UserCheck,
  CheckCircle,
} from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import datas from "../../../public/jobs.json";
import NotFound from "../../not-found";
import ShareButtons from "../../../components/sharebtn";
import Faq from "../../../components/faq";
import { getShortTitle } from "@/components/utils/getShortTitle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const jobs = datas;
  const job = jobs.find((j) => j.setPath.split(" ").join("-") === slug);
  if (!job) return { title: "Job Not Found" };
  const shortTitle = getShortTitle(job.title || "");

  return {
    title: job.id < 43 ? `${shortTitle}` : `${job.seo?.metaTitle || shortTitle}`,
    description:
      job.id < 43 ? `${job.description}` : `${job.seo?.metaDescription || job.description}`,
    keywords:
      job.id < 43
        ? `${job.title}, ${job.category}, ${job.organization}, Sarkari Naukri, Sarkari Result, Government Jobs`
        : `${job.seo?.keywords}, Sarkari Naukri, Sarkari Result, Government Jobs`,
    alternates: { canonical: `https://sarkariresult.rest/jobs/${slug}` },
    openGraph: {
      title: job.title,
      description: job.description,
      url: `https://sarkariresult.rest/jobs/${slug}`,
      type: "article",
      images: [
        {
          url: `https://sarkariresult.rest/api/og?title=${encodeURIComponent(
      job.title
    )}&footerText=${encodeURIComponent(job.organization)}&type=minimal`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: job.title,
      description: job.description,
      images: `https://sarkariresult.rest/api/og?title=${encodeURIComponent(
      job.title
    )}&footerText=${encodeURIComponent(job.organization)}&type=minimal`,
    },
  };
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const jobs = datas;
  const job = jobs.find((j) => j.setPath.split(" ").join("-") === slug);
  if (!job) return NotFound();

  const currentIndex = jobs.findIndex((j) => j.id === job.id);
  const relatedJobs = jobs
    .slice(Math.max(currentIndex - 2, 0), Math.min(currentIndex + 3, jobs.length))
    .filter((j) => j.id !== job.id);

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

  const safeDescription = job.description
    ? sanitizeHtml(String(job.description), sanitizeOptions)
    : "";
  const safeEligibility = job.eligibility
    ? sanitizeHtml(String(job.eligibility), sanitizeOptions)
    : "";
  const safeAge = job.age ? sanitizeHtml(String(job.age), sanitizeOptions) : "";
  const safePost = job.Post
    ? sanitizeHtml(String(job.Post), sanitizeOptions)
    : "";
  const safeApplicationFee = job.applicationFee
    ? Object.fromEntries(
        Object.entries(job.applicationFee).map(([k, v]) => [
          k,
          sanitizeHtml(String(v)),
        ])
      )
    : undefined;

  return (
    <>
      <article className="min-h-screen">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 md:py-16 relative">
          <div className="container max-w-5xl mx-auto px-4">
            {/* Job Image using Next.js Image */}
            <div className="w-full h-64 md:h-96 mb-6 rounded-xl overflow-hidden shadow-lg relative">
              <Image
                src={`https://sarkariresult.rest/api/og?title=${encodeURIComponent(
      job.title
    )}&footerText=${encodeURIComponent(job.organization)}&type=minimal`}
                alt={job.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>

            <h1
              className="text-3xl md:text-5xl font-extrabold mb-3"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.title) }}
            />
            <p className="text-lg md:text-xl font-medium">{job.organization}</p>

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
                  dangerouslySetInnerHTML={{ __html: `Vacancies: ${safePost}` }}
                />
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {Object.keys(job.links || {}).length === 0 && (
                <span className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 font-semibold">
                  No Action Links Available
                </span>
              )}

              {Object.entries(job.links || {}).map(([key, value]) => (
                <Link
                  key={key}
                  href={String(value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-white text-blue-700 font-semibold border border-white hover:bg-blue-100"
                >
                  {`${
                    key === "notification"
                      ? "📄"
                      : key === "apply"
                      ? "📝"
                      : key === "admitCard"
                      ? "🎫"
                      : "✅"
                  } ${key.toString().toUpperCase()}`}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <ShareButtons
          url={`https://sarkariresult.rest/jobs/${slug}`}
          title={job.title}
        />

        {/* Main content */}
        <section className="container max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <main className="lg:col-span-2 space-y-10">
            <div
              className="prose dark:prose-invert max-w-none space-y-6"
              dangerouslySetInnerHTML={{ __html: safeDescription }}
            />

            {/* Eligibility */}
            <div
              className="rounded-xl border bg-white dark:bg-card shadow p-6"
              dangerouslySetInnerHTML={{
                __html: safeEligibility || "<p>Not specified</p>",
              }}
            />

            {/* Related Jobs with Thumbnail */}
            {relatedJobs.length > 0 && (
              <div className="rounded-xl border bg-white shadow p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  📰 Related Jobs
                </h2>
                <ul className="space-y-2">
                  {relatedJobs.map((rj) => (
                    <li key={rj.id} className="flex items-center gap-3">
                      <div className="w-16 h-16 relative flex-shrink-0">
                        <Image
                          src={`https://sarkariresult.rest/api/og?title=${encodeURIComponent(
      job.title
    )}&footerText=${encodeURIComponent(job.organization)}&type=minimal`}
                          alt={rj.title}
                          fill
                          className="object-cover rounded"
                          width={1200}
                          height={600}
                        />
                      </div>
                      <Link
                        href={`/jobs/${rj.setPath.split(" ").join("-")}`}
                        className="text-blue-600 hover:underline"
                      >
                        {rj.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
          </aside>
        </section>
        <Faq />
      </article>
    </>
  );
}
