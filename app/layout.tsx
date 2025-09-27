import type React from "react"
// import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Head from "next/head"

const inter = Inter({ subsets: ["latin"] })
import Navbar from "@/components/nav"
import Footer from "@/components/Footer"

// export const metadata: Metadata = {
//   title: "SarkariResult - Government Jobs, Results, Admit Cards",
//   description: "Find latest government jobs, results, admit cards, answer keys and more at SarkariResult.com",
//     generator: 'v0.app'
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        {/* 🌍 Global defaults */}
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
      </Head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
         <Navbar />

          {/* 🔹 Beech ka content (path change hote hi update hoga) */}
          <main style={{ flex: 1, padding: "20px" }}>{children}</main>

          {/* 🔹 Footer niche */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
