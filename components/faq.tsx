// components/JobFAQFooter.tsx
import Link from "next/link";
import sanitize from "sanitize-html";

type FAQItem = {
  question: string;
  answer: string;
};

type JobFAQFooterProps = {
  faqs: FAQItem[];
  showFooterLink?: boolean;
};

export default function JobFAQFooter({
  faqs,
  showFooterLink = true,
}: JobFAQFooterProps) {
  if (!faqs || faqs.length === 0) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="mt-12 border-t border-gray-300 pt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Frequently Asked Questions (FAQs)
      </h2>

      <p className="text-gray-700 text-lg text-center mb-8 max-w-3xl mx-auto">
        Below are the most common questions asked by aspirants about government
        jobs, online forms, admit cards, and results.
      </p>

      <div className="space-y-4 max-w-4xl mx-auto">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="border border-gray-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <details className="group">
              <summary className="cursor-pointer p-4 font-semibold text-lg bg-gray-100 hover:bg-gray-200 flex justify-between items-center">
                <span dangerouslySetInnerHTML={{ __html: faq.question}}></span>
                <span className="text-xl text-gray-600 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <div className="p-4 text-gray-700 leading-relaxed bg-white" dangerouslySetInnerHTML={{ __html: faq.answer}}>
                {/* {faq.answer} */}
              </div>
            </details>
          </div>
        ))}
      </div>

      {showFooterLink && (
        <div className="text-center mt-10 text-gray-600">
          Want to learn more? Visit our{" "}
          <Link href="/faq" className="text-blue-600 hover:underline">
            full FAQ guide
          </Link>{" "}
          for detailed answers.
        </div>
      )}

      {/* ✅ FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </section>
  );
}
