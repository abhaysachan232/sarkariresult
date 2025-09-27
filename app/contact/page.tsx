export default function Contact() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p>
        We’d love to hear from you! If you have any questions, suggestions, or feedback, please reach out to us using the form below
        or via phone/email.
      </p>

      <div className="space-y-2">
        <p>
          📞 <strong>Mobile:</strong> 9580311217
        </p>
        <p>
          ✉️ <strong>Email:</strong> <a href="mailto:sachanabhay982@gmail.com" className="text-blue-600 hover:underline">
            sachanabhay982@gmail.com
          </a>
        </p>
      </div>

    </div>
  );
}
