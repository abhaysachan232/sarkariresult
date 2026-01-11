import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/nav";
import Footer from "@/components/Footer";
import Script from "next/script";
import "./globals.css";
const inter = Inter({ subsets: ["latin"], display: "swap", preload: true });

const GA_MEASUREMENT_ID = "G-BV07YKNY9Z";

// ✅ SEO Intro + FAQ Section Component
function HomeSeoSection() {
  return (
    <div className="min-h-[220px] flex flex-col justify-center">
      <section
        style={{
          minHeight: "240px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2
          className="text-xl font-bold mb-3 leading-tight"
          style={{ contentVisibility: "auto" }}
        >
          Sarkari Result {new Date().getFullYear()} provides latest government
          job updates...
        </h2>
        <p className="text-gray-700 leading-relaxed">
          www SarkariResult rest ek reliable platform hai jahan par aapko milte
          hain latest <strong>Sarkari Result</strong>,{" "}
          <strong>Admit Card</strong>, <strong>Answer Key</strong> aur
          Government Job updates. Chahe aap <strong>SSC CGL Answer Key</strong>,{" "}
          <strong>OFSS Bihar</strong> admission, ya kisi bhi government vacancy
          ke results dekh rahe ho — <strong>sarkariresult.rest</strong> par
          aapko sab kuch ek hi jagah par milta hai. Sarkari Com jaise trusted
          portals ke comparison me, ye site fast, updated aur verified
          notifications provide karti hai.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">
          Why Choose SarkariResult.Rest?
        </h2>
        <ul className="list-disc text-left inline-block text-gray-700">
          <li>Fastest government job updates in India</li>
          <li>Regularly verified official notifications</li>
          <li>Free access to admit cards, results, and syllabus</li>
          <li>Trusted alternative of www sarkariresult com & sarkari com</li>
        </ul>
      </section>

      {/* ✅ FAQ Section */}
      <section className="text-left mt-10">
        <h2 className="text-xl font-bold mb-4">FAQs - Sarkari Result Rest</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">
              Q1. Kya www SarkariResult com aur sarkariresult.rest ek hi site
              hai?
            </h3>
            <p>
              Nahi, dono alag platforms hain.{" "}
              <strong>SarkariResult.rest</strong> ek updated aur fast portal hai
              jahan aapko latest jobs aur results milte hain, jabki www
              SarkariResult com ek purana portal hai.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">
              Q2. SarkariResult.rest par kaun kaun si information milti hai?
            </h3>
            <p>
              Yahan aapko Government Jobs, Admit Cards, Sarkari Exams, Answer
              Keys, aur Result updates milte hain – bilkul free me.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">
              Q3. Kya SarkariResult.rest par SSC aur OFSS Bihar updates milte
              hain?
            </h3>
            <p>
              Haan, aapko yahan <strong>SSC CGL Answer Key</strong> se lekar{" "}
              <strong>OFSS Bihar Admission</strong> tak sabhi government
              notifications time par milte hain.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ FAQ JSON-LD Schema */}
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Kya www SarkariResult com aur sarkariresult.rest ek hi site hai?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "Nahi, dono alag platforms hain. SarkariResult.rest ek updated aur fast portal hai jahan aapko latest jobs aur results milte hain.",
                },
              },
              {
                "@type": "Question",
                "name": "SarkariResult.rest par kaun kaun si information milti hai?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "SarkariResult.rest par aapko Government Jobs, Admit Cards, Sarkari Exams, Answer Keys aur Result updates milte hain.",
                },
              },
              {
                "@type": "Question",
                "name": "Kya SarkariResult.rest par SSC aur OFSS Bihar updates milte hain?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "Haan, yahan SSC CGL Answer Key se lekar OFSS Bihar Admission tak sabhi notifications milte hain.",
                },
              },
            ],
          }),
        }}
      /> */}
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4860335301065142"
          crossOrigin="anonymous"
        ></script>

        <meta name="google-adsense-account" content="ca-pub-4860335301065142" />
      </head>
      <body className={inter.className}>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
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
          {/* <SwgLoginButton /> */}

          <main style={{ flex: 1, padding: "20px" }}>
            {children}
            <HomeSeoSection />
          </main>

          <Footer />
          {/* <AdcashAutoTag /> */}
        </ThemeProvider>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4860335301065142"
        ></script>
        <script
          async
          type="application/javascript"
          src="https://news.google.com/swg/js/v1/swg-basic.js"
        ></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "SarkariResult.Rest",
              url: "https://sarkariresult.rest",
              potentialAction: {
                "@type": "SearchAction",
                target: `https://sarkariresult.rest/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
