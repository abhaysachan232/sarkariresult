import Link from "next/link";

interface BreadcrumbProps {
  title: string;
}

export default function Breadcrumb({
  title,
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 text-sm"
    >
      <ol className="flex flex-wrap items-center gap-2 text-gray-600">

        <li>
          <Link
            href="/"
            className="hover:text-blue-600"
          >
            Home
          </Link>
        </li>

        <li>/</li>

        {/* <li>
          <Link
            href="/article"
            className="hover:text-blue-600"
          >
            jobs
          </Link>
        </li>

        <li>/</li> */}

        <li
          className="font-medium text-gray-900"
          aria-current="page"
        >
          {title}
        </li>

      </ol>
    </nav>
  );
}