// "use client"

// import React from "react";
// import { motion } from "framer-motion"
// import { Calendar, Building2, Clock, ArrowUpRight } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import Link from "next/link"
// import axios from 'axios'
// import { Tabs } from "@radix-ui/react-tabs"
// import { TabsContent } from "@radix-ui/react-tabs"
// import { ArrowRight } from "lucide-react"

// interface JobCardProps {
//   data:any
// }

// export default function JobCard({data }: JobCardProps) {
//   // console.log('data',data);

//   // Dummy jobs array and visibleCount for demonstration
//   const job = Array.isArray(data) ? data : [];
//   const [visibleCount, setVisibleCount] = React.useState(6);

//   // Dummy jobTypes array for demonstration
//   const jobTypes = ["Full Time", "Part Time", "Contract", "Internship"];

//   // Dummy jobTitles array for demonstration
//   const jobTitles = [
//     "Software Engineer",
//     "Data Analyst",
//     "Project Manager",
//     "Marketing Specialist",
//     "Accountant",
//     "HR Executive",
//     "Sales Manager",
//     "Graphic Designer",
//     "Content Writer"
//   ];

//   // Dummy organizations array for demonstration
//   const organizations = [
//     "Tech Corp",
//     "Data Solutions",
//     "Project Hub",
//     "Market Masters",
//     "Finance Group",
//     "HR Connect",
//     "Sales Force",
//     "Design Studio",
//     "Content Creators"
//   ];

//   // Define handleLoadMore function
//   function handleLoadMore() {
//     setVisibleCount((prev) => prev + 9);
//   }

//   return (

//     <>
//             <Tabs defaultValue="latest-jobs" className="mt-8">
//           <TabsContent value="latest-jobs" className="mt-6">
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
// {
//   data.map((jobs: any, index: number) => {
//     return(
//       <>
// <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3, delay: index * 0.1 }}
//       className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow"
//       key={index + jobs}

//     >
//       <Link  href={`/jobs/${jobs.title.split(" ").join("-")}`} className="block h-full">
//       <div className="p-6">
//         <div className="flex justify-between items-start mb-3">
//           <Badge
//             variant="outline"
//             className="bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-950 dark:text-blue-400"
//           >
//             {jobs.Type}
//           </Badge>
//           <Badge
//             variant={index > 10  ? "destructive" : "outline"}
//             className={
//               index > 10
//                 ? ""
//                 : "bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-950 dark:text-green-400"
//             }
//           >
//             {index > 10  ? "Closing Soon" : "New"}
//           </Badge>
//         </div>
//         <h3 className="text-lg font-semibold mb-2">{jobs.title}</h3>
//         <div className="space-y-2 mb-4">
//           <div className="flex items-center text-sm text-muted-foreground">
//             <Building2 className="mr-2 h-4 w-4" />
//             <span>{jobs.organization}</span>
//           </div>
//           <div className="flex items-center text-sm text-muted-foreground">
//             <Calendar className="mr-2 h-4 w-4" />
//             <span>
//               Posted on: {jobs.date}
//             </span>
//           </div>
//           <div className="flex items-center text-sm text-muted-foreground">
//             <Clock className="mr-2 h-4 w-4" />
//             <span>
//               Last Date: {jobs.importantDates.lastDate}
//             </span>
//           </div>
//         </div>
//         <div className="flex justify-between items-center">
//           <div>
//             <span className="text-xs text-muted-foreground">Qualification:</span>
//             <span className="text-xs ml-1">{jobs.qualification}</span>
//           </div>
//           <motion.div >
//             <Button asChild size="sm" className="gap-1">
//               <div>
//                 Apply Now
//                 <ArrowUpRight className="h-3 w-3" />
//            </div>
//             </Button>
//           </motion.div>
//         </div>
//       </div>
//       </Link>
//     </motion.div>
//       </>
//     )
//   })
// }
//             </div>

//             {/* Load More */}
//             {visibleCount < job.length&& job.length>9 && (
//               <div className="mt-8 flex justify-center">
//                 <Button className="gap-2" onClick={handleLoadMore}>
//                   Load More
//                   <ArrowRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//     </>

//   )
// }

"use client";

import React from "react";
import Link from "next/link";

interface JobCardProps {
  data: any;
  selection: any;
  category?: string;
}

export default function JobCard({ data, selection, category }: JobCardProps) {
  console.log(category);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px",
        padding: "20px",
      }}
    >
      {selection.map((item: any) => {
        // Jobs of this category
        const categoryJobs = data
          .filter((job: any) => job.category === item.href)
          .sort((a: any, b: any) => b.id - a.id); // descending by id

        // Top 3 jobs of this category
        const top3JobIds = categoryJobs.slice(0, 3).map((job: any) => job.id);

        return (
          <div
            key={item.href}
            style={{
              border: "2px solid #990000",
              backgroundColor: "#ffffff",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: "#990000",
                color: "#ffffff",
                textAlign: "center",
                padding: "10px 0",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              {item.href.toUpperCase()}
            </div>

            {/* Jobs List */}
            <ul style={{ listStyle: "disc", padding: "15px 20px", margin: 0 }}>
              {categoryJobs.map((job: any, index: number) => (
                <li key={index} style={{ marginBottom: "10px", fontSize: "14px" }}>
                  <Link href={`/jobs/${job.setPath.split(" ").join("-")}`}>
                    <span
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      {job.title}
                    </span>
                  </Link>

                  {/* NEW Badge for top 3 jobs in this category */}
                  {top3JobIds.includes(job.id) && (
                    <span
                      style={{
                        backgroundColor: "green",
                        color: "white",
                        fontWeight: "bold",
                        padding: "2px 6px",
                        marginLeft: "8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    >
                      NEW
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {/* Show More Link if more than 50 jobs */}
            {categoryJobs.length > 50 && (
              <div style={{ textAlign: "right", padding: "10px 20px 15px" }}>
                <Link href={`/${item.href}`}>
                  <span
                    style={{
                      color: "green",
                      fontWeight: "bold",
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontSize: "14px",
                    }}
                  >
                    Show More &raquo;
                  </span>
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}