import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Pulp Pixels',
  description: 'Terms of service and usage guidelines for Pulp Pixels wallpaper service.',
};

export default function TermsOfService() {
  const currentDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#F8F8F8] mb-8">Terms of Service</h1>
      
      <div className="space-y-8 text-[#F8F8F8]/80">
        <section>
          <h2 className="text-xl font-semibold text-[#F8F8F8] mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Pulp Pixels, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#F8F8F8] mb-4">2. Use License</h2>
          <div className="space-y-4">
            <p>
              Upon downloading a wallpaper, you are granted a personal, non-exclusive, non-transferable license to use the wallpaper for personal purposes only.
            </p>
            <p>You are not allowed to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or alter the wallpapers</li>
              <li>Use the wallpapers for commercial purposes</li>
              <li>Redistribute or sell the wallpapers</li>
              <li>Claim ownership of the wallpapers</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#F8F8F8] mb-4">3. Payment Terms</h2>
          <div className="space-y-4">
            <p>
              Some wallpapers may require payment before download. By making a purchase, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate payment information</li>
              <li>Pay all charges at the prices in effect when incurred</li>
              <li>Accept that all sales are final</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#F8F8F8] mb-4">4. User Content</h2>
          <p>
            When rating or interacting with our service, you agree that your content will not:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Violate any laws or regulations</li>
            <li>Infringe on any third-party rights</li>
            <li>Contain harmful or malicious content</li>
            <li>Harass or harm others</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#F8F8F8] mb-4">5. Intellectual Property</h2>
          <p>
            All wallpapers, designs, and content on Pulp Pixels are protected by copyright and other intellectual property rights. You may not use, reproduce, or distribute our content without permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#F8F8F8] mb-4">6. Disclaimer</h2>
          <p>
            Pulp Pixels provides wallpapers "as is" without any warranties, express or implied. We do not guarantee that our service will be uninterrupted, secure, or error-free.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#F8F8F8] mb-4">7. Limitation of Liability</h2>
          <p>
            Pulp Pixels shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#F8F8F8] mb-4">8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#F8F8F8] mb-4">9. Contact Information</h2>
          <p>
            For any questions regarding these terms, please contact us at{' '}
            <a href="mailto:yashverma.cv@gmail.com" className="text-[#4169E1] hover:underline">
              yashverma.cv@gmail.com
            </a>
          </p>
        </section>

        <p className="text-sm text-[#F8F8F8]/60 pt-8">
          Last updated: {currentDate}
        </p>
      </div>
    </div>
  );
} 