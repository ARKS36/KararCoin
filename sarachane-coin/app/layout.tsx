import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastProvider } from '@/components/ui/toast'
import { BlockchainProvider, AuthProvider } from './providers'

// Font tanımını Next.js 15 uyumlu hale getirme
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Karar Coin',
  description: 'Turkiye\'nin ilk demokratik katılım tokeni',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${inter.variable} dark:bg-gray-900`}>
      <body className="font-sans min-h-screen flex flex-col dark:bg-gray-900 dark:text-white" suppressHydrationWarning>
        <ToastProvider>
          <AuthProvider>
            <BlockchainProvider>
              {children}
            </BlockchainProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
