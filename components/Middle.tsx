
'use client';


import NewsMarquee from "./news-marquee";

import { Button } from "./ui/button";
import LiveTicker from "./live-ticker";
import JobCard from "./job-card";
import Link from "next/link";

import jobs from '../public/jobs.json';
import datas from "../public/articles.json";

export default async function Middle() {

  const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";     


    // console.log(baseUrl);
    
  

  const data = jobs

    const menuItems:any = [    
      { name: "Admit Card", href: "admit-card" ,target:'_blank'},
      { name: "Results", href: "results" ,target:'_blank'},
      { name: "Latest Jobs", href: "latest-jobs",target:'_blank' },
    { name: "Answer Key", href: "answer-key" ,target:'_blank'},
    { name: "Syllabus", href: "syllabus",target:'_blank' },
    { name: "Admission", href: "admission" ,target:'_blank'},
    { name: "Certificate Verification", href: "certificate-verification",target:'_blank' },
    { name: "Important", href: "important",target:'_blank' }
  ]
  return (
<>
      <main className="container py-6">
        {/* News Marquee */}
        <NewsMarquee />

        {/* Search Bar */}
        {/* <div className="mt-6 mb-8 relative">
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
        </div> */}

        {/* Live Ticker */}
        <LiveTicker />

        {/* Category Filters */}
        {/* <CategoryFilter /> */}

        {/* Main Content Tabs */}
<JobCard data={data} selection={menuItems} category={""}/>

        {/* Trending News Section */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Trending News</h2>
            <Link href="#" className="text-sm font-medium text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {datas.map((item, i) => (
              <div key={i} className="rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xs font-medium text-blue-600 mb-2">
                {item.Type}
                </div>
                <h3 className="font-semibold mb-2">
                  {
                    item.title
                  }
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {
                    item.description.substring(0, 100) + '...'
                  }
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{item.datePublished}</span>
                  <Link href={`/article/${item.slug}`}>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    Read More
                  </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
</>
  );
}

