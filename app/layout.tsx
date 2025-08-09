import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { PWAInit } from "@/components/pwa-init"
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const jbmono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'RandomFast',
  description: 'Track intermittent and multi-day fasting with weighted random durations.',
  generator: 'v0.dev',
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0ea5a1" }, // teal-500
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" }   // slate-ish dark
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jbmono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <PWAInit />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
