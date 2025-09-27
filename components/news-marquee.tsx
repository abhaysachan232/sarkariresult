"use client"

import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

export default function NewsMarquee() {
  const news = [
    "UPSC Civil Services 2023 Application Deadline Extended to April 15",
    "SSC CGL 2023 Notification Released - Apply Before May 3",
    "IBPS PO 2023 Results Announced - Check Now",
    "Railway RRB NTPC Result for CBT-2 Declared",
    "NTA JEE Main 2023 April Session Registration Starts",
  ]

  return (
    <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-2 flex items-center overflow-hidden">
      <div className="flex-shrink-0 bg-blue-600 text-white p-1.5 rounded-md mr-3">
        <AlertCircle className="h-4 w-4" />
      </div>
      <div className="overflow-hidden relative w-full">
        <motion.div
          animate={{ x: "-100%" }}
          transition={{
            ease: "linear",
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
          }}
          className="whitespace-nowrap"
        >
          {news.map((item, index) => (
            <span key={index} className="inline-block mx-4">
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
