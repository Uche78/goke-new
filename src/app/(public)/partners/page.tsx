import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Goke Partners | Career Tools for Organizations",
  description:
    "Goke Partners helps settlement agencies, employment centers, and immigrant-serving organizations give their clients a structured, personalized career path — at scale.",
};

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Set up your organization",
    description:
      "We onboard your organization and configure the platform for your client base — including white-label options if needed.",
  },
  {
    step: "02",
    title: "Invite your clients",
    description:
      "Your clients get access to Goke's full suite of AI-powered career tools — career analysis, resume optimization, career planning, and interview prep.",
  },
  {
    step: "03",
    title: "Track progress and outcomes",
    description:
      "Monitor client engagement and career milestones from your organization dashboard. Report outcomes with real data.",
  },
];

const BENEFITS = [
  {
    title: "No tech team required",
    description:
      "Goke is a ready-made platform. You don't need to build, maintain, or manage anything. Just invite your clients and let the tools do the work.",
  },
  {
    title: "Scales with your client base",
    description:
      "Whether you work with 20 clients or 2,000, Goke handles the load. The platform is built to scale without additional overhead on your side.",
  },
  {
    title: "White-label options",
    description:
      "Deploy Goke under your own brand. Your clients get a seamless experience that looks and feels like your organization's product.",
  },
  {
    title: "Flexible partnership models",
    description:
      "We work with organizations of different sizes, structures, and budgets. Talk to us and we'll find a model that fits.",
  },
  {
    title: "Measurable client outcomes",
    description:
      "Track career analyses completed, resumes optimized, and plans created. Turn client activity into reportable outcomes for your stakeholders.",
  },
  {
    title: "Dedicated support",
    description:
      "You get a dedicated point of contact at Goke — not a support ticket queue. We're partners, not just a vendor.",
  },
];

const WHO_ITS_FOR = [
  "Settlement agencies",
  "Employment centers",
  "Immigrant-serving nonprofits",
  "Workforce development organizations",
  "Community colleges and career services",
  "Government-funded employment programs",
];

export default function PartnersPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-14 md:py-24 bg-[#2a5144]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#487f6a] mb-4">Goke Partners</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Give your clients a clear path forward — without building anything yourself
          </h1>
          <p className="text-white/85 text-base md:text-lg max-w-2xl mx-auto mb-10">
            Settlement agencies and employment centers use Goke to give their clients structured, personalized career tools at scale. Your clients get clarity. You get outcomes you can report.
          </p>
          <ButtonLink
            href="/contact"
            size="lg"
            style={{ padding: '1.25rem 2.5rem' }}
          >
            Book a Demo
          </ButtonLink>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for organizations that work with career transitioners
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              If your organization helps people navigate career transitions — whether they&apos;re new to Canada or simply figuring out their next move — Goke was built with you in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WHO_ITS_FOR.map((item) => (
              <div key={item} className="bg-card border border-white rounded-2xl px-6 py-5 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                <p className="text-sm font-medium text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-20 bg-[#f0eee4]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Goke Partners works
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Simple to set up. Powerful for your clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-background border-2 border-white flex items-center justify-center mb-5 shadow-sm">
                  <span className="text-lg font-bold text-accent">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What your organization gets
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
              Goke Partners is designed to make your job easier and your clients&apos; outcomes measurably better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BENEFITS.map((item) => (
              <div key={item.title} className="bg-card border border-white rounded-2xl p-8 flex gap-4">
                <div className="mt-1 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-20 bg-[#f0eee4]">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Common questions
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "Can Goke scale for our organization?",
                a: "Yes. Goke Partners is designed for organizations that work with career transitioners at scale — whether you serve 10 clients or 10,000. The platform handles the load without additional overhead on your side.",
              },
              {
                q: "Can we white-label the platform?",
                a: "Yes. We offer white-label options so your clients get the experience under your own brand. Your organization gets the credit — we handle the technology.",
              },
              {
                q: "What does the pricing model look like for organizations?",
                a: "We work with flexible partnership models designed around your organization's structure, budget, and client volume. Book a demo and we'll walk you through what makes sense for your situation.",
              },
              {
                q: "How long does it take to get set up?",
                a: "Most organizations are up and running within a few days. We handle the onboarding and configuration — you just need to invite your clients.",
              },
            ].map((item) => (
              <details key={item.q} className="group bg-card border border-white rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
                  <span className="text-sm font-semibold text-foreground pr-4">{item.q}</span>
                  <span className="text-accent shrink-0 text-lg transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-24 bg-[#2a5144]">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-card border border-white rounded-2xl px-6 md:px-10 py-10 md:py-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight">
              Ready to bring Goke to your clients?
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-10">
              Book a demo and we&apos;ll walk you through how Goke Partners works, what it looks like for your clients, and how we can make it fit your organization.
            </p>
            <ButtonLink
              href="/contact"
              size="lg"
              style={{ padding: '1.25rem 2.5rem' }}
            >
              Book a Demo
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
