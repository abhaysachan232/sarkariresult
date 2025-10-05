// app/job/[slug]/page.tsx
import sanitizeHtml from "sanitize-html";
import { Calendar, MapPin, FileText, Banknote, UserCheck, CheckCircle } from "lucide-react";
import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import JobCard from "@/components/job-card";
import datas from '../../../public/jobs.json';
import NotFound from '../../not-found';
import ShareButtons from '../../../components/sharebtn';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
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
  const job = jobs.find((j) => j.title.split(" ").join("-") === slug);
  if (!job) return { title: "Job Not Found" };

  return {
    title: `${job.title} - ${job.organization} | SarkariResult`,
    description: job.description,
    keywords: `${job.title}, ${job.category}, ${job.organization}, Sarkari Naukri, Sarkari Result, Government Jobs`,
    alternates: { canonical: `https://sarkariresult.rest/jobs/${slug}` },
    openGraph: {
      title: job.title,
      description: job.description,
      url: `https://sarkariresult.rest/job/${slug}`,
      type: "article",
      images: [{ url: job.image || "https://example.com/default-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: job.title,
      description: job.description,
      images: [job.image || "https://example.com/default-image.png"],
    },
  };
}

export default async function JobDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  type JobType = { /* ...same shape... */ [key: string]: any };

  // Map and normalize data
  const jobs: JobType[] = datas.map((job: any) => ({
    ...job,
    applicationFee: job.applicationFee
      ? Object.fromEntries(Object.entries(job.applicationFee).map(([k, v]) => [k, String(v)]))
      : undefined,
  }));

  const job = jobs.find((j) => j.title.split(" ").join("-") === slug);
  if (!job) return NotFound();

  // --- Related jobs (2 before, 2 after) ---
  const currentIndex = jobs.findIndex((j) => j.id === job.id);
  const startIndex = Math.max(currentIndex - 2, 0);
  const endIndex = Math.min(currentIndex + 2, jobs.length - 1);
  const relatedJobs = jobs.slice(startIndex, endIndex + 1).filter((j) => j.id !== job.id);

  // ---------- SANITIZE HTML STRINGS (server-side) ----------
  // Allowed tags/attributes: adjust to your needs.
  const sanitizeOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'br' ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height'],
      a: ['href', 'name', 'target', 'rel']
    },
    allowedSchemesByTag: {
      img: ['http','https','data'],
      a: ['http','https','mailto']
    }
  };

  // sanitize fields that may contain HTML
  const safeDescription = job.description ? sanitizeHtml(String(job.description), sanitizeOptions) : "";
  const safeEligibility = job.eligibility ? sanitizeHtml(String(job.eligibility), sanitizeOptions) : "";
  const safeAge = job.age ? sanitizeHtml(String(job.age), sanitizeOptions) : "";
  // If Post may include html formatting:
  const safePost = job.Post ? sanitizeHtml(String(job.Post), sanitizeOptions) : "";
  // For applicationFee we keep keys/values as plain text (no HTML expected) — but you can sanitize values if needed
  const safeApplicationFee = job.applicationFee
    ? Object.fromEntries(Object.entries(job.applicationFee).map(([k, v]) => [k, sanitizeHtml(String(v))]))
    : undefined;

  // Structured data schema: remove HTML tags from description for schema
  const jobPostingSchema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: sanitizeHtml(String(job.description || ""), { allowedTags: [], allowedAttributes: {} }),
    datePosted: job.date,
    validThrough: job.importantDates?.lastDate || null,
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
        addressLocality: job.location,
      },
    },
    baseSalary: job.salary
      ? {
          "@type": "MonetaryAmount",
          currency: "INR",
          value: {
            "@type": "QuantitativeValue",
            value: Number(String(job.salary).replace(/[^0-9]/g, "")) || 0,
            unitText: "YEAR",
          },
        }
      : undefined,
    url: `https://sarkariresult.rest/jobs/${slug}`,
  };

  return (
    <>
      <Head>
        <title>{`${slug} - Sarkari Result Job Portal`}</title>
        <meta name="description" content={stripHtml(safeDescription).slice(0, 160)} />
        <meta name="keywords" content={`${slug} ${job.title}, ${job.category}, ${job.organization}, Sarkari Naukri`} />
        <link rel="canonical" href={`https://sarkariresult.rest/jobs/${slug}`} />
        <meta property="og:title" content={`${job.title}`} />
        <meta property="og:description" content={stripHtml(safeDescription)} />
        <meta property="og:url" content={`https://sarkariresult.rest/jobs/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={job.image || "https://example.com/default-image.png"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={job.title} />
        <meta name="twitter:description" content={stripHtml(safeDescription)} />
        <meta name="twitter:image" content={job.image || "https://example.com/default-image.png"} />
       <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
/>
      </Head>

      <article className="min-h-screen">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 md:py-16">
          <div className="container max-w-5xl mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3" dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.title) }} />
            <p className="text-lg md:text-xl font-medium">{job.organization}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 text-sm bg-white/20 rounded-full">{job.category}</span>
              <span className="px-3 py-1 text-sm bg-white/20 rounded-full">{job.Type}</span>

              {job.Post && (
                <span className="px-3 py-1 text-sm bg-white/20 rounded-full" dangerouslySetInnerHTML={{ __html: `Vacancies: ${safePost}` }} />
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {Object.keys(job.links || {}).length === 0 && (
                <span className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 font-semibold">No Action Links Available</span>
              )}

              {Object.entries(job.links || {}).map(([key, value]) => (
                <a
                  key={key}
                  href={String(value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-white text-blue-700 font-semibold border border-white hover:bg-blue-100"
                >
                  { `${key === 'notification' ? '📄' : key === 'apply' ? '📝' : key === 'admitCard' ? '🎫' : '✅'} ${key.toString().toUpperCase()}` }
                </a>
              ))}
            </div>
          </div>
        </section>

        <ShareButtons url={`https://sarkariresult.rest/jobs/${slug}`} title={job.title} />

        {/* Main content */}
        <section className="container max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <main className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div className="prose dark:prose-invert max-w-none space-y-6">
              <div dangerouslySetInnerHTML={{ __html: safeDescription }} />

              <h2><b>About {job.organization}</b></h2>
              <p><b><i>{job.organization}</i></b> is one of the most trusted recruitment bodies...</p>

              <h2><b>About the {job.title}</b></h2>
              <p>The <b>{job.title}</b> notification released by <b>{job.organization}</b> ...</p>

              <h2><b>Key Highlights of {job.title}</b></h2>
              <ul className="list-disc list-inside space-y-2">
                <li><b>Organization:</b> {job.organization}</li>
                <li><b>Post Name:</b> {job.title}</li>
                <li><b>Total Vacancies:</b> <span dangerouslySetInnerHTML={{ __html: safePost }} /></li>
                <li><b>Salary:</b> {job.salary}</li>
                <li><b>Age Limit:</b> <span dangerouslySetInnerHTML={{ __html: safeAge || "N/A" }} /></li>
                <li><b>Application Start Date:</b> {job.importantDates.start}</li>
                <li><b>Application Last Date:</b> {job.importantDates.lastDate}</li>
                <li><b>Exam Date:</b> {job.importantDates.examDate}</li>
                <li><b>Official Website:</b> {job.links?.official ?? "N/A"}</li>
              </ul>

              <h2><b>Eligibility Criteria</b></h2>
              <div dangerouslySetInnerHTML={{ __html: safeEligibility || "<p>Not specified</p>" }} />

              {/* ...rest remains mostly the same. */}
            </div>

            {/* Job Overview Table */}
            <div className="rounded-xl border bg-white dark:bg-card shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" /> Job Overview
              </h2>
              <table className="table-auto w-full text-sm border-collapse border border-gray-200">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Location</td>
                    <td className="px-4 py-2">{job.location}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Posted</td>
                    <td className="px-4 py-2">{job.date}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Age</td>
                    <td className="px-4 py-2"><span dangerouslySetInnerHTML={{ __html: safeAge || "N/A" }} /></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Salary</td>
                    <td className="px-4 py-2">₹{job.salary ?? "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Eligibility Table */}
            <div className="rounded-xl border bg-white dark:bg-card shadow p-6 space-y-3">
              <h2 className="text-xl font-bold mb-4">Eligibility Criteria</h2>
              <table className="table-auto w-full text-sm border-collapse border border-gray-200">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Education</td>
                    <td className="px-4 py-2"><div dangerouslySetInnerHTML={{ __html: safeEligibility || "Not specified" }} /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-medium">Application Fee</td>
                    <td className="px-4 py-2">
                      {safeApplicationFee ? (
                        <ul className="list-disc ml-5">
                          {Object.entries(safeApplicationFee).map(([key, value]) => (
                            <li key={key}>{key}: <span dangerouslySetInnerHTML={{ __html: String(value) }} /></li>
                          ))}
                        </ul>
                      ) : (
                        "No fee"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Important Dates */}
            <div className="rounded-xl border bg-white dark:bg-card shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" /> Important Dates
              </h2>
              <table className="table-auto w-full text-sm border-collapse border border-gray-200">
                <tbody>
                  {Object.entries(job.importantDates).map(([key, value]) => (
                    <tr key={key} className="border-b">
                      <td className="px-4 py-2 font-medium">{key}</td>
                      <td className="px-4 py-2">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

            <ShareButtons url={`https://sarkariresult.rest/jobs/${slug}`} title={job.title} />

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <div className="rounded-xl border bg-white shadow p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">📰 Related Jobs</h2>
                <ul className="list-disc list-inside space-y-2">
                  {relatedJobs.map((rj) => (
                    <li key={rj.id}>
                      <Link href={`/jobs/${rj.title.split(" ").join("-")}`} className="text-blue-600 hover:underline">
                        {rj.title}
                      </Link>
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

// helper to strip tags for meta descriptions
function stripHtml(htmlString: string) {
  return String(htmlString).replace(/(<([^>]+)>)/gi, "").trim();
}
