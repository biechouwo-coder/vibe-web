import type { Metadata } from 'next'
import { Geist, Geist_Mono, Noto_Sans, Noto_Serif } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import ThemeProvider from '@/components/theme/ThemeProvider'
import { ThemeScript } from '@/components/theme/theme-script'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const notoSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

const notoSerif = Noto_Serif({
  variable: '--font-noto-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'vibe.web — Academic Research Desk',
  description: 'Daily English reading & study planner for HKUST-GZ Carbon Neutrality & Green Finance',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${notoSans.variable} ${notoSerif.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          <div className="flex min-h-screen sm:p-4 md:p-6">
            <Navbar />
            {/* Workspace */}
            <main className="flex-1 overflow-hidden rounded-none sm:rounded-[28px] border border-white/60 bg-stone-50 shadow-sm dark:border-stone-800/60 dark:bg-stone-950">
              <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
