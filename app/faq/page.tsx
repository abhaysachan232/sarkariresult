import Head from "next/head";
import Link from "next/link";

export default function FAQs() {
  const faqs = [
    {
      question: "How do I apply for a government job?",
      answer:
        "To apply for any Sarkari job, first visit the official notification page and read the eligibility criteria carefully. Then follow the online application link provided on official portals like SSC, UPSC, or State PSC websites. You can find all official application links on our job listing pages at Sarkari Result.",
    },
    {
      question: "Where can I download admit cards?",
      answer:
        "You can download admit cards directly from the respective official websites. We also provide direct and verified links to download admit cards from our Admit Card section on the homepage.",
    },
    {
      question: "How will I know about new job notifications?",
      answer:
        "Stay updated by visiting our homepage regularly or by subscribing to our notification alerts. We post the latest job vacancies, admit cards, and results as soon as they are released.",
    },
    {
      question: "Is Sarkari Result an official government website?",
      answer:
        "No, Sarkari Result is not an official government website. We are an independent portal that provides updates and links to official notifications, admit cards, and results.",
    },
    {
      question: "Can I trust the information on Sarkari Result?",
      answer:
        "Yes. We gather data from verified and official government sources only. However, candidates should always cross-check information with the official website before applying.",
    },
  ];

  return (
    <>
      <Head>
        <title>FAQs - Sarkari Result | Common Questions About Govt Jobs</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about Sarkari Result, including job applications, admit cards, results, and notifications."
        />
        <meta
          name="keywords"
          content="Sarkari Result FAQs, government job questions, Sarkari exam guide, admit card help, result updates"
        />
        <link rel="canonical" href="https://sarkariresult.rest/faqs" />
      </Head>

      <main className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Frequently Asked Questions (FAQs)
        </h1>
        <p className="text-gray-700 text-lg text-center mb-6">
          Welcome to our FAQ section. Here you’ll find answers to the most
          common questions about{" "}
          <strong>Sarkari Result</strong> — from applying for government jobs to
          checking results and admit cards.
        </p>

        {/* ✅ FAQ Accordion using CSS only */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-300 rounded-lg shadow">
              <input
                type="checkbox"
                id={`faq-${idx}`}
                className="peer hidden"
              />
              <label
                htmlFor={`faq-${idx}`}
                className="block cursor-pointer p-4 font-semibold text-lg bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
              >
                {faq.question}
                <span className="text-xl text-gray-600 peer-checked:rotate-45 transition-transform">
                  +
                </span>
              </label>
              <div className="hidden peer-checked:block p-4 bg-white text-gray-700 border-t border-gray-200">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 text-gray-600">
          Still have questions? Visit our{" "}
          <Link href="/contact" className="text-blue-600 hover:underline">
            Contact Page
          </Link>{" "}
          or read more about us on the{" "}
          <Link href="/about" className="text-blue-600 hover:underline">
            About Page
          </Link>
          .
        </div>
      </main>

      <style jsx>{`
        /* Small plus-to-minus animation */
        label span {
          display: inline-block;
          transform-origin: center;
          transition: transform 0.2s ease;
        }
        input:checked + label span {
          transform: rotate(45deg);
        }
      `}</style>
    </>
  );
}
