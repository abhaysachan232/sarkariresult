import Link from "next/link";

type JobImportantLinksProps = {
  links: Record<string, string>;
};

export default function JobImportantLinks({ links }: JobImportantLinksProps) {
  if (!links || Object.keys(links).length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Important Links
      </h2>

      <div className="max-w-3xl mx-auto border border-gray-300 rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <tbody>
            {Object.entries(links).map(([label, url], idx) => (
              <tr
                key={idx}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >
                <td className="p-4 font-medium text-gray-700 w-1/2">
                  {label}
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Click Here
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
