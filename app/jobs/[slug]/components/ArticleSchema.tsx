import Script from "next/script";

interface ArticleSchemaProps {
  article: {
    slug: string;
    title: string;
    description: string;
    datePublished: string;
    dateModified: string;
    seo?: {
      meta_keywords?: string;
    };
  };
}

export default function ArticleSchema({
  article,
}: ArticleSchemaProps) {
  const image = `https://sarkariresult.rest/og/jobs/${article.slug}.webp`;

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",

      headline: article.title,
      description: article.description,

      image: [image],
      thumbnailUrl: image,

      datePublished: article.datePublished,
      dateModified: article.dateModified,

      inLanguage: "en-IN",

      isAccessibleForFree: true,

      keywords:
        article.seo?.meta_keywords ??
        "Sarkari Result, Government Jobs",

      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://sarkariresult.rest/article/${article.slug}`,
      },

      author: {
        "@type": "Person",
        name: "Abhay Sachan",
        url: "https://sarkariresult.rest",
      },

      publisher: {
        "@type": "Organization",
        name: "Sarkari Result",
        url: "https://sarkariresult.rest",

        logo: {
          "@type": "ImageObject",
          url: "https://sarkariresult.rest/logo.png",
        },
      },
    },

    {
      "@context": "https://schema.org",

      "@type": "BreadcrumbList",

      itemListElement: [
        {
          "@type": "ListItem",

          position: 1,

          name: "Home",

          item: "https://sarkariresult.rest/",
        },

        {
          "@type": "ListItem",

          position: 2,

          name: "Articles",

          item: "https://sarkariresult.rest/article",
        },

        {
          "@type": "ListItem",

          position: 3,

          name: article.title,

          item: `https://sarkariresult.rest/article/${article.slug}`,
        },
      ],
    },
  ];

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}