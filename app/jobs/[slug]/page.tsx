// app/job/[slug]/page.tsx

// import { notFound } from "next/navigation"
import { Calendar, MapPin, FileText, Banknote, UserCheck, CheckCircle } from "lucide-react"
import Head from "next/head"
import Script from "next/script"
import JobCard from "@/components/job-card"
import datas from '../../../public/jobs.json';
import NotFound from '../../not-found';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  
  const { slug } = await params;

  type JobType = {
    id: number;
    title: string;
    setPath: string;
    organization: string;
    date: string;
    location: string;
    type: string;
    category: string;
    year: string;
    Type: string;
    description: string;
    importantDates: Record<string, string>;
    Post?: string | number;
    age?: string;
    salary?: string;
    eligibility?: string;
    applicationFee?: Record<string, string>;
    links?: {
      apply?: string;
      notification?: string;
      official?: string;
    };
    image?: string;
    [key: string]: any;
  };

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
    keywords: `${job.title}, ${job.category}, ${job.organization}, Sarkari Naukri, Government Jobs`,
    alternates: { canonical: `https://sarkariresult.rest/jobs/${slug}` },
    openGraph: {
      title: job.title,
      description: job.description,
      url: `https://sarkariresult.rest/job/${slug}`,
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

export default async function JobDetailsPage({ params }: { params: Promise<{ slug: string }> }) {

  const { slug } = await params;

  type JobType = {
    id: number;
    title: string;
    setPath: string;
    organization: string;
    date: string;
    location: string;
    type: string;
    category: string;
    year: string;
    Type: string;
    description: string;
    importantDates: Record<string, string>;
    Post?: string | number;
    age?: string;
    salary?: string;
    eligibility?: string;
    applicationFee?: Record<string, string>;
    links?: {
      apply?: string;
      notification?: string;
      official?: string;
    };
    image?: string;
    [key: string]: any;
  };

  const jobs: JobType[] = datas.map((job: any) => ({
    ...job,
    applicationFee: job.applicationFee
      ? Object.fromEntries(
          Object.entries(job.applicationFee).map(([k, v]) => [k, String(v)])
        )
      : undefined,
  }));
  const job = jobs.find((j) => j.title.split(" ").join("-") === slug);
  
  if (!job) return NotFound()

  const jobPostingSchema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description.replace(/(<([^>]+)>)/gi, ""),
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
            value: Number(job.salary.replace(/[^0-9]/g, "")) || 0,
            unitText: "YEAR",
          },
        }
      : undefined,
    url: `https://sarkariresult.rest/jobs/${slug}`,
  };

  return (<>

    <Head>
      <title>{`${slug} - Sarkari Result Job Portal`}</title>
      <meta name="description" content={job.description} />
      <meta
        name="keywords"
        content={`${slug} ${job.title}, ${job.category}, Sarkari Naukri, Government Jobs`}
      />
      <link rel="canonical" href={`https://sarkariresult.rest/jobs/${slug}`} />

      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:title" content={slug +' '+ job.title } />
      <meta property="og:description" content={job.description} />
      <meta property="og:url" content={`https://sarkariresult.rest/jobs/${slug}`} />
      <meta property="og:type" content="article" />
      <meta
        property="og:image"
        content={job.image || "https://example.com/default-image.png"}
      />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={job.title} />
      <meta name="twitter:description" content={job.description} />
      <meta
        name="twitter:image"
        content={job.image || "https://example.com/default-image.png"}
      />
      {/* Structured Data for SEO */}
      <Script
        id="job-posting-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
    </Head>

    <article className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 md:py-16">
        <div className="container max-w-5xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3">{job.title}</h1>
          <p className="text-lg md:text-xl font-medium">{job.organization}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 text-sm bg-white/20 rounded-full">{job.category}</span>
            <span className="px-3 py-1 text-sm bg-white/20 rounded-full">{job.type}</span>
            {job.Post && <span className="px-3 py-1 text-sm bg-white/20 rounded-full">Vacancies: {job.Post}</span>}
          </div>
          <div className="mt-6 flex gap-3">
            {job.links?.apply && (
              <a
                href={job.links.apply}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 shadow-lg"
              >
                Apply Now
              </a>
            )}
            {job.links?.notification && (
              <a
                href={job.links.notification}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-lg border border-white text-white font-semibold hover:bg-white hover:text-blue-700"
              >
                Download Notification
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="container max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <main className="lg:col-span-2 space-y-10">
          {/* Description */}
          <div className="prose dark:prose-invert max-w-none space-y-6">
            <div dangerouslySetInnerHTML={{ __html: job.description }} />

            <h2>About {job.organization}</h2>
            <p>
              <b><i>{job.organization}</i></b> is one of the most reputed institutions in India, known for conducting transparent and
              large-scale recruitment examinations. The authority is responsible for recruiting talented individuals for
              various government departments, ensuring fair opportunities for all candidates. Over the years, it has
              built a reputation for efficiency and transparency in the recruitment process.
            </p>

            <h2>Job Description</h2>
            <p>
              The <b>{job.title}</b> role offers a golden opportunity for aspirants who are looking to build a stable career in
              the government sector. Selected candidates will be responsible for handling official documentation, data
              entry, clerical work, and assisting higher officials in day-to-day operations. The position promises job
              security, fixed working hours, and growth opportunities through departmental examinations and promotions.
            </p>
            <p>
              Candidates applying for this recruitment will get the chance to serve in the state government setup with
              attractive perks and allowances. The role also brings a sense of pride and responsibility, as government
              jobs are often considered highly prestigious in India.
            </p>
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
                  <td className="px-4 py-2">{job.age ?? "N/A"}</td>
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
                  <td className="px-4 py-2">{job.eligibility ?? "Not specified"}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium">Application Fee</td>
                  <td className="px-4 py-2">
                    {job.applicationFee ? (
                      <ul className="list-disc ml-5">
                        {Object.entries(job.applicationFee).map(([key, value]) => (
                          <li key={key}>
                            {key}: {value}
                          </li>
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
                    <td className="px-4 py-2">{value}</td>
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

          {/* Related Jobs - you can render other JobCards if you want */}
          {/* <JobCard jobs={jobs.filter(j => j.title !== job.title).slice(0, 5)} /> */}
        </aside>
      </section>
    </article>

  </>);
}
