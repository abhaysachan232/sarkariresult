export default function FAQs() {
  const faqs = [
    { question: "How do I apply for a government job?", answer: "Visit the official notification, check eligibility, and apply online via the official site." },
    { question: "Where can I download admit cards?", answer: "Admit cards are available on the official websites. We link them directly on our job pages." },
    { question: "How will I know about new job notifications?", answer: "Subscribe to our notifications and check our homepage regularly for the latest jobs." },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions (FAQs)</h1>

      {faqs.map((faq, idx) => (
        <div key={idx} className="border p-4 rounded shadow space-y-2">
          <h2 className="font-semibold">{faq.question}</h2>
          <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}
