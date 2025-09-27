// app/job/[slug]/page.tsx

import { notFound } from "next/navigation"
import { Calendar, MapPin, FileText, Banknote, UserCheck, CheckCircle } from "lucide-react"
import Head from "next/head"
import Script from "next/script"
import JobCard from "@/components/job-card"




export async function generateMetadata({ params }: { params: { slug: string } }) {
 const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

    // console.log(baseUrl);
    
  const res = await fetch(`${baseUrl}/jobs.json`, { next: { revalidate: 600 } });

  if (!res.ok) {
    throw new Error("Failed to fetch data.json");
  }

  const jobs = await res.json();
  const job = jobs.find((j:any) => j.title.split(" ").join("-") === params.slug);
  if (!job) return { title: "Job Not Found" };

  return {
    title: `${job.title} - ${job.organization} | SarkariResult`,
    description: job.description,
    keywords: `${job.title}, ${job.category}, ${job.organization}, Sarkari Naukri, Government Jobs`,
    alternates: { canonical: `https://sarkariresult.rest/job/${job.slug}` },
    openGraph: {
      title: job.title,
      description: job.description,
      url: `https://sarkariresult.rest/job/${job.slug}`,
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

export default async function JobDetailsPage({ params }: { params: { slug: string } }) {
 const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

    // console.log(baseUrl);
    
  const res = await fetch(`${baseUrl}/jobs.json`, { next: { revalidate: 600 } });

  if (!res.ok) {
    throw new Error("Failed to fetch data.json");
  }

  const jobs = await res.json();
  const job = jobs.find((j:any) => j.title.split(" ").join("-") === params.slug);
  
  if (!job) return notFound()


      const jobPostingSchema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description.replace(/(<([^>]+)>)/gi, ""),
    datePosted: job.date,
    validThrough: job.importantDates?.lastDate || job.lastDate || null,
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
    url: `https://sarkariresult.rest/jobs/${params.slug}`,
  };

  return (<>

<Head>
        <title>{`${params.slug} - Sarkari Result Job Portal`}</title>
        <meta name="description" content={job.description} />
        <meta
          name="keywords"
          content={`${params.slug} ${job.title}, ${job.category}, Sarkari Naukri, Government Jobs`}
        />
        <link rel="canonical" href={`https://sarkariresult.rest/jobs/${params.slug}`} />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:title" content={params.slug +' '+ job.title } />
        <meta property="og:description" content={job.description} />
        <meta property="og:url" content={`https://sarkariresult.rest/jobs/${params.slug}`} />
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

          {/* Overview */}
          <div className="rounded-xl border bg-white dark:bg-card shadow p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" /> Job Overview
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-500" /> {job.location}</li>
              <li className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-500" /> Posted: {job.date}</li>
              <li className="flex items-center gap-2"><UserCheck className="h-4 w-4 text-gray-500" /> Age: {job.age ?? "N/A"}</li>
              <li className="flex items-center gap-2"><Banknote className="h-4 w-4 text-gray-500" /> Salary: ₹{job.salary ?? "N/A"}</li>
            </ul>
          </div>

          {/* Eligibility */}
          <div className="rounded-xl border bg-white dark:bg-card shadow p-6 space-y-3">
            <h2 className="text-xl font-bold">Eligibility Criteria</h2>
            <p>{job.eligibility ?? "Refer to official notification."}</p>
            <p>
              Candidates must ensure that they meet the age and educational qualifications before applying. Relaxations
              are provided for SC/ST/OBC and other reserved categories as per government norms.
            </p>
          </div>

          {/* Important Dates */}
          {job.importantDates && (
            <div className="rounded-xl border bg-white dark:bg-card shadow p-6">
              <h2 className="text-xl font-bold mb-4">Important Dates</h2>
              <ul className="space-y-3 text-sm">
                {Object.entries(job.importantDates).map(([key, value]) => (
                  <li key={key} className="flex items-center justify-between">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="font-medium">{String(value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Application Process */}
          <div className="rounded-xl border bg-white dark:bg-card shadow p-6 space-y-3">
            <h2 className="text-xl font-bold">How to Apply</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Visit the official website and go to the recruitment section.</li>
              <li>Read the notification carefully to understand the eligibility criteria.</li>
              <li>Click on the "Apply Online" link and fill in the required details.</li>
              <li>Upload scanned copies of documents, photo, and signature.</li>
              <li>Pay the application fee through the available payment modes.</li>
              <li>Submit the form and take a printout for future reference.</li>
            </ol>
          </div>

          {/* Salary & Benefits */}
          <div className="rounded-xl border bg-white dark:bg-card shadow p-6 space-y-3">
            <h2 className="text-xl font-bold">Salary & Benefits</h2>
            <p>
              The selected candidates will receive a monthly salary of ₹{job.salary ?? "as per norms"}, along with
              additional allowances such as DA, HRA, medical facilities, pension schemes, and leave benefits. The job
              ensures long-term stability and attractive perks that make it one of the most sought-after opportunities.
            </p>
          </div>

          {/* SEO Extra: FAQs */}
          <div className="rounded-xl border bg-white dark:bg-card shadow p-6 space-y-4">
            <h2 className="text-xl font-bold">Frequently Asked Questions (FAQs)</h2>
            <div>
              <p className="font-medium">Q1. What is the last date to apply for {job.title}?</p>
              <p>A1. The last date to apply is {job.importantDates?.lastDate ?? "check notification"}.</p>
            </div>
            <div>
              <p className="font-medium">Q2. How many vacancies are available?</p>
              <p>A2. A total of {job.Post ?? "multiple"} posts have been announced.</p>
            </div>
            <div>
              <p className="font-medium">Q3. What is the minimum eligibility criteria?</p>
              <p>A3. Candidates must have {job.eligibility ?? "required qualifications"} and meet the age criteria.</p>
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border bg-white dark:bg-card shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Application Fee</h3>
            {job.applicationFee ? (
              <ul className="space-y-1 text-sm">
                {Object.entries(job.applicationFee).map(([cat, amt]) => (
                  <li key={cat} className="flex justify-between">
                    <span className="capitalize">{cat}</span>
                    <span>₹{amt}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">N/A</p>
            )}
          </div>

          <div className="rounded-xl border bg-white dark:bg-card shadow p-6 text-sm">
            <p>
              Official Site:{" "}
              {job.links?.official ? (
                <a href={job.links.official} className="text-blue-600 hover:underline" target="_blank">
                  {job.organization}
                </a>
              ) : (
                job.organization
              )}
            </p>
            <p className="mt-2 text-muted-foreground">Updated on: {job.date}</p>
          </div>
        </aside>
      </section>

      {/* Mobile Sticky Apply Bar */}
      {job.links?.apply && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-700 text-white py-3 px-4 flex justify-between items-center shadow-lg lg:hidden">
          <span className="font-medium">{job.title}</span>
          <a
            href={job.links.apply}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg"
          >
            Apply Now
          </a>
        </div>
      )}
    </article>

<section className="rounded-xl border bg-white dark:bg-card shadow p-6 mt-12">
  <h3 className="text-lg font-semibold mb-4">You Can Also Check</h3>
<JobCard data={jobs}/>
</section>


    
    </>
  )
}
