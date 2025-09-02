import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import AuthProvider from "@/components/AuthProvider"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "ACUP - African Cup Political Party",
  description: "Building Africa's Future Together",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Header />
            {children}
            <Footer />
          </Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
