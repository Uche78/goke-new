import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Goke",
  description: "Goke Technologies terms of service — the rules and conditions that govern your use of the Goke platform.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/terms`,
  },
};

export default function TermsOfServicePage() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: April 12, 2026</p>

        <div className="prose prose-sm max-w-none space-y-10 text-muted-foreground leading-relaxed">

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using the Goke platform (&ldquo;Platform&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). These Terms form a legally binding agreement between you and Goke Technologies (&ldquo;Goke&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), a company incorporated in Toronto, Ontario, Canada.
            </p>
            <p className="mt-3">
              If you do not agree to these Terms, do not use the Platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Who Can Use Goke</h2>
            <p>You may use the Platform if you:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Are at least 16 years of age.</li>
              <li>Are not prohibited from using the Platform under applicable law.</li>
              <li>Agree to provide accurate, current, and complete information when creating your account.</li>
            </ul>
            <p className="mt-3">
              Organizations using Goke through a partnership or white-label arrangement are also subject to any additional agreement entered into with Goke Technologies.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Your Account</h2>
            <p>
              You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account. You must notify us immediately at{" "}
              <a href="mailto:careeradvancement@goke.io" className="text-accent underline">careeradvancement@goke.io</a>{" "}
              if you believe your account has been compromised.
            </p>
            <p className="mt-3">
              You may not share your account with others or create accounts on behalf of third parties without authorization.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. What Goke Provides</h2>
            <p>
              The Platform provides AI-powered career tools including career analysis, career planning, resume optimization, and interview preparation. These tools are designed to assist and inform your career decisions — they are not a guarantee of employment or any specific outcome.
            </p>
            <p className="mt-3">
              Goke&apos;s AI-generated content is based on the information you provide and general career data. It is your responsibility to review, verify, and use this content appropriately. We are not liable for decisions made based on the Platform&apos;s output.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Use the Platform for any unlawful purpose or in violation of any applicable laws.</li>
              <li>Upload or submit false, misleading, or fraudulent information.</li>
              <li>Attempt to gain unauthorized access to any part of the Platform or its infrastructure.</li>
              <li>Scrape, copy, or redistribute Platform content without our written permission.</li>
              <li>Use the Platform to harass, impersonate, or harm others.</li>
              <li>Reverse engineer, decompile, or attempt to extract the source code of the Platform.</li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate accounts that violate these rules without notice.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Payments and Subscriptions</h2>
            <p>
              Certain features of the Platform require a paid subscription. All payments are processed securely through Stripe. By subscribing, you authorize Goke to charge your payment method on a recurring basis at the rate and frequency selected at checkout.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li><strong className="text-foreground">Billing:</strong> Subscriptions are billed in advance on a monthly or annual basis depending on your plan.</li>
              <li><strong className="text-foreground">Cancellation:</strong> You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period.</li>
              <li><strong className="text-foreground">Refunds:</strong> We do not offer refunds for partial billing periods. If you believe you were charged in error, contact us within 14 days of the charge.</li>
              <li><strong className="text-foreground">Price changes:</strong> We may update our pricing with at least 30 days&apos; notice before changes take effect for existing subscribers.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Your Content</h2>
            <p>
              You retain ownership of any content you upload or create on the Platform, including your resume and career information. By using the Platform, you grant Goke a limited, non-exclusive license to process and use your content solely for the purpose of providing you with the Platform&apos;s services.
            </p>
            <p className="mt-3">
              We do not use your personal career content to train AI models or share it with third parties outside of what is described in our Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Intellectual Property</h2>
            <p>
              All content, design, code, and materials on the Platform — excluding content you upload — are the property of Goke Technologies and are protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from Platform content without our written consent.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Disclaimer of Warranties</h2>
            <p>
              The Platform is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied. We do not warrant that the Platform will be uninterrupted, error-free, or that any specific results will be achieved through its use. Career outcomes depend on many factors outside our control.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Goke Technologies shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use the Platform. Our total liability to you for any claims arising under these Terms shall not exceed the amount you paid to us in the 12 months preceding the claim.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein. Any disputes arising from these Terms shall be resolved in the courts of Toronto, Ontario, unless otherwise required by applicable consumer protection law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">12. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. When we make material changes, we will notify you by email or through the Platform at least 14 days before the changes take effect. Continued use of the Platform after that date constitutes acceptance of the updated Terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">13. Contact Us</h2>
            <p>
              If you have questions about these Terms, please contact:
            </p>
            <div className="mt-3">
              <p className="font-medium text-foreground">Goke Technologies</p>
              <p>Toronto, Ontario, Canada</p>
              <p>
                <a href="mailto:careeradvancement@goke.io" className="text-accent underline">careeradvancement@goke.io</a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
