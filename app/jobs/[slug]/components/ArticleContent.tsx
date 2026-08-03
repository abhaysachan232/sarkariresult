import ArticleTable from "./ArticleTable";

interface TableData {
  headers: string[];
  rows: string[][];
}

interface Section {
  heading: string;
  body: string;
  table?: TableData;
}

interface ArticleContentProps {
  sections: Section[];
}

export default function ArticleContent({
  sections,
}: ArticleContentProps) {
  return (
    <article className="mt-10 space-y-8">
      {sections.map((section, index) => (
        <section
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            {section.heading}
          </h2>

          <div className="space-y-4">
            {section.body
              .split("\n")
              .filter(Boolean)
              .map((paragraph, idx) => (
                <p
                  key={idx}
                  className="leading-8 text-gray-700"
                >
                  {paragraph}
                </p>
              ))}
          </div>

          {section.table && (
            <div className="mt-6">
              <ArticleTable
                headers={section.table.headers}
                rows={section.table.rows}
              />
            </div>
          )}
        </section>
      ))}
    </article>
  );
}