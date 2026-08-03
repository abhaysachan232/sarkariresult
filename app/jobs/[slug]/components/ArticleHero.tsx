import Image from "next/image";

interface ArticleHeroProps {
  article: {
    slug: string;
    title: string;
    description: string;
    apply?: string;
  };
}

export default function ArticleHero({
  article,
}: ArticleHeroProps) {
  return (
    <header className="mb-10">

      {/* Hero Image */}
      <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-200">
        <Image
          src={`/og/jobs/${article.slug}.webp`}
          alt={article.title}
          width={1200}
          height={630}
          priority
          fetchPriority="high"
          sizes="100vw"
          className="w-full h-auto"
        />
      </div>

      {/* Title */}
      <h1 className="mt-8 text-3xl md:text-5xl font-bold leading-tight text-slate-900">
        {article.title}
      </h1>

      {/* Description */}
      <p className="mt-4 text-lg leading-8 text-gray-700">
        {article.description}
      </p>

      {/* Optional Apply Button */}
      {article.apply && (
        <div className="mt-8">
          <a
            href={article.apply}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold transition hover:bg-blue-700"
          >
            Apply Online
          </a>
        </div>
      )}
    </header>
  );
}