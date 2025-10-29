import Head from "next/head";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Sarkari Result</title>
        <meta
          name="description"
          content="Read Sarkari Result's Privacy Policy to understand how we collect, use, and protect your personal information. We value your trust and ensure complete data safety."
        />
        <meta
          name="keywords"
          content="Sarkari Result Privacy Policy, Data Protection, Personal Information, User Privacy, Cookies Policy, Online Security"
        />
        <link rel="canonical" href="https://sarkariresult.rest/privacy-policy" />
      </Head>

      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Privacy Policy
        </h1>

        <p className="text-gray-700">
          At <strong>Sarkari Result</strong>, we respect your privacy and are committed to protecting any personal information you share
          with us. This Privacy Policy outlines the type of data we collect, how it is used, and the steps we take to ensure your
          information remains secure. By accessing or using our website, you agree to the terms mentioned below.
        </p>

        <h2 className="text-2xl font-semibold mt-6">1. Information We Collect</h2>
        <p>
          We may collect the following types of information to improve our services and user experience:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Personal Information:</strong> Such as name or email address when you voluntarily subscribe to notifications or contact us.
          </li>
          <li>
            <strong>Non-Personal Information:</strong> Includes browser type, operating system, and usage statistics automatically collected through analytics tools.
          </li>
          <li>
            <strong>Cookies:</strong> Small files stored on your device that help us understand user behavior and enhance website performance.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">2. How We Use Your Information</h2>
        <p>
          The information we collect is used solely for improving our services and user experience. We may use it to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Send updates about new government job notifications, admit cards, and results.</li>
          <li>Improve website content and structure based on user behavior.</li>
          <li>Respond to your queries and feedback submitted via our contact form.</li>
          <li>Analyze trends and measure user engagement through analytics tools.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">3. Cookies Policy</h2>
        <p>
          Our website uses cookies to enhance your browsing experience. These cookies help us recognize repeat visitors, save user
          preferences, and display relevant content. You can choose to disable cookies through your browser settings, but doing so may
          affect some functionalities of the website.
        </p>

        <h2 className="text-2xl font-semibold mt-6">4. Third-Party Services</h2>
        <p>
          <strong>Sarkari Result</strong> may use third-party services like Google Analytics or advertising networks to improve website
          performance. These third parties may collect anonymous data about your interaction with our website using cookies and other
          technologies. However, we never share your personally identifiable information with any third-party service without your consent.
        </p>

        <h2 className="text-2xl font-semibold mt-6">5. Data Protection and Security</h2>
        <p>
          We implement strong security measures to protect user data against unauthorized access, alteration, or disclosure. Our servers
          are regularly updated and monitored to ensure the highest level of data protection. However, please note that no method of
          online transmission or storage is 100% secure.
        </p>

        <h2 className="text-2xl font-semibold mt-6">6. External Links</h2>
        <p>
          Our website may contain links to external government or third-party websites. We are not responsible for the content,
          accuracy, or privacy practices of these external sites. Users are encouraged to review the privacy policy of any linked website
          before sharing personal information.
        </p>

        <h2 className="text-2xl font-semibold mt-6">7. Advertisement Policy</h2>
        <p>
          We may display third-party advertisements (such as Google AdSense) on our website. These advertisers may use cookies or web
          beacons to collect non-personal information about your visits to show relevant ads. Sarkari Result does not control or store
          this information.
        </p>

        <h2 className="text-2xl font-semibold mt-6">8. Children’s Privacy</h2>
        <p>
          We do not knowingly collect personal information from individuals under the age of 13. If you believe your child has provided
          personal data to us, please contact us immediately, and we will take necessary steps to delete such information.
        </p>

        <h2 className="text-2xl font-semibold mt-6">9. Your Rights and Choices</h2>
        <p>
          You have full control over the personal data you share with us. You can:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Request access to the data we hold about you.</li>
          <li>Request correction or deletion of your personal data.</li>
          <li>Opt out of email updates or notifications at any time.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">10. Changes to This Policy</h2>
        <p>
          <strong>Sarkari Result</strong> reserves the right to update or modify this Privacy Policy at any time without prior notice.
          The latest version will always be available on this page. We encourage users to review this page periodically to stay informed
          about how we are protecting their information.
        </p>

        <h2 className="text-2xl font-semibold mt-6">11. Consent</h2>
        <p>
          By using our website, you consent to this Privacy Policy and agree to the collection and use of information as described herein.
        </p>

        <h2 className="text-2xl font-semibold mt-6">12. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy, feel free to contact us at:
        </p>
        <p>
          📧 <strong>Email:</strong>{" "}
          <a href="mailto:sachanabhay982@gmail.com" className="text-blue-600 hover:underline">
            sachanabhay982@gmail.com
          </a>
          <br />
          📞 <strong>Mobile:</strong> 9580311217
        </p>

        <p className="text-gray-600 mt-6">
          Last Updated: <strong>October 2025</strong>
        </p>
      </div>
    </>
  );
}
