import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Wallpaper Store',
  description: 'Premium wallpapers for your devices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-[#121212] text-[#F8F8F8] min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 pt-24 pb-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
