"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, KeyboardEvent } from "react";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative">
        {/* Search Icon */}
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search Sarkari Result, Jobs, Admit Card, Syllabus..."
          className="w-full pl-11 pr-28 py-3 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-600
                     text-sm"
        />

        {/* Button */}
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2
                     bg-blue-600 text-white px-4 py-2 rounded-md
                     hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>
    </div>
  );
}
