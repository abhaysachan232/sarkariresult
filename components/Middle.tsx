"use client";


import { Button } from "./ui/button";

import Link from "next/link";

import datas from "../public/articles.json";

export default function Middle() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  return (
    <>
      <main className="container py-6">
        {/* Trending News Section */}
        <section className="mt-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {datas.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-xs font-medium text-blue-600 mb-2">
                  {item.Type}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {item.description.substring(0, 100) + "..."}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {item.datePublished}
                  </span>
                  <Link href={`/article/${item.slug}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Read More
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
