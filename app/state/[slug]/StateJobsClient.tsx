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
  // ✅ Dynamically detect the current year
  const currentYear = new Date().getFullYear();

  // ✅ SSR-friendly JSON-LD Schema (no useEffect)


  return (
    <main className="container py-8">


      {/* 🏷️ Header */}
      <h1 className="text-3xl font-bold text-center mb-8">
        {stateName} Sarkari Result & Govt Jobs {currentYear}
      </h1>

      {/* 📦 Job Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobList.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/jobs/${job.setpath.split(" ").join("-")}`}>
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

                <h3 className="text-lg font-semibold mb-3 hover:text-blue-600 transition-colors duration-200">
                  {job.title}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <span>{job.organization || "Govt Dept"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span>{job.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span>
                      Last Date: {job.importantDates?.lastDate || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500 italic">
                    {job.qualification || "See Details"}
                  </span>

                  <motion.div whileHover={{ scale: 1.05 }}>
                    <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded-md flex items-center gap-1 hover:bg-blue-700 transition-colors duration-200">
                      View <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 🪶 No Jobs */}
      {jobList.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No jobs found for {stateName}.
        </p>
      )}

      {/* 🧠 SEO Content */}
      <section className="mt-16 bg-gray-50 p-8 rounded-lg border border-gray-200 shadow-sm leading-relaxed">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          {stateName} Sarkari Result – Latest Vacancies, Admit Cards & Results ({currentYear})
        </h2>

        <p className="text-gray-700 mb-5">
          Welcome to the official page for <strong>{stateName} Government Jobs {currentYear}</strong>. 
          Here, candidates can explore all the latest job openings, online forms, admit cards, and results 
          released by the <strong>{stateName} State Government Departments</strong>. Whether you have completed 
          10th, 12th, Graduation, or Post-Graduation, you’ll find a perfect government opportunity that fits your qualification.
        </p>

        <h3 className="text-xl font-semibold mb-3 text-blue-600">
          Top {stateName} Government Departments Offering Jobs in {currentYear}
        </h3>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-gray-700 list-disc pl-5">
          <li><strong>{stateName}</strong> Police, SI & Home Guard Recruitment</li>
          <li><strong>{stateName}</strong> PSC Civil Services & Administrative Jobs</li>
          <li><strong>{stateName}</strong> Teacher (TGT, PGT, Primary) Posts</li>
          <li><strong>{stateName}</strong> Health Department ANM, GNM, Nursing Jobs</li>
          <li><strong>{stateName}</strong> Forest Guard & Wildlife Officer Vacancies</li>
          <li><strong>{stateName}</strong> JE, AE & Technical Department Jobs</li>
          <li><strong>{stateName}</strong> Clerk, Typist & Assistant Vacancies</li>
          <li><strong>{stateName}</strong> Transport Department Driver / Conductor</li>
          <li><strong>{stateName}</strong> Jail Warden & Fireman Recruitment</li>
          <li><strong>{stateName}</strong> Anganwadi Supervisor, Worker & Helper Posts</li>
          <li><strong>{stateName}</strong> Court Clerk & Stenographer Jobs</li>
          <li><strong>{stateName}</strong> Agriculture Officer & Krishi Assistant Jobs</li>
          <li><strong>{stateName}</strong> Municipal Corporation & Urban Development Jobs</li>
          <li><strong>{stateName}</strong> Public Health Engineering & PWD Vacancies</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3 text-blue-600">
          Why Choose {stateName} Sarkari Jobs ({currentYear})
        </h3>
        <p className="text-gray-700 mb-5">
          The government of {stateName} provides excellent career opportunities with stable income, 
          pension benefits, housing allowances, and long-term security. Every year, thousands of 
          candidates apply for different posts like Police Constable, Clerk, and Engineers under 
          {stateName} Public Service Commission and other recruitment boards.
        </p>

        <h3 className="text-xl font-semibold mb-3 text-blue-600">
          Stay Updated with {stateName} Sarkari Result ({currentYear})
        </h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Visit this page daily for fresh <strong>{stateName} job notifications</strong>.</li>
          <li>Apply only through official state portals and read the PDF notice carefully.</li>
          <li>Join Telegram or Email alerts for instant job updates.</li>
          <li>Prepare for exams according to the latest syllabus and pattern.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3 text-blue-600">
          Conclusion
        </h3>
        <p className="text-gray-700">
          Whether you’re preparing for <strong>clerical jobs, technical roles, or administrative services</strong>,
          this page provides authentic, fast, and regularly updated information for all <strong>{stateName} Sarkari Result {currentYear}</strong> notifications. 
          Bookmark this page and stay ahead for upcoming government opportunities.
        </p>
      </section>
    </main>
  );
}
