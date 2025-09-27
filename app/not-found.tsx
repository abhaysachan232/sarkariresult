// app/not-found.tsx

import Link from "next/link";
import Layout from "./layout"; // adjust path if needed

export default function NotFound() {
  return (

      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
        <p className="mb-6">Sorry, the page you are looking for does not exist.</p>
        <Link href="/">
          Go Back Home
        </Link>
      </div>

  );
}
