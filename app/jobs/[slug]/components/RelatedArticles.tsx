import Link from "next/link";

interface RelatedArticle {
  slug: string;
  title: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

export default function RelatedArticles({
  articles,
}: RelatedArticlesProps) {
  if (!articles.length) return null;

  return (
    <aside
      className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      aria-labelledby="related-articles"
    >
      <h2
        id="related-articles"
        className="mb-5 text-2xl font-bold text-slate-900"
      >
        Related Articles
      </h2>

      <ul className="space-y-3">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/article/${article.slug}`}
              className="group flex items-start gap-3 rounded-lg p-2 transition hover:bg-blue-50"
            >
              <span className="mt-2 h-2 w-2 rounded-full bg-blue-600 shrink-0" />

              <span className="text-blue-700 group-hover:text-blue-900 group-hover:underline">
                {article.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}