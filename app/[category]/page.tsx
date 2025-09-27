
import NewsMarquee from "@/components/news-marquee";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import LiveTicker from "@/components/live-ticker";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import JobCard from "@/components/job-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState , useEffect } from "react";
import axios from "axios";
import fs from "fs";
import path from "path";
import { Metadata } from "next"

type Params = { category?: string };


export async function generateMetadata(): Promise<Metadata> {

  return {
    title: "SarkariResult - Latest Government Jobs, Results, Admit Cards",
    description: "Find latest government jobs, results, admit cards, answer keys and more at SarkariResult.com",
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

export default async function Middle({
  params,
}: {
  params: { category: string }; // use resolved type
}) {
  const selectedCategory = params.category;

  if (!selectedCategory || selectedCategory === "favicon.ico") return null;


       console.log(selectedCategory);
       
 const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

    // console.log(baseUrl);
    
  const res = await fetch(`${baseUrl}/jobs.json`, { next: { revalidate: 600 } });

  if (!res.ok) {
    throw new Error("Failed to fetch data.json");
  }

  type Job = {
    category: string;
    // add other fields as needed
    [key: string]: any;
  };

  // You need to define selectedCategory or use 'category' from params

  const jobs: Job[] = await res.json();
  const data = jobs.filter((job: Job) => job.category === selectedCategory);

  return (
<>
      <main className="container py-6">
        {/* News Marquee */}
        <NewsMarquee />

        {/* Search Bar */}
        <div className="mt-6 mb-8 relative">
          <div className="flex w-full max-w-4xl mx-auto items-center space-x-2 overflow-hidden rounded-full border bg-background px-3 shadow-sm focus-within:ring-1 focus-within:ring-ring">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for jobs, exams, results..."
              className="flex h-12 w-full border-0 bg-transparent p-2 text-sm ring-0 focus-visible:outline-none focus-visible:ring-0"
            />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Mic className="h-4 w-4" />
              <span className="sr-only">Voice search</span>
            </Button>
          </div>
          <div className="absolute inset-x-0 top-full mt-1 max-w-4xl mx-auto z-10 hidden">
            <div className="rounded-lg border bg-background p-2 shadow-md">
              <div className="space-y-1">
  
              </div>
            </div>
          </div>
        </div>

        {/* Live Ticker */}
        <LiveTicker />

        {/* Category Filters */}
        {/* <CategoryFilter /> */}

        {/* Main Content Tabs */}
<JobCard data={data}/>

        {/* Trending News Section */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Trending News</h2>
            <Link href="#" className="text-sm font-medium text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xs font-medium text-blue-600 mb-2">
                  {["Exam Notification", "Application Alert", "Result Update"][i % 3]}
                </div>
                <h3 className="font-semibold mb-2">
                  {
                    [
                      "UPSC Civil Services 2023 Application Deadline Extended",
                      "SSC CGL 2023 Notification Released - Apply Now",
                      "IBPS PO 2023 Results Announced - Check Now",
                    ][i % 3]
                  }
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {
                    [
                      "The Union Public Service Commission has extended the application deadline for Civil Services Examination 2023...",
                      "Staff Selection Commission has released the notification for Combined Graduate Level Examination 2023...",
                      "Institute of Banking Personnel Selection has announced the results for Probationary Officer Examination 2023...",
                    ][i % 3]
                  }
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">March 15, 2023</span>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    Read More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
</>
  );
}

