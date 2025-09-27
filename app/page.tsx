
import Link from "next/link"
import { Search, Bell, ChevronDown, Mic, ArrowRight } from "lucide-react"
import JobCard from "@/components/job-card"
import NewsMarquee from "@/components/news-marquee"
import CategoryFilter from "@/components/category-filter"
import LiveTicker from "@/components/live-ticker"
import ThemeToggle from "@/components/theme-toggle"
import ChatbotButton from "@/components/chatbot-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState,useEffect } from "react"
import axios from "axios"
import Middle from "@/components/Middle"
import fs from "fs";
import path from "path";
import { Metadata } from "next"

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
