

import Middle from "@/components/Middle"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {

  return {
    title: "SarkariResult - Latest Government Jobs, Results, Admit Cards",
    description: "Find latest government jobs, results, admit cards, answer keys and more at SarkariResult.rest",
    keywords: "Sarkari Result, Sarkari Naukri, Government Jobs, Admit Cards, Results",
    alternates: { canonical: "https://sarkariresult.rest" },
    openGraph: {
      title: "SarkariResult - Government Jobs Portal",
      description: "Find latest government jobs, results, admit cards, answer keys and more.",
      url: "https://sarkariresult.rest",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "SarkariResult - Government Jobs Portal",
      description: "Find latest government jobs, results, admit cards, answer keys and more.",
    },
  };
}
export default async function Home() {

  // console.log(data);

  return (
    <>

    <div className="min-h-screen bg-background">
      
      {/* Header */}

<Middle  />



    </div>
        </>
  )
}
