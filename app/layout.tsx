import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AppProvider } from "@/lib/context/app-context"
import { Toaster } from "@/components/ui/toaster"
import { ReduxProvider } from "@/lib/store/provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BACS+ - Meeting Management",
  description: "Intelligent meeting management platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ReduxProvider>
          <AppProvider>{children}</AppProvider>
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  )
}
