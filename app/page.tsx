import Middle from "@/components/Middle";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import ClientOnly from "@/components/ClientOnly";

const STATE_LINKS = [
  { name: "UP Govt Jobs", slug: "/state/uttar-pradesh" },
  { name: "Bihar Govt Jobs", slug: "/state/bihar" },
  { name: "MP Govt Jobs", slug: "/state/madhya-pradesh" },
  { name: "Rajasthan Govt Jobs", slug: "/state/rajasthan" },
  { name: "Delhi Govt Jobs", slug: "/state/delhi" },
  { name: "Haryana Govt Jobs", slug: "/state/haryana" },
  { name: "Jharkhand Govt Jobs", slug: "/state/jharkhand" },
  { name: "Punjab Govt Jobs", slug: "/state/punjab" },
  { name: "Gujarat Govt Jobs", slug: "/state/gujarat" },
  { name: "Maharashtra Govt Jobs", slug: "/state/maharashtra" }
];

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "sarkariresult.rest";
  const proto = headersList.get("x-forwarded-proto") || "https";
  const url = `${proto}://${host}`;

  return {
    title: "Sarkari Result - Latest Government Jobs, Results, Admit Cards",
    description:
      "Sarkari Result: Latest government jobs, admit cards, exam results, answer keys, recruitment notifications, and online forms updates.",
    keywords:
      "Sarkari Result, Government Jobs, Sarkari Naukri, Latest Jobs, Admit Card, Results, Online Form",
    alternates: { canonical: url },
    icons: {
      icon: "/favicon/favicon.ico",
      shortcut: "/favicon/icon1.png",
      other: [
        { rel: "manifest", url: "/favicon/manifest.json" }
      ]
    },
  };
}

export default async function Home() {
  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      
      {/* Title / H1 */}
      <header className="text-center pt-4">
        <h1 className="text-2xl font-bold text-primary">
          Sarkari Result – Latest Govt Jobs, Results, Admit Cards
        </h1>
        <Analytics />
      </header>

      {/* Main Job Listings (Top Priority for SEO) */}
      <main className="mt-4">
        <Middle />
      </main>

      {/* Quick Category Links */}
      <section className="mt-6 px-4 text-center">
        <h2 className="text-xl font-semibold mb-3">Explore Top Categories</h2>
        <nav className="flex flex-wrap justify-center gap-3 text-sm">
          <Link  href="/latest-jobs" className="hover:underline text-blue-600">Latest Jobs</Link>
          <Link href="/admit-card" className="hover:underline text-blue-600">Admit Cards</Link>
          <Link href="/results" className="hover:underline text-blue-600">Results</Link>
          {/* <Link href="/bank-jobs" className="hover:underline text-blue-600">Bank Jobs</Link> */}
          {/* <Link href="/railway-jobs" className="hover:underline text-blue-600">Railway Jobs</Link> */}
        </nav>
      </section>

      {/* State Wise Jobs Section */}
      <section className="mt-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-center">State Wise Sarkari Naukri</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4 text-sm">
            {STATE_LINKS.map((s) => (
              <Link
                key={s.slug}
                href={s.slug}
                rel="canonical"
                className="block p-2 border rounded-md hover:border-primary hover:shadow-sm transition text-center"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Small SEO Description */}
      <footer className="px-4 mt-12 pb-10 text-center text-sm text-muted-foreground">
        <p className="max-w-3xl mx-auto leading-relaxed">
          SarkariResult.rest provides real-time updates on Government job
          vacancies, admit cards, results, application forms and recruitment
          alerts across India. Check state wise pages for focused job listings
          with easy online apply links.
        </p>
      </footer>

    </div>
  );
}
