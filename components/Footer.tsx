'use client';

import Link from 'next/link';
import { Mail, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#F8F8F8]">About</h2>
            <p className="text-[#F8F8F8]/60 text-sm leading-relaxed">
              High-quality wallpapers for all your devices. Our collection is carefully curated to enhance your digital experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#F8F8F8]">Quick Links</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-[#F8F8F8]/60 hover:text-[#4169E1] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#F8F8F8]/60 hover:text-[#4169E1] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#F8F8F8]">Contact</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="mailto:yashverma.cv@gmail.com" 
                  className="flex items-center gap-2 text-[#F8F8F8]/60 hover:text-[#4169E1] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Me</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#F8F8F8]/60 hover:text-[#4169E1] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Follow on Instagram</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#F8F8F8]/60 hover:text-[#4169E1] transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  <span>Follow on Twitter</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#F8F8F8]">Legal</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-[#F8F8F8]/60 hover:text-[#4169E1] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#F8F8F8]/60 hover:text-[#4169E1] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="text-center text-sm text-[#F8F8F8]/60">
            <p>© {new Date().getFullYear()} Pulp Pixels. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 