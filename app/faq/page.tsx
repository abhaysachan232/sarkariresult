// app/faq/page.tsx
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQs - Sarkari Result | Government Job Help, Admit Cards & Results",
  description:
    "Find detailed answers to frequently asked questions about Sarkari Result, including government job applications, admit cards, results, notifications, eligibility, and updates.",
  keywords:
    "Sarkari Result FAQs, Sarkari Naukri Questions, Sarkari Exam Help, Govt Job Guide, Admit Card Download, Result Checking, SarkariResult Info, Sarkari Update, Online Form Help",
  alternates: {
    canonical: "https://sarkariresult.rest/faqs",
  },
};

export default function FAQs() {
  const faqs = [
    {
      question: "What is Sarkari Result?",
      answer:
        "Sarkari Result is a trusted portal for all government job aspirants in India. It provides accurate and timely updates about Sarkari exams, online forms, admit cards, results, and recruitment notices from official government sources. This website is designed to simplify the process of staying updated with all job opportunities released by central and state governments.",
    },
    {
      question: "How can I apply for a Sarkari Naukri?",
      answer:
        "To apply for any Sarkari job, first read the official notification carefully. You can find the eligibility criteria, application dates, fees, and required documents. Then visit the official portal (like ssc.gov.in, upsc.gov.in, or state PSC websites) and fill out the online form. On Sarkari Result, we provide verified direct application links to save your time.",
    },
    {
      question: "How do I know which government jobs are currently open?",
      answer:
        "You can visit the homepage of Sarkari Result daily where we list all the latest and active recruitment forms. Jobs are categorized by organizations, qualifications, and states. You can also use the search feature to find jobs based on your interests, like teaching, banking, defense, or railway.",
    },
    {
      question: "Where can I download admit cards for government exams?",
      answer:
        "You can download admit cards from the official website of the respective recruitment board. However, Sarkari Result provides one-click access to the latest admit cards section so that you never miss your exam updates. We list admit cards for SSC, UPSC, State Police, Railway, Bank, and all other government exams.",
    },
    {
      question: "How will I get updates about new job notifications?",
      answer:
        "You can bookmark Sarkari Result or subscribe to notifications. We update every new government job alert instantly. Additionally, you can follow our Telegram channel or visit our ‘Latest Jobs’ page to stay informed.",
    },
    {
      question: "Is Sarkari Result an official government website?",
      answer:
        "No. Sarkari Result is an independent private portal that curates information from official government websites and recruitment boards. We do not conduct any recruitment or examination. All application forms are submitted on official portals only.",
    },
    {
      question: "Can I trust the information available on Sarkari Result?",
      answer:
        "Absolutely. We only post verified information from government sources like employment newspapers, official notifications, and press releases. Still, we always recommend candidates verify details on the official website before final submission.",
    },
    {
      question: "Does Sarkari Result charge any fees?",
      answer:
        "No, we never charge money for providing information. Our portal is completely free to access. However, you may have to pay the official application fee on the respective government website while filling out the form.",
    },
    {
      question: "How can I check my Sarkari Result or exam score?",
      answer:
        "You can visit the ‘Results’ section on our website. We categorize results by date and organization for easy access. Click on the desired exam result, and we provide you a direct link to the official website where you can check or download your result.",
    },
    {
      question: "How often is Sarkari Result updated?",
      answer:
        "Our content team updates the website 24×7. Every time a new notification, admit card, or result is released by any government body, we verify and publish it within minutes. You can rely on Sarkari Result as your one-stop destination for timely updates.",
    },
    {
      question: "Does Sarkari Result provide syllabus or previous year papers?",
      answer:
        "Yes. We regularly publish exam syllabi, pattern details, and previous year question papers for major exams like SSC, UPSC, Railway, Bank, and State-level PSC exams. These help candidates in effective preparation.",
    },
    {
      question: "How can I prepare for government exams?",
      answer:
        "First, understand the syllabus and exam pattern. Then make a study plan that includes daily reading of current affairs, previous papers, and mock tests. We also link to recommended preparation materials and official websites.",
    },
    {
      question: "Can I apply for multiple government jobs at the same time?",
      answer:
        "Yes, you can apply for as many government jobs as you are eligible for. However, you must check the exam schedule to ensure there are no date clashes between tests.",
    },
    {
      question: "Which government jobs are best after graduation?",
      answer:
        "After graduation, candidates can apply for UPSC Civil Services, SSC CGL, Banking (IBPS/ SBI PO), State PSC, Railway NTPC, and Defense exams. Sarkari Result lists all such graduate-level opportunities with direct links.",
    },
    {
      question: "Do I need to register on Sarkari Result?",
      answer:
        "No registration is required. All pages, forms, and updates are publicly available. However, if you subscribe to our notification service, you can receive instant updates through email or browser alerts.",
    },
    {
      question: "How can I report an error or broken link?",
      answer:
        "If you find any incorrect information or non-working link, you can contact our support team via the Contact Page. We actively monitor and fix any reported issues immediately to maintain accuracy.",
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
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Frequently Asked Questions (FAQs)
      </h1>
      <p className="text-gray-700 text-lg mb-10 text-center">
        Welcome to the official FAQ page of <strong>Sarkari Result</strong>.
        Below you’ll find detailed answers to common questions about Sarkari
        exams, recruitment, admit cards, results, and eligibility. Whether
        you’re applying for your first government job or preparing for your next
        big opportunity, this guide will help you understand everything about
        the process — from filling online forms to checking results.
      </p>

      <section className="space-y-4">
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
      </section>

      <div className="text-center mt-10 text-gray-600">
        Still have questions? Visit our{" "}
        <Link href="/contact" className="text-blue-600 hover:underline">
          Contact Page
        </Link>{" "}
        or learn more on our{" "}
        <Link href="/about" className="text-blue-600 hover:underline">
          About Page
        </Link>
        .
      </div>

      <div className="mt-12 text-sm text-gray-500 text-justify leading-relaxed">
        <p>
          Sarkari Result is one of India’s most trusted sources for authentic
          government job information. Our mission is to bridge the gap between
          candidates and official government opportunities. With regular updates
          across all categories — central, state, banking, teaching, defense,
          and PSU — we ensure that aspirants get real-time access to the latest
          opportunities without the hassle of navigating multiple official
          portals. Whether you’re a student preparing for SSC exams or a
          professional aiming for PSU recruitment, we are here to help.
        </p>
        <p className="mt-3">
          Every page on Sarkari Result follows SEO-friendly and accessibility
          guidelines, ensuring smooth browsing for users and better visibility
          on search engines. We continuously enhance our platform to make it
          faster, more responsive, and easier to use for everyone in India.
        </p>
      </div>

      {/* ✅ FAQ Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
