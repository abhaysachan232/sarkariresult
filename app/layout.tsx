import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/nav"
import Footer from "@/components/Footer"
import Script from "next/script"
import SwgLoginButton from "@/components/SwgLoginButton"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 🌍 Basic Meta */}
        <title>SarkariResult - Government Jobs, Results, Admit Cards</title>
        <meta
          name="description"
          content="Find latest government jobs, results, admit cards, answer keys and more at SarkariResult.rest"
        />
        <meta
          name="keywords"
          content="Sarkari Result, Sarkari Naukri, Government Jobs, Admit Cards, Results"
        />
        <meta property="og:site_name" content="SarkariResult" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="google-site-verification" content="1GbNeWCS6tHMyMZrSbM_4KyX0sJFlq3TdwUINMtgMas" />

        {/* ✅ Favicons */}
        <link rel="icon" href="/fevicons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/fevicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/fevicons/favicon-16x16.png" />
        {/* <link rel="apple-touch-icon" sizes="180x180" href="/fevicon/apple-touch-icon.png" /> */}
        <link rel="manifest" href="/fevicons/manifest.json" />

        {/* ✅ BrowserConfig for Windows */}
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/fevicons/mstile-144x144.png" />
        <meta name="msapplication-config" content="/fevicons/browserconfig.xml" />

        {/* ✅ Sitemap & Feeds */}
  

        {/* ✅ SwG Script */}
        <script
          async
          type="application/javascript"
          src="https://news.google.com/swg/js/v1/swg-basic.js"
        ></script>
      </head>

      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <SwgLoginButton />
          <main style={{ flex: 1, padding: "20px" }}>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
