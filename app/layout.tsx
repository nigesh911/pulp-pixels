import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Pulp Pixels',
  description: 'Premium wallpapers for your devices',
  metadataBase: new URL('https://pulp-pixels.vercel.app'),
  verification: {
    google: 'YOUR-GOOGLE-VERIFICATION-CODE',
    yandex: 'YOUR-YANDEX-VERIFICATION-CODE',
    bing: 'YOUR-BING-VERIFICATION-CODE',
  },
  monetization: {
    coil: 'YOUR-COIL-PAYMENT-POINTER', // For Web Monetization
  },
  openGraph: {
    title: 'Pulp Pixels',
    description: 'Premium wallpapers for your devices',
    url: 'https://pulp-pixels.vercel.app',
    siteName: 'Pulp Pixels',
    images: [
      {
        url: 'https://pulp-pixels.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Ad network verification tags */}
        <meta name="google-adsense-account" content="ca-pub-8588729139517913" />
        <meta name="google-site-verification" content="YOUR-GOOGLE-VERIFICATION-CODE" />
        <meta name="monetization" content="YOUR-COIL-PAYMENT-POINTER" />
      </head>
      <body className={`${inter.className} bg-[#121212] text-[#F8F8F8] min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 pt-24 pb-8">
          {children}
        </main>
        <Footer />
        
        {/* AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8588729139517913"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
