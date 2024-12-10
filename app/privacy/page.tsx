import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Pulp Pixels',
  description: 'Privacy policy and data handling practices for Pulp Pixels wallpaper service.',
};

export default function PrivacyPolicy() {
  const currentDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#F8F8F8] mb-8">Privacy Policy</h1>
      
      <div className="space-y-8 text-[#F8F8F8]/80">
        <section>
          <h2 className="text-xl font-semibold text-[#F8F8F8] mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email address (when downloading wallpapers)</li>
            <li>Usage data and preferences</li>
            <li>Payment information (for premium wallpapers)</li>
            <li>Ratings and feedback</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#F8F8F8] mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and maintain our services</li>
            <li>Send you wallpaper download links</li>
            <li>Process your payments</li>
            <li>Improve our services</li>
            <li>Communicate with you about updates and new features</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#F8F8F8] mb-4">3. Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#F8F8F8] mb-4">4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#F8F8F8] mb-4">5. Your Rights</h2>
          <p className="mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#F8F8F8] mb-4">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:yashverma.cv@gmail.com" className="text-[#4169E1] hover:underline">
              yashverma.cv@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#F8F8F8] mb-4">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>

        <p className="text-sm text-[#F8F8F8]/60 pt-8">
          Last updated: {currentDate}
        </p>
      </div>
    </div>
  );
} 