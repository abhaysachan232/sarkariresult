import { NextSeo } from "next-seo"

interface SeoProps {
  title: string
  description: string
  keywords?: string
  url: string
  image?: string
}

export default function Seo({ title, description, keywords, url, image }: SeoProps) {
  return (
    <>
    <NextSeo
      title={title}
      description={description}
      canonical={`https://education.sarkariresult.rest/jobs/${url}`}
      additionalMetaTags={
        keywords
          ? [
              {
                name: "keywords",
                content: keywords,
              },
            ]
          : []
      }
      openGraph={{
        url,
        title,
        description,
        site_name: "Sarkari Job Portal",
        type: "article",
        images: [
          {
            url: image || "https://example.com/default-image.png",
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }}
      twitter={{
        handle: "@sarkarijobportal",
        site: "@sarkarijobportal",
        cardType: "summary_large_image",
      }}
    />
    </>
  )
}
