import Link from "next/link";

interface ArticleFooterProps {
  slug: string;
}

export default function ArticleFooter({
  slug,
}: ArticleFooterProps) {
  const articleUrl = `https://sarkariresult.rest/article/${slug}`;

  return (
    <footer className="mt-12 rounded-2xl border border-gray-200 bg-slate-50 p-6">

      <div className="space-y-4">

        <h2 className="text-xl font-bold text-slate-900">
          Stay Updated
        </h2>

        <p className="text-gray-700 leading-7">
          Bookmark this page and keep checking regularly for
          the latest official updates, notifications,
          important dates, admit cards, answer keys,
          results and other announcements.
        </p>

        <div className="flex flex-wrap gap-3">

          <Link
            href="/latest-jobs"
            className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 transition"
          >
            Latest Jobs
          </Link>

          <Link
            href="/results"
            className="rounded-lg border border-blue-600 px-5 py-3 text-blue-700 hover:bg-blue-50 transition"
          >
            Results
          </Link>

          <Link
            href="/admit-card"
            className="rounded-lg border border-blue-600 px-5 py-3 text-blue-700 hover:bg-blue-50 transition"
          >
            Admit Card
          </Link>

        </div>

        <div className="border-t pt-4 text-sm text-gray-500">

          <p>
            Source:
            <span className="font-medium text-slate-700">
              {" "}Official Notification
            </span>
          </p>

          <p className="mt-2 break-all">
            URL:
            <span className="ml-2 text-blue-700">
              {articleUrl}
            </span>
          </p>

        </div>

      </div>

    </footer>
  );
}