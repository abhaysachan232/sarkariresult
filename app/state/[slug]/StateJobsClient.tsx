"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Building2, Calendar, Clock, ArrowUpRight } from "lucide-react";

export default function StateJobsClient({
  stateName,
  jobList,
}: {
  stateName: string;
  jobList: any[];
}) {
  return (
    <main className="container py-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        {stateName} Sarkari Result & Govt Jobs 2025
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobList.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
          >
            <Link href={`/jobs/${job.title.split(" ").join("-")}`}>
              <div className="p-6">
                <div className="flex justify-between text-xs mb-3">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded-sm">
                    {job.Type || "Job"}
                  </span>
                  {index < 3 ? (
                    <span className="bg-green-600 text-white px-2 py-1 rounded-sm">New</span>
                  ) : (
                    <span className="bg-yellow-500 text-black px-2 py-1 rounded-sm">Open</span>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-3">{job.title}</h3>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{job.organization || "Govt Dept"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{job.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      Last Date: {job.importantDates?.lastDate || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {job.qualification || "See Details"}
                  </span>

                  <motion.div whileHover={{ scale: 1.05 }}>
                    <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded-md flex items-center gap-1">
                      View <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {jobList.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No jobs found for {stateName}
        </p>
      )}
    </main>
  );
}
