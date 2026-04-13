import type { Metadata } from "next";
import { ContactForm } from "@/components/shared/contact-form";

export const metadata: Metadata = {
  title: "Contact Us | Goke",
  description:
    "Get in touch with the Goke team — whether you need support, want to book a demo, or are exploring a partnership.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
  },
};

const CONTACT_REASONS = [
  {
    title: "Individual Support",
    description: "Questions about your account, a tool, or how to get the most out of Goke.",
  },
  {
    title: "Demo Request",
    description: "See Goke in action before committing. We'll walk you through everything.",
  },
  {
    title: "Partnership Inquiry",
    description: "Explore Goke Partners — white-label options, organizational accounts, and more.",
  },
  {
    title: "Other",
    description: "Anything else — press, feedback, or just to say hello.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-14 md:py-24 bg-[#2a5144]">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#487f6a] mb-4">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            We&apos;d love to hear from you
          </h1>
          <p className="text-white/85 text-base md:text-lg max-w-xl mx-auto">
            Whether you have a question, want to book a demo, or are exploring a partnership — we&apos;re here and we respond fast.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left — context */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">How can we help?</h2>
              <p className="text-muted-foreground text-sm mb-8">
                Select the reason that best fits your message and we&apos;ll make sure it gets to the right person.
              </p>

              <div className="space-y-4 mb-10">
                {CONTACT_REASONS.map((item) => (
                  <div key={item.title} className="flex gap-4 bg-card border border-white rounded-2xl px-6 py-5">
                    <div className="mt-1 w-2 h-2 rounded-full bg-accent shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#f0eee4] border border-white rounded-2xl px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Direct Email</p>
                <p className="text-sm text-muted-foreground mb-1">Prefer to reach us directly?</p>
                <a
                  href="mailto:careeradvancement@goke.io"
                  className="text-sm font-semibold text-foreground hover:text-accent transition-colors"
                >
                  careeradvancement@goke.io
                </a>
              </div>
            </div>

            {/* Right — form */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Send us a message</h2>
              <p className="text-muted-foreground text-sm mb-8">
                We typically respond within 24 hours on business days.
              </p>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
