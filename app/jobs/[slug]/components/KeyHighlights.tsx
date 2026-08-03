interface Section {
  heading: string;
  body: string;
}

interface KeyHighlightsProps {
  sections: Section[];
}

export default function KeyHighlights({
  sections,
}: KeyHighlightsProps) {
  if (!sections?.length) return null;

  return (
    <section
      className="mt-10 rounded-2xl border border-blue-200 bg-blue-50 p-6"
      aria-labelledby="key-highlights"
    >
      <h2
        id="key-highlights"
        className="mb-6 text-2xl font-bold text-blue-900"
      >
        Key Highlights
      </h2>

      <div className="space-y-5">
        {sections.map((section, index) => (
          <article
            key={index}
            className="rounded-xl bg-white p-5 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {section.heading}
            </h3>

            <p className="mt-2 whitespace-pre-line leading-7 text-gray-700">
              {section.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}