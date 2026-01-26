'use client';
import React, { useState } from "react";
import Script from "next/script";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:support@education.sarkariresult.rest?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto px-6 py-10 leading-relaxed space-y-8 text-gray-800">
      {/* JSON-LD Schema */}
      <Script id="contact-page-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "mainEntity": {
            "@type": "Organization",
            "name": "Sarkari Result",
            "url": "https://education.sarkariresult.rest",
            "logo": "https://education.sarkariresult.rest/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "support@education.sarkariresult.rest",
              "telephone": "+91-9580311217",
              "contactType": "customer support",
              "areaServed": "IN",
              "availableLanguage": ["English", "Hindi"]
            }
          }
        })}
      </Script>

      {/* Page Heading */}
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-6">
        Contact <span className="text-red-600">Sarkari Result</span>
      </h1>

      <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
        Welcome to the official contact page of <strong>Sarkari Result</strong> — India’s most reliable and trusted platform for all government job updates, results, and admit cards. Whether you are a student, job aspirant, or organization seeking collaboration, we’re here to assist you.
      </p>

      {/* Contact Information */}
      <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-xl shadow-md space-y-3">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">📞 Contact Information</h2>
        <p><strong>Mobile:</strong> <a href="tel:9580311217" className="text-blue-600 hover:underline">9580311217</a></p>
        <p><strong>Email:</strong> <a href="mailto:support@education.sarkariresult.rest" className="text-blue-600 hover:underline">support@education.sarkariresult.rest</a></p>
        <p><strong>Office Hours:</strong> Monday to Saturday — 10:00 AM to 6:00 PM</p>
        <p><strong>Response Time:</strong> 24–48 working hours</p>
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">✉️ Send Us a Message</h2>
        {submitted && (
          <p className="text-green-600 mb-4">
            Your email client should open now. You can send your message to support@education.sarkariresult.rest.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              title="Your full name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
              title="Your email address"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block mb-1 font-medium">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Enter the subject"
              title="Subject of your message"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-1 font-medium">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Type your message here"
              title="Message content"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
          >
            Send Message
          </button>
        </form>
      </div>

      <p className="text-center text-gray-600 mt-10">
        Thank you for choosing <strong>Sarkari Result</strong> — your trusted gateway to government opportunities in India.
      </p>
    </div>
  );
}
