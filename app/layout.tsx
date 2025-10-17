import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import AuthProvider from "@/components/AuthProvider"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ACUP - African Cup Political Party",
  description: "Building Africa's Future Together",
  generator: "v0.app",
  icons: {
    icon: "/acup-logo.jpg",
    shortcut: "/acup-logo.jpg",
    apple: "/acup-logo.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.className}`}>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Header />
            {children}
            <Footer />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}
