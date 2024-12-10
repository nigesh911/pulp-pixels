'use client';

import { Monitor, Smartphone, Download, Shield, CreditCard, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-[#F8F8F8] max-w-3xl mx-auto">
          About Pulp Pixels
        </h1>
        <p className="text-xl text-[#F8F8F8]/60 max-w-2xl mx-auto">
          I provide high-quality wallpapers for all your devices, carefully curated to enhance your digital experience.
        </p>
      </section>

      {/* Features Grid */}
      <section className="space-y-12">
        <h2 className="text-2xl font-bold text-[#F8F8F8] text-center">Why Choose My Wallpapers?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="space-y-4 p-6 bg-white/5 rounded-xl">
            <div className="w-12 h-12 bg-[#4169E1]/10 rounded-xl flex items-center justify-center">
              <Monitor className="w-6 h-6 text-[#4169E1]" />
            </div>
            <h3 className="font-semibold text-[#F8F8F8]">Desktop Optimized</h3>
            <p className="text-[#F8F8F8]/60">
              Perfect for all screen sizes and resolutions, ensuring crystal clear display on your desktop and laptop screens.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="space-y-4 p-6 bg-white/5 rounded-xl">
            <div className="w-12 h-12 bg-[#4169E1]/10 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-[#4169E1]" />
            </div>
            <h3 className="font-semibold text-[#F8F8F8]">Mobile Ready</h3>
            <p className="text-[#F8F8F8]/60">
              Optimized for all mobile devices and tablets, with perfect aspect ratios for modern smartphone displays.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="space-y-4 p-6 bg-white/5 rounded-xl">
            <div className="w-12 h-12 bg-[#4169E1]/10 rounded-xl flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-[#4169E1]" />
            </div>
            <h3 className="font-semibold text-[#F8F8F8]">High Quality</h3>
            <p className="text-[#F8F8F8]/60">
              All wallpapers are carefully selected and optimized for the highest possible quality and visual impact.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="space-y-4 p-6 bg-white/5 rounded-xl">
            <div className="w-12 h-12 bg-[#4169E1]/10 rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-[#4169E1]" />
            </div>
            <h3 className="font-semibold text-[#F8F8F8]">Instant Download</h3>
            <p className="text-[#F8F8F8]/60">
              Quick and easy download process with secure download links sent directly to your email.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="space-y-4 p-6 bg-white/5 rounded-xl">
            <div className="w-12 h-12 bg-[#4169E1]/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#4169E1]" />
            </div>
            <h3 className="font-semibold text-[#F8F8F8]">Secure Downloads</h3>
            <p className="text-[#F8F8F8]/60">
              All downloads are processed through secure channels with time-limited download links for your safety.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="space-y-4 p-6 bg-white/5 rounded-xl">
            <div className="w-12 h-12 bg-[#4169E1]/10 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-[#4169E1]" />
            </div>
            <h3 className="font-semibold text-[#F8F8F8]">Secure Payments</h3>
            <p className="text-[#F8F8F8]/60">
              Safe and secure payment processing through trusted payment gateways with instant delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6 py-8">
        <h2 className="text-2xl font-bold text-[#F8F8F8]">Ready to Get Started?</h2>
        <p className="text-[#F8F8F8]/60 max-w-2xl mx-auto">
          Browse my collection of high-quality wallpapers and find the perfect one for your device.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/browse"
            className="px-6 py-3 bg-[#4169E1] text-[#F8F8F8] rounded-lg hover:bg-[#4169E1]/90 transition-colors"
          >
            Browse Collection
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white/10 text-[#F8F8F8] rounded-lg hover:bg-white/20 transition-colors"
          >
            Contact Me
          </Link>
        </div>
      </section>
    </div>
  );
} 