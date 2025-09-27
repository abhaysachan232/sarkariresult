import type { Metadata } from "next"
import { seoConfig } from "./seo-config"

type SEOProps = {
  title: string
  description: string
  url: string
  keywords?: string[]
  author?: string
  type?: "website" | "article" | "profile"
  image?: string
  publishedTime?: string
  modifiedTime?: string
}

export function generateSEO({
  title,
  description,
  url,
  keywords = [],
  author = "Sarkari Result Team",
  type = "website",
  image = seoConfig.defaultImage,
  publishedTime,
  modifiedTime,
}: SEOProps): Metadata {
  return {
    title: `${title} - ${seoConfig.siteName}`,
    description,
    keywords,
    authors: [{ name: author }],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: seoConfig.siteName,
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  }
}
