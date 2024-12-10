import Link from 'next/link';
import { Instagram, Twitter, Mail, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] mt-24 py-12 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* About */}
          <div className="space-y-4 md:pl-0">
            <h3 className="text-lg font-bold text-[#F8F8F8]">About</h3>
            <p className="text-[#F8F8F8]/60 text-sm">
              High-quality wallpapers for all your devices. Our collection is carefully curated to enhance your digital experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 md:pl-8">
            <h3 className="text-lg font-bold text-[#F8F8F8]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-[#F8F8F8]/60 hover:text-[#4169E1] transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#F8F8F8]/60 hover:text-[#4169E1] transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4 md:pl-8">
            <h3 className="text-lg font-bold text-[#F8F8F8]">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:yashverma.cv@gmail.com" className="text-[#F8F8F8]/60 hover:text-[#4169E1] transition-colors text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Me
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#F8F8F8]/60 hover:text-[#4169E1] transition-colors text-sm flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Follow on Instagram
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#F8F8F8]/60 hover:text-[#4169E1] transition-colors text-sm flex items-center gap-2">
                  <Twitter className="w-4 h-4" />
                  Follow on Twitter
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4 md:pl-8">
            <h3 className="text-lg font-bold text-[#F8F8F8]">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-[#F8F8F8]/60 hover:text-[#4169E1] transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#F8F8F8]/60 hover:text-[#4169E1] transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright - Centered */}
        <div className="flex justify-center mt-12 pt-8 border-t border-white/10">
          <p className="text-[#F8F8F8]/40 text-sm">
            © {new Date().getFullYear()} Pulp Pixels. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 