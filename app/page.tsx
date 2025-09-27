

import Middle from "@/components/Middle"
import { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const baseUrl = 'https://sarkariresult.rest';
  const slug = params.slug || '';
  const fullUrl = `${baseUrl}/jobs/${slug}`;

  return {
    title: `SarkariResult - ${slug.toUpperCase()} Job Details`,
    description: `Find details about ${slug} jobs, admit cards, and results at SarkariResult.rest.`,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: `SarkariResult - ${slug.toUpperCase()} Job Details`,
      description: `Find details about ${slug} jobs, admit cards, and results at SarkariResult.rest.`,
      url: fullUrl,
      type: 'article',
    },
    twitter: {
      card: "summary_large_image",
      title: `SarkariResult - ${slug.toUpperCase()} Job Details`,
      description: `Find details about ${slug} jobs, admit cards, and results at SarkariResult.rest.`,
    },
  };
}

export default async function Home() {

  // console.log(data);

  return (
    <>

    <div className="min-h-screen bg-background">
      
      {/* Header */}

<Middle  />



    </div>
        </>
  )
}
