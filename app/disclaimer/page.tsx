// app/disclaimer/page.tsx


// ✅ Step 1: SEO Metadata
export const metadata = {
  title: "Disclaimer Sarkari Result",
  description:
    "Read the official disclaimer of Sarkari Result. Learn how we source government job information, our accuracy policy, and your responsibility before relying on the content.",
  keywords:
    "sarkari result disclaimer, information disclaimer, sarkari naukri accuracy policy, government job site disclaimer, official notification disclaimer, sarkariresult rest",
  alternates: {
    canonical: "https://education.sarkariresult.rest/disclaimer",
  },
  openGraph: {
    title: "Sarkari Result Disclaimer | Authenticity & Responsibility Policy",
    description:
      "Sarkari Result provides verified government job updates from official sources. Read our disclaimer to understand data accuracy, liability limits, and fair usage terms.",
    url: "https://education.sarkariresult.rest/disclaimer",
    siteName: "Sarkari Result",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarkari Result Disclaimer | Data Authenticity & User Responsibility",
    description:
      "Understand the disclaimer of Sarkari Result. We provide verified Sarkari Naukri information from official sources only. Users should verify before acting.",
  },
};

// ✅ Step 2: Page Component
export default function Disclaimer() {
  return (
    <div className="container mx-auto px-6 py-10 space-y-8 leading-relaxed text-gray-800">
      <h1 className="text-4xl font-bold text-blue-900 mb-6 text-center">
        Disclaimer
      </h1>

      <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
        Welcome to <strong>Sarkari Result</strong> — India’s trusted destination for government job updates, exam results,
        and official notifications. Before using our website, please read this disclaimer carefully. By accessing our platform,
        you agree to the terms described below regarding the accuracy, reliability, and usage of information provided here.
      </p>

      {/* Section 1 */}
      <section className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-blue-800">
          1️⃣ General Information Disclaimer
        </h2>
        <p>
          The information published on <strong>Sarkari Result</strong> is meant solely for general informational purposes. 
          While every effort is made to ensure that the data and notifications are accurate and updated, we make no guarantees, 
          express or implied, regarding completeness, reliability, or suitability for any specific purpose.
        </p>
        <p>
          All information on this website is collected from official government sources, recruitment boards, and verified 
          notifications. However, users are strongly advised to cross-check all details from the official website of the concerned authority 
          before taking any action such as applying for a job or downloading an admit card.
        </p>
      </section>

      {/* Section 2 */}
      <section className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-blue-800">
          2️⃣ No Legal or Professional Advice
        </h2>
        <p>
          The information available on <strong>Sarkari Result</strong> should not be considered legal, financial, or professional advice. 
          We are an informational platform that aggregates data from various official notifications. Users are responsible for verifying 
          the authenticity and applicability of information before relying on it.
        </p>
        <p>
          For official instructions, eligibility criteria, and deadlines, always refer to the official recruitment advertisement 
          or department circular.
        </p>
      </section>

      {/* Section 3 */}
      <section className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-blue-800">
          3️⃣ Accuracy and Timeliness
        </h2>
        <p>
          Our editorial team strives to keep the information accurate and up-to-date. However, we do not guarantee that all information 
          will always reflect the most current details due to frequent updates from official sources. Sarkari Result is not liable for 
          any delay or omission in posting updates or corrections.
        </p>
        <p>
          In case of discrepancies between our data and the official notification, the latter shall always prevail.
        </p>
      </section>

      {/* Section 4 */}
      <section className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-blue-800">
          4️⃣ External Links Disclaimer
        </h2>
        <p>
          <strong>Sarkari Result</strong> may contain links to external websites for the convenience of users. While we make efforts to 
          include only credible and safe links, we have no control over the content, accuracy, or availability of those websites.
        </p>
        <p>
          Clicking on external links means you are leaving our platform, and we cannot be held responsible for any consequences 
          resulting from visiting such sites. Users are advised to review the privacy policies and disclaimers of those external platforms separately.
        </p>
      </section>

      {/* Section 5 */}
      <section className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-blue-800">
          5️⃣ Liability Limitation
        </h2>
        <p>
          Under no circumstances shall <strong>Sarkari Result</strong>, its team, partners, or affiliates be held responsible for 
          any direct, indirect, incidental, consequential, or special damages arising from the use of our website or its content.
        </p>
        <p>
          This includes, but is not limited to, loss of data, profits, opportunities, or other intangible losses resulting from reliance 
          on any information provided here.
        </p>
      </section>

      {/* Section 6 */}
      <section className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-blue-800">
          6️⃣ Official Sources and Verification
        </h2>
        <p>
          Our content is sourced from legitimate government websites such as UPSC, SSC, IBPS, State PSCs, and departmental 
          recruitment boards. We make it a priority to verify data before publishing it. However, official portals may change or 
          update information without prior notice, and we cannot be held accountable for such revisions.
        </p>
      </section>

      {/* Section 7 */}
      <section className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-blue-800">
          7️⃣ No Guarantee of Selection or Employment
        </h2>
        <p>
          Sarkari Result does not provide any guarantee of job selection or employment. Our role is limited to providing 
          information that helps aspirants stay informed about opportunities. The final decision for recruitment, result publication, 
          or candidate selection lies solely with the respective government organization.
        </p>
      </section>

      {/* Section 8 */}
      <section className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-blue-800">
          8️⃣ Copyright and Fair Usage
        </h2>
        <p>
          All content available on <strong>Sarkari Result</strong> — including text, formatting, and layout — is protected by copyright. 
          Republishing or copying our data without permission is strictly prohibited. Users may share our links or summaries for educational 
          and non-commercial use only.
        </p>
      </section>

      {/* Section 9 */}
      <section className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-blue-800">
          9️⃣ User Responsibility
        </h2>
        <p>
          By using this website, you acknowledge that you understand the risks associated with relying on information published online. 
          You agree that Sarkari Result shall not be liable for any outcome resulting from your decision based on data from our website.
        </p>
        <p>
          We encourage visitors to always double-check official notices and read complete recruitment documents before taking any step.
        </p>
      </section>

      {/* Section 10 */}
      <section className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-blue-800">
          🔟 Consent
        </h2>
        <p>
          By accessing and using our website, you hereby consent to our disclaimer and agree to its terms. 
          We may revise or update this disclaimer periodically without prior notice, so please review it regularly.
        </p>
      </section>

      {/* Final Note */}
      <div className="max-w-3xl mx-auto mt-10 bg-blue-50 p-6 rounded-lg shadow-sm text-gray-700">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">📢 Important Notice</h2>
        <p>
          Sarkari Result is an independent information provider and is not affiliated with any government body. 
          We serve to make public data more accessible and user-friendly. Official websites remain the ultimate authority for 
          all recruitment-related decisions.
        </p>
      </div>

      <p className="text-center text-gray-600 mt-10">
        Last Updated: October 2025
      </p>
    </div>
  );
}
