import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

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
    {
      question: "What should I do if I find incorrect information?",
      answer:
        "If you find any incorrect or outdated information, you can contact us through our Contact page. We’ll review and update the content immediately after verification.",
    },
    {
      question: "Do you provide direct links to apply online?",
      answer:
        "Yes, every job post on Sarkari Result includes a direct link to the official apply page, making the process quick and easy.",
    },
    {
      question: "How can I check my exam results?",
      answer:
        "Go to the ‘Results’ section on our website and click on the exam name. You’ll be redirected to the official site or a verified PDF download link.",
    },
    {
      question: "Do you charge any fee for job updates?",
      answer:
        "No. Sarkari Result is completely free to use. We never charge users for accessing job notifications, results, or admit card links.",
    },
    {
      question: "How often is Sarkari Result updated?",
      answer:
        "Our team updates the website multiple times a day to ensure every new government notification, result, or admit card is published as soon as possible.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Head>
        <title>FAQs - Sarkari Result | Common Questions About Govt Jobs</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about Sarkari Result, including job applications, admit cards, results, and notifications. Get all details in one place."
        />
        <meta
          name="keywords"
          content="Sarkari Result FAQs, government job questions, Sarkari exam guide, admit card help, result updates"
        />
        <link rel="canonical" href="https://sarkariresult.rest/faqs" />
      </Head>

      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Frequently Asked Questions (FAQs)
        </h1>
        <p className="text-gray-700 text-lg text-center mb-6">
          Welcome to our FAQ section. Here you’ll find answers to the most common questions about{" "}
          <strong>Sarkari Result</strong> — from applying for government jobs to checking results and admit cards.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full text-left font-semibold text-lg flex justify-between items-center"
              >
                {faq.question}
                <span>{openIndex === idx ? "−" : "+"}</span>
              </button>
              {openIndex === idx && (
                <p className="mt-2 text-gray-700">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8 text-gray-600">
          <p>
            Still have questions? Visit our{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact Page
            </Link>{" "}
            or read more about us on the{" "}
            <Link href="/about" className="text-blue-600 hover:underline">
              About Page
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
