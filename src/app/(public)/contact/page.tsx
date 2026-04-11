import type { Metadata } from "next";
import { SeoSchema } from "@/components/shared/seo-schema";
import { ContactForm } from "@/components/shared/contact-form";

export const metadata: Metadata = {
  title: "Contact & FAQ",
  description:
    "Get in touch with the Goke team or find answers to frequently asked questions about our career advancement tools.",
};

const FAQ = [
  {
    q: "Who is Goke for?",
    a: "Goke is built specifically for new immigrants to Canada who are navigating the Canadian job market. Whether you just arrived or have been here a few years, our tools help you find and advance in your career.",
  },
  {
    q: "How does the Career Analysis work?",
    a: "You upload your resume, tell us your career stage and location, and our AI analyzes your background against the Canadian job market to recommend the 3 best career paths for you — with match percentages, salary ranges, and a detailed plan.",
  },
  {
    q: "Is my resume data secure?",
    a: "Yes. Your resume is stored securely and is only used to generate your personalized career tools. We never share your data with third parties.",
  },
  {
    q: "Can I use Goke if I'm not in Canada yet?",
    a: "Absolutely. Many users plan their career move before arriving. Our tools work for anyone targeting the Canadian job market.",
  },
  {
    q: "What AI is used to power Goke?",
    a: "Goke uses Anthropic's Claude — one of the most advanced AI models available — to deliver accurate, thoughtful career guidance.",
  },
  {
    q: "How do I get started?",
    a: "Create a free account, complete the short onboarding, and you'll have immediate access to Career Analysis, Resume Optimizer, and Interview Prep.",
  },
];

export default function ContactPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };

  return (
    <>
      <SeoSchema schema={faqSchema} />

      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact & FAQ
          </h1>
          <p className="text-muted-foreground text-lg">
            Have a question? We&apos;re here to help.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <ContactForm />
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {FAQ.map(({ q, a }) => (
                  <div key={q}>
                    <h3 className="font-semibold text-foreground mb-2">{q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
