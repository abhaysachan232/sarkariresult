"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";

// ✅ Your real JSON files
import jobsData from "../../public/jobs.json";
import articlesData from "../../public/articles.json";

type FilterType = "all" | "jobs" | "articles";

export default function SearchPage() {
  const params = useSearchParams();
  const query = params.get("q")?.toLowerCase().trim() || "";

  const [filter, setFilter] = useState<FilterType>("all");

  /* 🔵 JOB SEARCH – ONLY TITLE */
  const jobResults = useMemo(() => {
    if (!query) return [];
    return jobsData.filter((job: any) =>
      job.title?.toLowerCase().includes(query)
    );
  }, [query]);

  /* 🟢 ARTICLE SEARCH – ONLY TITLE */
  const articleResults = useMemo(() => {
    if (!query) return [];
    return articlesData.filter((article: any) =>
      article.title?.toLowerCase().includes(query)
    );
  }, [query]);

  const totalResults = jobResults.length + articleResults.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* 🔍 Heading */}
      <h1 className="text-xl font-semibold mb-4">
        Search Results for:
        <span className="text-blue-600"> {query}</span>
      </h1>

      {/* 🔘 FILTER TABS */}
      <div className="flex gap-3 mb-6">
        <FilterBtn
          label={`All (${totalResults})`}
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        <FilterBtn
          label={`Jobs (${jobResults.length})`}
          active={filter === "jobs"}
          onClick={() => setFilter("jobs")}
        />
        <FilterBtn
          label={`Articles (${articleResults.length})`}
          active={filter === "articles"}
          onClick={() => setFilter("articles")}
        />
      </div>

      {/* 🔵 JOB RESULTS */}
      {(filter === "all" || filter === "jobs") && jobResults.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">Jobs & Notifications</h2>
          <ul className="space-y-3">
            {jobResults.map((job: any) => (
              <li key={job.id} className="border p-3 rounded">
                <Link
                  href={`/jobs/${job.setPath.split(" ").join("-")}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {job.title}
                </Link>
                {job.organization && (
                  <p className="text-sm text-gray-500">
                    {job.organization}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 🟢 ARTICLE RESULTS */}
      {(filter === "all" || filter === "articles") && articleResults.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Articles & Guides</h2>
          <ul className="space-y-3">
            {articleResults.map((article: any) => (
              <li key={article.id} className="border p-3 rounded">
                <Link
                  href={`/article/${article.slug}`}
                  className="text-green-600 font-medium hover:underline"
                >
                  {article.title}
                </Link>
                {article.description && (
                  <p className="text-sm text-gray-500">
                    {article.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ❌ NO RESULTS */}
      {query && totalResults === 0 && (
        <p className="text-gray-600">
          No results found for "<b>{query}</b>"
        </p>
      )}
    </div>
  );
}

/* 🔘 Filter Button Component */
function FilterBtn({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded border text-sm font-medium ${
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}
