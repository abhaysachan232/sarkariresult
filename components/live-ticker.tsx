"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

export default function LiveTicker() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const updates = [
    "UPSC Civil Services 2023 Application Deadline in 3 days",
    "SSC CGL 2023 Notification Released - Apply Now",
    "IBPS PO 2023 Results Announced - Check Now",
    "Railway RRB NTPC Result for CBT-2 Declared",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % updates.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [updates.length])

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg p-3 flex items-center">
      <div className="flex-shrink-0 mr-3 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span className="font-semibold">Live Updates:</span>
      </div>
      <div className="overflow-hidden h-6 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center"
          >
            <span>{updates[currentIndex]}</span>
            {currentIndex === 0 && (
              <Badge variant="outline" className="ml-2 bg-red-500 text-white border-red-500">
                Urgent
              </Badge>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
