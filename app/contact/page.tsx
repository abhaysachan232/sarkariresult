// app/contact/page.tsx
import React from "react";

// ✅ Step 1: SEO Metadata (App Router style)
export const metadata = {
  title: "Contact Sarkari Result | Get in Touch with India’s Leading Sarkari Naukri Portal",
  description:
    "Contact Sarkari Result for any questions, feedback, or corrections. Reach out via email or phone for updates on Sarkari Naukri, Results, Admit Cards, and Government Exams across India.",
  keywords:
    "contact sarkari result, sarkari result contact page, sarkari naukri helpline, government job support, sarkari result helpdesk, sarkari result query, sarkari job updates, contact for govt jobs",
  alternates: {
    canonical: "https://sarkariresult.rest/contact",
  },
  openGraph: {
    title: "Contact Sarkari Result | Government Job Support & Feedback",
    description:
      "Reach out to the Sarkari Result team for help with government job notifications, exam results, admit cards, or feedback. We're here to assist you with the latest Sarkari Naukri updates.",
    url: "https://sarkariresult.rest/contact",
    siteName: "Sarkari Result",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Sarkari Result | Get in Touch",
    description:
      "Have a question about Sarkari Naukri or exam updates? Contact Sarkari Result via email or phone for support and feedback.",
  },
};

// ✅ Step 2: Page Component
export default function Contact() {
  return (
    <div className="container mx-auto px-6 py-10 leading-relaxed space-y-8 text-gray-800">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-6">
        Contact <span className="text-red-600">Sarkari Result</span>
      </h1>

      <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
        Welcome to the official contact page of <strong>Sarkari Result</strong> — India’s most reliable and trusted platform for all government job updates, results, and admit cards. 
        We truly value your trust and engagement with our website. Whether you are a student, job aspirant, or an organization seeking collaboration, 
        we’re here to assist you in every possible way.
      </p>

      {/* Contact Information Section */}
      <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-xl shadow-md space-y-3">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">
          📞 Contact Information
        </h2>
        <p>
          <strong>Mobile:</strong>{" "}
          <a href="tel:9580311217" className="text-blue-600 hover:underline">
            9580311217
          </a>
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:sachanabhay982@gmail.com"
            className="text-blue-600 hover:underline"
          >
            sachanabhay982@gmail.com
          </a>
        </p>
        <p>
          <strong>Office Hours:</strong> Monday to Saturday — 10:00 AM to 6:00 PM
        </p>
        <p>
          <strong>Response Time:</strong> We usually respond within 24–48 working hours.
        </p>
      </div>

      {/* Purpose Section */}
      <section className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-blue-900">
          💡 Purpose of This Contact Page
        </h2>
        <p>
          This page is created for users who wish to connect directly with the <strong>Sarkari Result</strong> team for queries, 
          feedback, suggestions, or partnership opportunities. Our aim is to maintain clear and transparent communication 
          with every visitor so that we can continue improving our services.
        </p>
        <p>
          Whether you want to report a broken link, suggest a correction, or ask about any job posting — feel free to drop us an email. 
          We regularly monitor user feedback to ensure the highest quality of information is available on our platform.
        </p>
      </section>

      {/* Support Section */}
      <section className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-blue-900">
          🧭 Get Support for Sarkari Naukri and Exams
        </h2>
        <p>
          If you are a student or government job aspirant, our support team can guide you with:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Latest updates on Sarkari Naukri, Results, and Admit Cards.</li>
          <li>Information about upcoming government exams and recruitment drives.</li>
          <li>Correction or clarification requests regarding posted job notifications.</li>
          <li>Guidance about applying online through official government portals.</li>
        </ul>
        <p>
          Please note that <strong>Sarkari Result does not conduct any recruitment</strong> or charge any money for providing job updates. 
          We only publish verified information from official sources to ensure transparency and trust.
        </p>
      </section>

      {/* Feedback Section */}
      <section className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-blue-900">
          💬 Feedback & Suggestions
        </h2>
        <p>
          Your feedback is the key to our improvement. If you have ideas that can enhance the user experience, 
          or if you’ve spotted any outdated or incorrect information, please inform us immediately. 
          Every feedback email is reviewed by our editorial team, and we take genuine suggestions seriously.
        </p>
        <p>
          We also appreciate students who share their exam experiences and success stories — 
          your journey inspires others preparing for the same exams.
        </p>
      </section>

      {/* Partnership Section */}
      <section className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-blue-900">
          🤝 Business & Partnership Inquiries
        </h2>
        <p>
          If you are an educational institution, coaching center, or government department interested in 
          promoting verified recruitment information through <strong>Sarkari Result</strong>, 
          feel free to contact us. We’re open to collaboration that benefits students and job seekers across India.
        </p>
        <p>
          For media or advertising inquiries, please include detailed information in your email, 
          such as organization name, website, and proposal details.
        </p>
      </section>

      {/* FAQs Section */}
      <section className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-blue-900">
          ❓ Frequently Asked Questions
        </h2>
        <p>
          <strong>Q1:</strong> Can I apply for jobs directly through Sarkari Result?<br />
          <strong>Ans:</strong> No. We only provide official links and verified information. 
          You must apply through the government’s official recruitment portal.
        </p>
        <p>
          <strong>Q2:</strong> How do I report an error or broken link?<br />
          <strong>Ans:</strong> Send us an email with the page link and issue details. Our team will fix it quickly.
        </p>
        <p>
          <strong>Q3:</strong> How can I get daily updates?<br />
          <strong>Ans:</strong> You can visit our website regularly or bookmark it for instant government job updates.
        </p>
      </section>

      {/* Contact Note */}
      <div className="max-w-3xl mx-auto mt-10 bg-blue-50 p-6 rounded-lg shadow-sm text-gray-700">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">
          📢 Important Note
        </h2>
        <p>
          Sarkari Result never asks for money, login credentials, or personal details for any recruitment or result update. 
          Always ensure you apply only through official government websites. Our platform is designed purely to inform, educate, 
          and empower aspirants seeking government jobs across India.
        </p>
      </div>

      <p className="text-center text-gray-600 mt-10">
        Thank you for choosing <strong>Sarkari Result</strong> — your trusted gateway to government opportunities in India.
      </p>
    </div>
  );
}
