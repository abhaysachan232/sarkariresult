interface ArticleTableProps {
  headers: string[];
  rows: string[][];
}

export default function ArticleTable({
  headers,
  rows,
}: ArticleTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full border-collapse">
        <thead className="sticky top-0 bg-blue-600 text-white">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="border border-blue-500 px-4 py-3 text-left text-sm font-semibold md:text-base"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                rowIndex % 2 === 0
                  ? "bg-white"
                  : "bg-slate-50"
              }
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-gray-200 px-4 py-3 align-top text-sm leading-6 text-gray-700 md:text-base"
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: cell,
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}