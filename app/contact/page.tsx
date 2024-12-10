'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Loader } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('You have reached the maximum number of submissions for today. Please try again tomorrow.');
        }
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus({
        type: 'success',
        message: 'Message sent successfully! I will get back to you soon.',
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-[#F8F8F8] mb-4">Contact Me</h1>
            <p className="text-[#F8F8F8]/60">
              Have questions about the wallpapers? I'm here to help! Get in touch with me through any of these channels.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#4169E1]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-[#4169E1]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#F8F8F8]">Email</h3>
                <p className="text-[#F8F8F8]/60">yashverma.cv@gmail.com</p>
                <p className="text-sm text-[#F8F8F8]/40">I might respond... no promises though 😉</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#4169E1]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-[#4169E1]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#F8F8F8]">Phone</h3>
                <p className="text-[#F8F8F8]/60">+91 84005-85585</p>
                <p className="text-sm text-[#F8F8F8]/40">Monday to Friday, 9am to 6pm IST</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#4169E1]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[#4169E1]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#F8F8F8]">Location</h3>
                <p className="text-[#F8F8F8]/60">Jaipur, Rajasthan</p>
                <p className="text-sm text-[#F8F8F8]/40">India</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[#F8F8F8]">Follow Me</h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Instagram className="w-6 h-6 text-[#F8F8F8]" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Twitter className="w-6 h-6 text-[#F8F8F8]" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white/5 p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#F8F8F8]/80 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 text-[#F8F8F8]"
                placeholder="Your name"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#F8F8F8]/80 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 text-[#F8F8F8]"
                placeholder="your@email.com"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#F8F8F8]/80 mb-2">
                Message
              </label>
              <textarea
                id="message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 text-[#F8F8F8]"
                placeholder="How can I help you?"
                disabled={isSubmitting}
              />
            </div>

            {status.message && (
              <div
                className={`p-4 rounded-lg ${
                  status.type === 'success'
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-red-500/10 text-red-500'
                }`}
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-[#4169E1] text-white rounded-lg hover:bg-[#4169E1]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 