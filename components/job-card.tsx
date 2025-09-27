"use client"

import React from "react";
import { motion } from "framer-motion"
import { Calendar, Building2, Clock, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import axios from 'axios'
import { Tabs } from "@radix-ui/react-tabs"
import { TabsContent } from "@radix-ui/react-tabs"
import { ArrowRight } from "lucide-react"

interface JobCardProps {
  data:any
}

export default function JobCard({data }: JobCardProps) {
  console.log('data',data);
  

  // Dummy jobs array and visibleCount for demonstration
  const job = Array.isArray(data) ? data : [];
  const [visibleCount, setVisibleCount] = React.useState(6);

  // Dummy jobTypes array for demonstration
  const jobTypes = ["Full Time", "Part Time", "Contract", "Internship"];

  // Dummy jobTitles array for demonstration
  const jobTitles = [
    "Software Engineer",
    "Data Analyst",
    "Project Manager",
    "Marketing Specialist",
    "Accountant",
    "HR Executive",
    "Sales Manager",
    "Graphic Designer",
    "Content Writer"
  ];

  // Dummy organizations array for demonstration
  const organizations = [
    "Tech Corp",
    "Data Solutions",
    "Project Hub",
    "Market Masters",
    "Finance Group",
    "HR Connect",
    "Sales Force",
    "Design Studio",
    "Content Creators"
  ];

  // Define handleLoadMore function
  function handleLoadMore() {
    setVisibleCount((prev) => prev + 9);
  }



  return (


    <>
            <Tabs defaultValue="latest-jobs" className="mt-8">
          <TabsContent value="latest-jobs" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
{
  data.map((jobs: any, index: number) => {
    return(
      <>
<motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      key={index + jobs}

    >
      <Link rel="canonical" href={`/jobs/${jobs.title.split(" ").join("-")}`} className="block h-full">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-950 dark:text-blue-400"
          >
            {jobs.Type}
          </Badge>
          <Badge
            variant={index > 10  ? "destructive" : "outline"}
            className={
              index > 10 
                ? ""
                : "bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-950 dark:text-green-400"
            }
          >
            {index > 10  ? "Closing Soon" : "New"}
          </Badge>
        </div>
        <h3 className="text-lg font-semibold mb-2">{jobs.title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Building2 className="mr-2 h-4 w-4" />
            <span>{jobs.organization}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              Posted on:{" "}
              {new Date(2023, 2, 15 + index).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>
              Last Date:{" "}
              {new Date(2023, 3, 15 + index).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-muted-foreground">Qualification:</span>
            <span className="text-xs ml-1">{["Graduate", "12th Pass", "10th Pass", "Post Graduate"][index % 4]}</span>
          </div>
          <motion.div >
            <Button asChild size="sm" className="gap-1">
              <div>
                Apply Now
                <ArrowUpRight className="h-3 w-3" />
           </div>
            </Button>
          </motion.div>
        </div>
      </div>
      </Link>
    </motion.div>
      </>
    )
  })
}
            </div>

            {/* Load More */}
            {visibleCount < job.length&& job.length>9 && (
              <div className="mt-8 flex justify-center">
                <Button className="gap-2" onClick={handleLoadMore}>
                  Load More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
    </>


    
  )
}
