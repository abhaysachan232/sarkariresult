import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/nav"
import Footer from "@/components/Footer"
import SwgLoginButton from "@/components/SwgLoginButton"

const inter = Inter({ subsets: ["latin"] })

// ✅ Global SEO metadata (applies site-wide)
export const metadata = {
  title: {
    default: "SarkariResult - Government Jobs, Results, Admit Cards",
    template: "%s | SarkariResult",
  },
  description:
    "Find latest government jobs, results, admit cards, answer keys and more at SarkariResult.rest",
  keywords:
    "Sarkari Result, Sarkari Naukri, Government Jobs, Admit Cards, Results, Sarkari Exam, Sarkari Result 2025",
  metadataBase: new URL("https://sarkariresult.rest"),

  openGraph: {
    title: "SarkariResult - Government Jobs, Results, Admit Cards",
    description:
      "Find latest government jobs, results, admit cards, answer keys and more at SarkariResult.rest",
    url: "https://sarkariresult.rest",
    siteName: "SarkariResult",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "SarkariResult - Govt Jobs, Results, Admit Cards",
    description:
      "Get the latest Sarkari Naukri, Admit Cards, Results, and Answer Keys updates instantly.",
  },

  verification: {
    google: "1GbNeWCS6tHMyMZrSbM_4KyX0sJFlq3TdwUINMtgMas",
  },

  // ✅ Favicons and Web Manifest
  icons: {
    icon: [
      { url: "/fevicons/favicon.ico", sizes: "any" },
      { url: "/fevicons/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/fevicons/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/fevicons/apple-touch-icon.png",
  },
  manifest: "/fevicons/manifest.json",

  // ✅ Microsoft browser config
  other: {
    "msapplication-TileColor": "#ffffff",
    "msapplication-TileImage": "/fevicons/mstile-144x144.png",
    "msapplication-config": "/fevicons/browserconfig.xml",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* ✅ Navbar */}
          <Navbar />

          {/* ✅ Google News SwG */}
          <SwgLoginButton />

          {/* ✅ Page Content */}
          <main style={{ flex: 1, padding: "20px" }}>{children}</main>

          {/* ✅ Footer */}
          <Footer />
        </ThemeProvider>

        {/* ✅ Google News Script */}
        <script
          async
          type="application/javascript"
          src="https://news.google.com/swg/js/v1/swg-basic.js"
        ></script>
      </body>
    </html>
  )
}
