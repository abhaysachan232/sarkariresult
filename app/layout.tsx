import type React from "react";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/nav";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const GA_MEASUREMENT_ID = "G-BV07YKNY9Z";

/* =========================
   SEO + CONTENT BOOST BLOCK
   ========================= */
function HomeSeoSection() {
  return (
    <section className="mt-10 bg-white rounded border p-5 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">
          Sarkari Result {new Date().getFullYear()} – Latest Government Jobs
        </h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>education.sarkariresult.rest</strong> India ka fast aur trusted portal
          hai jahan aapko milte hain latest{" "}
          <strong>Sarkari Result</strong>,{" "}
          <strong>Government Jobs</strong>,{" "}
          <strong>Admit Card</strong>,{" "}
          <strong>Answer Key</strong> aur exam notifications.
          <br />
          <br />
          Agar aap <strong>SSC</strong>, <strong>Railway</strong>,{" "}
          <strong>UP Police</strong>, <strong>Bank</strong> ya kisi bhi
          government vacancy ki search me ho, to yeh platform aapke liye
          perfect hai.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">
          Why education.sarkariresult.rest?
        </h3>
        <ul className="list-disc ml-5 text-gray-700 space-y-1">
          <li>Fastest government job updates</li>
          <li>Verified official notifications</li>
          <li>Free admit card & result access</li>
          <li>High-speed lightweight website</li>
          <li>Best alternative of SarkariResult.com</li>
        </ul>
      </div>

      {/* FAQ */}
      <div>
        <h3 className="text-lg font-bold mb-3">
          FAQs – Sarkari Result Rest
        </h3>

        <div className="space-y-4 text-gray-700">
          <div>
            <p className="font-semibold">
              Q. Kya education.sarkariresult.rest official site hai?
            </p>
            <p>
              Yeh ek independent platform hai jo verified government updates
              fast provide karta hai.
            </p>
          </div>

          <div>
            <p className="font-semibold">
              Q. Yahan kaun-kaun se results milte hain?
            </p>
            <p>
              SSC, Railway, Bank, Police, Army, Admission aur sabhi major
              government exams ke results.
            </p>
          </div>

          <div>
            <p className="font-semibold">
              Q. Kya yeh SarkariResult.com se better hai?
            </p>
            <p>
              Speed, mobile experience aur clean layout ki wajah se users
              isse zyada prefer kar rahe hain.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================
   ROOT LAYOUT
   ========================= */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Adsense */}
        <meta
          name="google-adsense-account"
          content="ca-pub-4860335301065142"
        />
      </head>

      <body className={`${inter.className} bg-gray-100`}>
        {/* Google Analytics */}
        {/* <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        /> */}
        {/* <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script> */}

        {/* Adsense Loader */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4860335301065142"
          crossOrigin="anonymous"
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />

          {/* MAIN CONTENT */}
          <main className="max-w-6xl mx-auto px-3 py-4">
            {children}
            <HomeSeoSection />
          </main>

          <Footer />
        </ThemeProvider>

        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "education.sarkariresult.rest",
              url: "https://education.sarkariresult.rest",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://education.sarkariresult.rest/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
