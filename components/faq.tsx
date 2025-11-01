// components/JobFAQFooter.tsx
import Link from "next/link";

export default function JobFAQFooter() {
  const faqs = [
    {
      question: "How can I apply for government jobs online?",
      answer:
        "You can apply for government jobs online by visiting the official recruitment portal mentioned in each job notification. Most applications are accepted through official websites like ssc.gov.in, upsc.gov.in, or state-level PSC portals. Always read the detailed advertisement before filling out the form to avoid mistakes.",
    },
    {
      question: "What are the eligibility criteria for Sarkari jobs?",
      answer:
        "Eligibility criteria vary depending on the post. Generally, candidates must have completed 10th, 12th, Diploma, Graduation, or Post-Graduation from a recognized institution. Age limits, relaxation, and physical standards differ for each department and category.",
    },
    {
      question: "Where can I find the latest Sarkari Result updates?",
      answer:
        "The latest results, admit cards, and answer keys are published in the results section of our website. Sarkari Result provides verified links directly from official websites so that candidates can quickly access their exam results and scorecards.",
    },
    {
      question: "Can I apply for multiple government jobs at once?",
      answer:
        "Yes, you can apply for multiple jobs simultaneously if you meet the eligibility criteria. Many aspirants fill out forms for various departments such as police, education, and banking to maximize their opportunities.",
    },
    {
      question: "How will I know if a government job notification is genuine?",
      answer:
        "Always verify job notifications through official websites or trusted portals like Sarkari Result. Avoid fake recruitment advertisements shared on social media without proper verification.",
    },
    {
      question: "Do I need to register on Sarkari Result to get updates?",
      answer:
        "No registration is required to access job listings, results, or admit cards. However, you can subscribe to our notifications or follow our Telegram channel to receive instant alerts about new vacancies and results.",
    },
    {
      question: "How can I download my admit card?",
      answer:
        "Visit the official recruitment website and go to the Admit Card section. Enter your registration number, date of birth, or password to download the admit card. Sarkari Result also provides a direct link to download all active admit cards.",
    },
    {
      question: "When are government job results released?",
      answer:
        "Results are usually released 1–3 months after the examination, depending on the recruitment board. Sarkari Result regularly tracks and updates all results, cutoff marks, and merit lists as soon as they are available.",
    },
    {
      question: "What documents are needed for online application?",
      answer:
        "You need a valid photo ID proof, educational certificates, category certificates (if applicable), and a recent passport-size photograph. Keep all documents scanned and ready in the prescribed format before applying.",
    },
    {
      question: "What should I do after submitting the form?",
      answer:
        "After submitting the form, keep a printout of the confirmation page and payment receipt. Regularly visit the official site for updates about admit cards, exam dates, and further selection stages.",
    },
    {
      question: "How can I prepare effectively for Sarkari exams?",
      answer:
        "Start your preparation early by studying the syllabus and exam pattern. Focus on General Knowledge, Reasoning, Quantitative Aptitude, and English. Regular practice of mock tests and previous year papers will improve your speed and accuracy.",
    },
    {
      question: "Are there government jobs without exams?",
      answer:
        "Yes, some departments release merit-based or direct recruitment jobs, especially for contractual and apprentice roles. These are filled based on academic marks or interviews rather than written exams.",
    },
    {
      question: "How can I get notifications for state-wise jobs?",
      answer:
        "You can explore the State Jobs section on Sarkari Result. Each state page lists ongoing recruitment for Police, PSC, Teacher, and other departments with state-specific eligibility and application links.",
    },
    {
      question: "Is Sarkari Result safe and trustworthy?",
      answer:
        "Yes, Sarkari Result is a secure and reliable platform that provides authentic job updates from verified government sources only. We never ask for personal information or payment for accessing job listings.",
    },
  ];

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
        jobs, online forms, admit cards, and results. This section helps improve
        your understanding of the recruitment process and ensures you never miss
        any important update.
      </p>

      <div className="space-y-4 max-w-4xl mx-auto">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="border border-gray-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <details className="group">
              <summary className="cursor-pointer p-4 font-semibold text-lg bg-gray-100 hover:bg-gray-200 flex justify-between items-center">
                <span>{faq.question}</span>
                <span className="text-xl text-gray-600 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <div className="p-4 text-gray-700 leading-relaxed bg-white">
                {faq.answer}
              </div>
            </details>
          </div>
        ))}
      </div>

      <div className="text-center mt-10 text-gray-600">
        Want to learn more? Visit our{" "}
        <Link href="/faq" className="text-blue-600 hover:underline">
          full FAQ guide
        </Link>{" "}
        for detailed answers to all Sarkari Result related queries.
      </div>

      {/* ✅ Add FAQ Schema JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </section>
  );
}
