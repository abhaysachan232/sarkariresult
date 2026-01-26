import Middle from "@/components/Middle";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
// import { Analytics } from "@vercel/analytics/next";
import SearchBox from "@/components/SearchBox";
import Disadunit from "@/components/disadunit";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "education.sarkariresult.rest";
  const proto = headersList.get("x-forwarded-proto") || "https";
  const url = `${proto}://${host}`;

  return {
    title: `Sarkari Result ${new Date().getFullYear()} | Latest Govt Jobs, Results, Admit Card`,
    description:
      "Sarkari Result: Latest government jobs, admit cards, exam results, answer keys, recruitment notifications, and online forms updates.",
    keywords:
      "Sarkari Result, Government Jobs, Sarkari Naukri, Latest Jobs, Admit Card, Results, Online Form",

    alternates: { canonical: url },

    icons: {
      icon: "/fevicons/favicon.ico",
      shortcut: "/fevicons/icon1.png",
      other: [{ rel: "manifest", url: "/fevicons/manifest.json" }],
    },

    /* ✅ WebSite + SearchBox Schema */
    // other: {
    //   "application/ld+json": JSON.stringify({
    //     "@context": "https://schema.org",
    //     "@type": "WebSite",
    //     "name": "education.sarkariresult.rest",
    //     "url": url,
    //     "potentialAction": {
    //       "@type": "SearchAction",
    //       "target": `${url}/search?q={search_term_string}`,
    //       "query-input": "required name=search_term_string"
    //     }
    //   })
    // }
  };
}

export default async function Home() {
  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      {/* Title / H1 */}
      <header className="text-center pt-4">
        <h1 className="text-2xl font-bold text-primary">
          Sarkari Result {new Date().getFullYear()}
        </h1>
        <h2 className="text-xl font-bold text-primary">
          Latest Government Jobs, Results, Admit Cards & Answer Keys
        </h2>
        {/* <Analytics /> */}
      </header>
      <div className="py-6">
        <SearchBox />
      </div>
<Middle />
      <footer className="px-4 mt-12 pb-10 text-center text-sm text-muted-foreground">
        <p className="max-w-3xl mx-auto leading-relaxed">
          education.sarkariresult.rest provides real-time updates on Government job
          vacancies, admit cards, results, application forms and recruitment
          alerts across India. Check state wise pages for focused job listings
          with easy online apply links.
        </p>
      </footer>
    </div>
  );
}
