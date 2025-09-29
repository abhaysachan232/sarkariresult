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
      admitCard?: string;
      result?: string;
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
    keywords: `${job.title}, ${job.category}, ${job.organization}, Sarkari Naukri,result sarkari result, Government Jobs`,
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
      admitCard?: string;
      result?: string;
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
console.log(job);

  return (<>

    <Head>
      <title>{`${slug} - Sarkari Result Job Portal`}</title>
      <meta name="description" content={job.description} />
      <meta
        name="keywords"
        content={`${slug} ${job.title}, ${job.category},result sarkari result, Sarkari Naukri, Government Jobs`}
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
            <span className="px-3 py-1 text-sm bg-white/20 rounded-full">{job.Type}</span>
            {job.Post && <span className="px-3 py-1 text-sm bg-white/20 rounded-full">Vacancies: {job.Post}</span>}
          </div>
    <div className="mt-6 flex flex-wrap gap-3">
  {job.links?.notification && (
    <a
      href={job.links.notification}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-2 rounded-lg bg-white text-blue-700 font-semibold border border-white hover:bg-blue-100"
    >
      📄 Notification
    </a>
  )}
  {job.links?.apply && (
    <a
      href={job.links.apply}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 shadow-lg"
    >
      📝 Apply Now
    </a>
  )}
  {job.links?.admitCard && (
    <a
      href={job.links.admitCard}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
    >
      🎫 Download Admit Card
    </a>
  )}
  {job.links?.result && (
    <a
      href={job.links.result}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-2 rounded-lg bg-white text-blue-700 font-semibold border border-white hover:bg-blue-100"
    >
      ✅ Check Result
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

            <h2><b>About {job.organization}</b></h2>
             <p>
        <b><i>{job.organization}</i></b> is one of the most trusted recruitment bodies in India, well-known for
        conducting large-scale examinations. Aspirants who follow <b>Sarkari Result</b> updates regularly will find
        this recruitment highly beneficial, as it offers an authentic chance to secure a government job with
        transparency and efficiency.
      </p>

      <h2><b>About the {job.title}</b></h2>
      <p>
        The <b>{job.title}</b> notification released by <b>{job.organization}</b> is a major highlight in the{" "}
        <b>Sarkari Result</b> job listings. It gives candidates a golden opportunity to build a long-term career in
        the government sector. Every year, thousands of aspirants check <b>Sarkari Result</b> for the latest
        updates, and this recruitment has already gained significant attention due to its attractive benefits and
        job security.
      </p>

      <h2><b>Key Highlights of {job.title}</b></h2>
      <ul className="list-disc list-inside space-y-2">
        <li><b>Organization:</b> {job.organization}</li>
        <li><b>Post Name:</b> {job.title}</li>
        <li><b>Total Vacancies:</b> {job.Post}</li>
        <li><b>Salary:</b> {job.salary}</li>
        <li><b>Age Limit:</b><span dangerouslySetInnerHTML={{ __html: job.age ?? "N/A" }}></span> </li>
        <li><b>Application Start Date:</b> {job.importantDates.start}</li>
        <li><b>Application Last Date:</b> {job.importantDates.lastDate}</li>
        <li><b>Exam Date:</b> {job.importantDates.examDate}</li>
        <li><b>Official Website:</b> {job.links?.official ?? "N/A"}</li>
      </ul>
      <p>
        For complete details, aspirants are advised to visit the official site or check trusted sources like{" "}
        <b>Sarkari Result</b> for authentic job information and timely updates.
      </p>

      <h2><b>Eligibility Criteria</b></h2>
      <p>
        Candidates checking <b>Sarkari Result</b> for the <b>{job.title}</b> post must carefully go through the
        eligibility conditions. These include educational qualifications, age requirements, and sometimes skill-based
        conditions. Here is a quick overview:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li><b>Educational Qualification:</b> {job.qualification}</li>
        {/* <li><b>Age Limit:</b> {job.age}</li> */}
        {/* <li><b>Other Requirements:</b> {job.otherRequirements}</li> */}
      </ul>

      <h2><b>Job Responsibilities</b></h2>
      <p>
        According to the official <b>Sarkari Result</b> job notification, selected candidates for{" "}
        <b>{job.title}</b> will have the following roles and responsibilities:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>Maintaining and updating official records.</li>
        <li>Assisting senior officers in daily operations.</li>
        <li>Handling clerical work like data entry, documentation, and file management.</li>
        <li>Supporting smooth communication between departments.</li>
        <li>Performing additional tasks as assigned by higher authorities.</li>
      </ul>

      <h2><b>Salary and Benefits</b></h2>
      <p>
        A major reason why aspirants search for this recruitment on <b>Sarkari Result</b> is the attractive salary
        package. The monthly salary for the <b>{job.title}</b> post is <b>{job.salary}</b>, along with allowances
        like DA, HRA, Travel Allowance, and Medical Facilities. In addition, candidates enjoy pension benefits,
        gratuity, and career progression opportunities.
      </p>

      <h2><b>Application Process</b></h2>
      <p>
        Candidates must submit their applications online via the official website of <b>{job.organization}</b>. The
        application window opens on <b>{job.importantDates.start}</b> and will close on <b>{job.importantDates.lastDate}</b>. Detailed step-by-step
        guidance is usually available on trusted portals like <b>Sarkari Result</b>, where candidates can cross-check
        instructions to avoid mistakes during form filling.
      </p>

      <h2><b>Selection Process</b></h2>
      <p>
        The recruitment process for <b>{job.title}</b> typically includes a written examination followed by skill
        tests or interviews, depending on the nature of the post. Exam details, syllabus, and admit card updates are
        frequently covered on <b>Sarkari Result</b>, making it a reliable platform for aspirants.
      </p>

      <h2><b>Why Follow Sarkari Result for {job.title} Updates?</b></h2>
      <p>
        <b>Sarkari Result</b> has become the go-to platform for millions of aspirants who wish to stay updated with
        the latest government job notifications. By checking <b>Sarkari Result</b>, candidates applying for{" "}
        {job.title} under {job.organization} can ensure they never miss important updates like exam dates,
        admit card releases, or result announcements.
      </p>

      <h2><b>Important Dates</b></h2>
      <ul className="list-disc list-inside space-y-2">
        {/* <li><b>Notification Release Date:</b> {job.notificationDate}</li> */}
        <li><b>Application Start Date:</b> {job.importantDates.start}</li>
        <li><b>Application Last Date:</b> {job.importantDates.lastDate}</li>
        <li><b>Admit Card Release Date:</b> {job.importantDates.admitCard}</li>
        <li><b>Exam Date:</b> {job.importantDates.examDate}</li>
        <li><b>Result Declaration:</b> {job.importantDates.ResultDeclaredDate}</li>
      </ul>

      <h2><b>Conclusion</b></h2>
      <p>
        The <b>{job.title}</b> recruitment by <b>{job.organization}</b> is one of the top opportunities listed on{" "}
        <b>Sarkari Result</b>. With stable salary, allowances, retirement benefits, and promotional avenues, this job
        is highly recommended for aspirants. Candidates are strongly advised to apply before{" "}
        <b>{job.importantDates.lastDate}</b> and keep checking <b>Sarkari Result</b> for the latest notifications, admit cards, and
        result updates.
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
                  <td className="px-4 py-2" dangerouslySetInnerHTML={{ __html: job.age ?? "N/A" }}></td>
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
                  <td className="px-4 py-2"  dangerouslySetInnerHTML={{ __html:job.eligibility ?? "Not specified" }}></td>
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
