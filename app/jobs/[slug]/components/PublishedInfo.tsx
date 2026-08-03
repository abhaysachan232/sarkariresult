interface PublishedInfoProps {
  published: string;
  modified: string;
  author?: string;
}

export default function PublishedInfo({
  published,
  modified,
  author = "Abhay Sachan",
}: PublishedInfoProps) {
  const publishedDate = new Date(published).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const modifiedDate = new Date(modified).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <footer className="mt-12 border-t border-gray-200 pt-6">
      <div className="grid gap-4 rounded-2xl bg-slate-50 p-6 md:grid-cols-3">

        <div>
          <p className="text-sm text-gray-500">
            Published
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {publishedDate}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Last Updated
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {modifiedDate}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Author
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {author}
          </p>
        </div>

      </div>
    </footer>
  );
}