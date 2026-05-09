import type { Metadata } from 'next'
import { Geist, Geist_Mono, Noto_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

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

export const metadata: Metadata = {
  title: 'vibe.web — Learn & Plan',
  description: 'Daily English learning & task planner for HKUST-GZ Carbon Neutrality & Green Finance',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${notoSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">{children}</main>
      </body>
    </html>
  )
}
