import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Goke",
  description: "Goke Technologies privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: April 12, 2026</p>

        <div className="prose prose-sm max-w-none space-y-10 text-muted-foreground leading-relaxed">

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Who We Are</h2>
            <p>
              Goke Technologies (&ldquo;Goke&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is a career advancement platform incorporated and operating in Toronto, Ontario, Canada. We are subject to Canada&apos;s <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) and applicable provincial privacy legislation.
            </p>
            <p className="mt-3">
              If you have any questions about this policy, you can contact us at{" "}
              <a href="mailto:careeradvancement@goke.io" className="text-accent underline">careeradvancement@goke.io</a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. What Information We Collect</h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li><strong className="text-foreground">Account information</strong> — your name, email address, and password when you create an account.</li>
              <li><strong className="text-foreground">Profile information</strong> — career background, work experience, skills, education, and goals you enter into the platform.</li>
              <li><strong className="text-foreground">Resume data</strong> — the content of any resume you upload or create using our tools.</li>
              <li><strong className="text-foreground">Payment information</strong> — billing details processed securely through Stripe. Goke does not store your full credit card information.</li>
              <li><strong className="text-foreground">Usage data</strong> — how you interact with the platform, including pages visited, features used, and session duration.</li>
              <li><strong className="text-foreground">Communications</strong> — any messages you send us via email or our contact form.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Provide, operate, and improve the Goke platform and its features.</li>
              <li>Generate personalized career analyses, resume optimizations, career plans, and interview preparation content.</li>
              <li>Process payments and manage your subscription.</li>
              <li>Send transactional emails such as account confirmations and billing receipts.</li>
              <li>Send product updates and relevant career resources — you can opt out at any time.</li>
              <li>Respond to your support requests and inquiries.</li>
              <li>Monitor and improve platform performance, security, and reliability.</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal information to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. How We Share Your Information</h2>
            <p>We only share your information in the following circumstances:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li><strong className="text-foreground">Service providers</strong> — trusted third parties who help us operate the platform, including Stripe (payments), Supabase (data storage), and Anthropic (AI processing). These providers are contractually bound to protect your data.</li>
              <li><strong className="text-foreground">Legal obligations</strong> — where required by law, court order, or governmental authority.</li>
              <li><strong className="text-foreground">Business transfers</strong> — in the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you before your data is transferred and becomes subject to a different privacy policy.</li>
              <li><strong className="text-foreground">With your consent</strong> — in any other circumstances, only with your explicit permission.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide you with our services. If you close your account, we will delete or anonymize your data within 90 days, except where we are required to retain it for legal or compliance purposes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Your Rights</h2>
            <p>Under PIPEDA and applicable Canadian privacy law, you have the right to:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate or incomplete information.</li>
              <li>Withdraw consent for the collection or use of your information (subject to legal or contractual restrictions).</li>
              <li>Request deletion of your account and associated data.</li>
              <li>File a complaint with the Office of the Privacy Commissioner of Canada if you believe we have violated your privacy rights.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:careeradvancement@goke.io" className="text-accent underline">careeradvancement@goke.io</a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to keep you logged in, remember your preferences, and understand how the platform is being used. You can control cookies through your browser settings, but disabling them may affect the functionality of the platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Data Security</h2>
            <p>
              We take reasonable technical and organizational measures to protect your personal information from unauthorized access, loss, or misuse. This includes encrypted data storage, secure HTTPS connections, and restricted access to personal data within our team. However, no system is completely secure — if you believe your account has been compromised, contact us immediately.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Children&apos;s Privacy</h2>
            <p>
              Goke is not intended for use by individuals under the age of 16. We do not knowingly collect personal information from children. If you believe a child has provided us with their information, please contact us and we will delete it promptly.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the &ldquo;Last updated&rdquo; date at the top of this page and, where the changes are significant, notify you by email or through the platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Contact Us</h2>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact:
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
