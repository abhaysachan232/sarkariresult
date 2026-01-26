import datas from "@/public/jobs.json";
import StateJobsClient from "./StateJobsClient";

export async function generateMetadata({ params }: any) {
  const currentYear = new Date().getFullYear();
  const stateName = decodeURIComponent(params.slug).replace("-", " ");
  const properState = stateName.replace(/\b\w/g, (char) => char.toUpperCase());

  const title = `${properState} Govt Jobs ${currentYear} | ${properState} Sarkari Result, Vacancy & Recruitment`;
  const description = `Explore the latest ${properState} Government Jobs, Sarkari Result updates, online forms, and exam notifications for ${currentYear}. Stay updated with ${properState} recruitment, vacancy details, and admit card releases.`;

const keywords = [
  `${properState} Govt Jobs ${currentYear}`,
  `${properState} Sarkari Result`,
  `${properState} Vacancy ${currentYear}`,
  `${properState} Recruitment ${currentYear}`,
  `${properState} Government Jobs`,
  `${properState} Sarkari Naukri`,
  `${properState} Admit Card`,
  `${properState} Result`,
  `${properState} Upcoming Vacancy`,
  `${properState} Job Notification`,
  `${properState} Employment News`,
  `${properState} Police Vacancy ${currentYear}`,
  `${properState} Teacher Vacancy`,
  `${properState} Latest Sarkari Jobs`,
  `${properState} Online Form ${currentYear}`,
  `${properState} Rojgar Samachar`,
].join(", ");


  const canonicalUrl = `https://example.com/state/${params.slug}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Sarkari Result Portal",
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function StateJobs({ params }: any) {
  const currentYear = new Date().getFullYear();
  const stateSlug = decodeURIComponent(params.slug);
  const stateName = stateSlug.replace("-", " ");

  const jobList = datas.filter(
    (job: any) =>
      job.state?.toLowerCase() === stateName.toLowerCase() ||
      (Array.isArray(job.state) &&
        job.state.some(
          (s: string) => s.toLowerCase() === stateName.toLowerCase()
        ))
  );

  // ✅ State-Level Structured Schema (Overview + FAQ)
  const stateSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${stateName} Government Jobs ${currentYear}`,
    "description": `Find all the latest ${stateName} Sarkari Result, Government Job vacancies, and recruitment notifications for ${currentYear}. This page lists job openings, eligibility, and important updates for candidates preparing for ${stateName} Govt exams.`,
    "url": `https://sarkariresult.rest//state/${stateSlug}`,
    "about": {
      "@type": "Thing",
      "name": `${stateName} Sarkari Result ${currentYear}`,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sarkari Result Portal",
      "url": "https://sarkariresult.rest/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sarkariresult.rest/jobs-images/logo.png",
      },
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": jobList.slice(0, 15).map((job, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://sarkariresult.rest/${job.title
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
        "name": job.title,
      })),
    },
  };

  // ✅ FAQ Schema (State Level)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How to apply for ${stateName} Govt Jobs ${currentYear}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `You can apply for ${stateName} government jobs online through the official recruitment portal or via Sarkari Result. Make sure to read the eligibility criteria and important dates before applying.`,
        },
      },
      {
        "@type": "Question",
        "name": `Which are the latest ${stateName} Sarkari Results and vacancies?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The latest ${stateName} Sarkari Result updates include Police, Health, Education, and Engineering department recruitments for ${currentYear}.`,
        },
      },
      {
        "@type": "Question",
        "name": `What is the qualification required for ${stateName} Government Jobs?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Candidates with 10th, 12th, ITI, Diploma, Graduation, and Post-Graduation qualifications can apply for different government vacancies in ${stateName}.`,
        },
      },
      {
        "@type": "Question",
        "name": `Is domicile required for ${stateName} Sarkari Jobs?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Some ${stateName} recruitments require domicile certificates, while others are open to all India candidates. Please check the job notification details.`,
        },
      },
    ],
  };

  // ✅ Combine State Schema + FAQ Schema
  const fullSchema = {
    "@context": "https://schema.org",
    "@graph": [stateSchema, faqSchema],
  };

  return (
    <>
      {/* ✅ Inject Structured Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fullSchema) }}
      />

      <StateJobsClient stateName={stateName} jobList={jobList} />
    </>
  );
}
