import type { Metadata } from 'next'
import { Inter, Cinzel } from 'next/font/google'

import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'LEMM',
  description: 'LEMM',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '700', '900'],
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
