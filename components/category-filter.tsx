"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = ["All", "Government", "Banking", "Railway", "Defence", "Teaching", "SSC", "UPSC", "Police"]

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Browse by Category</h2>
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        {categories.map((category) => (
          <motion.div key={category} whileTap={{ scale: 0.95 }}>
            <Button
              variant={activeCategory === category ? "default" : "outline"}
              className="whitespace-nowrap"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
