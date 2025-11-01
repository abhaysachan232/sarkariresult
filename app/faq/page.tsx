import Head from "next/head";
import Link from "next/link";

export default function FAQs() {
  const faqs = [
    {
      question: "How do I apply for a government job?",
      answer: `
        Applying for a government job in India requires a systematic approach. First, visit the official recruitment notification issued by the concerned department such as SSC, UPSC, State PSC, Police Department, or Railway Board. Carefully read the eligibility criteria, including age limit, educational qualification, and physical standards if applicable.
        
        Once confirmed, visit the official online application link. Fill out the form accurately — providing details like name, address, category, educational background, and experience. Upload your scanned photograph, signature, and certificates as mentioned in the notification. Then pay the application fee online through debit card, credit card, UPI, or net banking.

        Always download a copy of the completed application form and keep the acknowledgment number safe for future use. Websites like Sarkari Result or Sarkari Naukri Portal provide verified links to apply directly for official vacancies.
      `,
    },
    {
      question: "Where can I download admit cards?",
      answer: `
        Admit cards are released by the examination authority a few days before the exam date. Candidates can download them by visiting the official website of the organization conducting the exam — for example, SSC, RRB, UPSC, or State Service Commission.

        On the official site, look for the “Admit Card” or “Hall Ticket” section. Then, enter your registration number and date of birth to log in. After verification, you can download and print your admit card. Sarkari Result also provides a separate section for admit cards, offering direct and safe links verified from official sources.

        It’s important to check all details on your admit card — such as your name, photograph, exam center, and exam date — to ensure everything is correct. If you find any discrepancy, contact the respective authority immediately.
      `,
    },
    {
      question: "How will I know about new job notifications?",
      answer: `
        Keeping track of all new job notifications can be overwhelming since different government bodies release vacancies at different times. The most effective method is to follow trusted portals like Sarkari Result, SarkariExam, and Employment News. These platforms regularly update new job openings across central and state governments.

        You can also subscribe to email alerts or push notifications from Sarkari Result to get instant updates. For example, if you are preparing for SSC CGL, UPSC, or Railway exams, you can receive notifications whenever new application forms or results are released.

        Additionally, you can bookmark categories based on your interests — such as Police Jobs, Defence Jobs, Teaching Jobs, Banking Jobs, or State-specific recruitments like UPPSC, BPSC, or MPESB. This ensures you never miss an update relevant to your qualification.
      `,
    },
    {
      question: "Is Sarkari Result an official government website?",
      answer: `
        No, Sarkari Result is not an official government website. It is an independent private portal that provides updates and verified links to official government notifications, application forms, admit cards, and results. The main goal of Sarkari Result is to make it easier for students and job seekers to find accurate information without visiting multiple sites.

        We strictly source data only from official government websites like ssc.gov.in, upsc.gov.in, rrbcdg.gov.in, upsssc.gov.in, and other legitimate portals. However, we always recommend candidates verify details with the official site before applying to avoid any confusion or outdated information.
      `,
    },
    {
      question: "Can I trust the information on Sarkari Result?",
      answer: `
        Yes, the information on Sarkari Result is compiled carefully from official government notifications, press releases, and verified circulars. Our editorial team ensures that every update — from application dates to result announcements — matches the official notice published by the concerned authority.

        Each post on our website includes important details like eligibility, age limit, exam pattern, syllabus, application fees, and direct official links. We do not post speculative or unconfirmed news. Moreover, we mention the official website of the recruiting organization in every article so that candidates can cross-check directly.
      `,
    },
    {
      question: "What are the benefits of government jobs in India?",
      answer: `
        Government jobs offer long-term stability, job security, and numerous benefits that private jobs rarely match. Employees receive a fixed salary, timely promotions, dearness allowance, house rent allowance, and pension after retirement. Apart from financial security, government employees enjoy additional perks like medical facilities, travel allowances, and housing benefits.

        Moreover, working in a government department brings social respect and recognition. Many positions also allow employees to contribute directly to the development of the country — such as working in defense, education, or healthcare sectors. These factors make Sarkari Naukri one of the most sought-after career choices for youth.
      `,
    },
    {
      question: "Which are the most popular government exams in India?",
      answer: `
        India conducts a wide range of competitive exams every year for recruitment in various departments. Some of the most popular ones include:
        - SSC CGL, CHSL, and MTS exams for central government departments.
        - UPSC Civil Services Examination (IAS, IPS, IFS).
        - Railway Recruitment Board (RRB) NTPC, Group D, and JE exams.
        - State Public Service Commission exams such as UPPSC, BPSC, and MPPSC.
        - Defence exams like NDA, CDS, AFCAT, and CAPF.
        - Banking exams like IBPS PO, Clerk, and SBI exams.
        - Teaching exams like CTET, UPTET, and KVS recruitment.

        Each of these exams has its own eligibility criteria and selection process. Aspirants are advised to prepare strategically and follow previous year papers for better understanding.
      `,
    },
    {
      question: "How can I prepare for Sarkari exams effectively?",
      answer: `
        Preparation for government exams requires consistency and a well-structured study plan. Start by understanding the syllabus and exam pattern. Divide subjects into daily study goals — for instance, one day for quantitative aptitude, one for reasoning, and another for general awareness.

        Use standard study materials like NCERT books for basics and trusted guidebooks for advanced topics. Practice mock tests regularly to improve time management and accuracy. Many aspirants also join online coaching classes or follow YouTube channels for concept clarity.

        Revision plays a crucial role — create short notes and revise them frequently. Lastly, stay motivated and patient; most successful candidates clear exams after several attempts.
      `,
    },
    {
      question: "What is the difference between Central and State Government jobs?",
      answer: `
        Central Government jobs are offered by organizations that operate at the national level — such as the Indian Railways, Income Tax Department, Defence Services, and Central Secretariat. These jobs usually have transfers across India and follow pay scales defined by the 7th Central Pay Commission.

        State Government jobs, on the other hand, are limited to the respective state jurisdiction. They include roles in state police, revenue, education, and public works departments. The recruitment process is conducted by State PSCs or local recruitment boards.

        While both offer stability, the choice depends on personal preference — Central jobs provide nationwide exposure, while State jobs allow candidates to serve within their home region.
      `,
    },
    {
      question: "Why should I follow Sarkari Result daily?",
      answer: `
        Sarkari Result is a one-stop destination for all government job updates, admit cards, syllabus, results, and answer keys. By visiting it daily, you stay ahead of others who might miss critical deadlines.

        It’s especially useful for aspirants who are preparing for multiple exams simultaneously. With dedicated sections for Central, State, Defence, Railway, and Teaching jobs, you can easily find the exact vacancy relevant to your qualification. Each page includes all important details in one place — saving you hours of searching online.
      `,
    },
  ];

  return (
    <>
      <Head>
        <title>
          FAQs - Sarkari Result | Common Questions About Govt Jobs and Exams
        </title>
        <meta
          name="description"
          content="Find answers to the most frequently asked questions about Sarkari Result, government jobs, admit cards, exam preparation, results, eligibility, and official notifications."
        />
        <meta
          name="keywords"
          content="Sarkari Result FAQ, government job guide, how to apply online, Sarkari exam preparation, Sarkari Naukri information, admit card help, government vacancy 2025, result updates, SSC UPSC RRB PSC"
        />
        <link rel="canonical" href="https://sarkariresult.rest/faqs" />
      </Head>

      <main className="container mx-auto p-4 space-y-6">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Frequently Asked Questions (FAQs)
        </h1>
        <p className="text-gray-700 text-lg text-center mb-6 leading-relaxed">
          Welcome to the comprehensive FAQ section of{" "}
          <strong>Sarkari Result</strong>. Here you’ll find detailed answers to
          the most common queries asked by aspirants preparing for various{" "}
          <strong>government exams, recruitment processes, and results</strong>.
          Whether you’re a first-time applicant or an experienced candidate,
          this guide covers everything from application steps to preparation
          strategies and job benefits.
        </p>

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
                className="flex justify-between items-center cursor-pointer p-4 font-semibold text-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                {faq.question}
                <span className="text-xl text-gray-600 transition-transform duration-200 peer-checked:rotate-45">
                  +
                </span>
              </label>
              <div className="max-h-0 overflow-hidden transition-all duration-300 peer-checked:max-h-[2000px] p-0 peer-checked:p-4 bg-white text-gray-700 border-t border-gray-200 whitespace-pre-line leading-relaxed">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>

        <section className="text-gray-700 mt-10 leading-relaxed">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Final Words — Your Gateway to Sarkari Opportunities
          </h2>
          <p>
            The government job ecosystem in India is massive, and understanding
            how it functions is crucial for success. From UPSC and SSC to
            Railway, Defence, and State-level recruitments, every organization
            follows a unique structure. Sarkari Result simplifies this journey
            for you by organizing all official data, forms, and notifications in
            one reliable place.
          </p>
          <p className="mt-3">
            Bookmark our site, visit regularly, and follow the latest{" "}
            <strong>Govt Job Updates</strong>, <strong>Admit Cards</strong>,{" "}
            <strong>Results</strong>, and <strong>Answer Keys</strong> for all
            major exams. Whether you aim for IAS, Teacher, Constable, or Clerk —
            we help you stay informed and one step ahead.
          </p>
          <p className="mt-3">
            Visit our{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              Homepage
            </Link>{" "}
            for trending government vacancies, or explore{" "}
            <Link href="/results" className="text-blue-600 hover:underline">
              Latest Results
            </Link>{" "}
            and{" "}
            <Link href="/admit-card" className="text-blue-600 hover:underline">
              Admit Card Updates
            </Link>
            . We’re committed to providing accurate, official, and timely
            information to every aspirant in India.
          </p>
        </section>
      </main>
    </>
  );
}
