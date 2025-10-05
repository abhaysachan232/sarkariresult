import Middle from "@/components/Middle";
import { Metadata } from "next";
import { headers } from "next/headers";
import NotificationButton from "../components/NotificationButton";
import ClientOnly from "@/components/ClientOnly";
import NotificationWrapper from "@/components/NotificationWrapper";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "sarkariresult.rest";
  const proto = headersList.get("x-forwarded-proto") || "https";
  const url = `${proto}://${host}`;

  return {
    title: "SarkariResult - Latest Government Jobs, Results, Admit Cards",
    description:
      "Find latest government jobs, results, admit cards, answer keys and more at SarkariResult.rest",
    keywords:
      "Sarkari Result, Sarkari Naukri, Government Jobs, Admit Cards, Results",
    alternates: { canonical: url },
    openGraph: {
      title: "SarkariResult - Government Jobs Portal",
      description:
        "Find latest government jobs, results, admit cards, answer keys and more.",
      url: url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "SarkariResult - Government Jobs Portal",
      description:
        "Find latest government jobs, results, admit cards, answer keys and more.",
    },
  };
}

export default async function Home() {
  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning={true}>
      <div className="centre" style={{display:'flex',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
      <h1>Sarkari Result - Latest Government Jobs, Results, Admit Cards</h1>

      </div>
      {/* Header */}
      <ClientOnly>
  <div > {/* reserve space */}
    <NotificationButton />
  </div>
</ClientOnly>
      <Middle />


      {/* Client-only Notifications
      <ClientOnly>
        <NotificationButton />
      </ClientOnly> */}
    </div>
  );
}
