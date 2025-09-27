import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
      <p className="mb-6">Sorry, the page you are looking for does not exist.</p>
      <Link href="/">
        <a className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-500">Go Back Home</a>
      </Link>
    </div>
  );
}
