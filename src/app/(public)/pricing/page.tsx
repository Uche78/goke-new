import type { Metadata } from "next";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { SeoSchema } from "@/components/shared/seo-schema";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Goke's career advancement tools. Start free, upgrade when you're ready.",
};

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with the basics.",
    features: [
      "1 Career Analysis",
      "1 Resume Optimization",
      "Basic Interview Prep",
      "Career Plan (1 month)",
    ],
    cta: "Get Started",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "Everything you need to land your dream job.",
    features: [
      "Unlimited Career Analyses",
      "Unlimited Resume Optimizations",
      "Full Interview Prep (all 7 categories)",
      "Career Plans (1, 3 & 6 months)",
      "AI Bio Generation",
      "Priority Support",
    ],
    cta: "Start Pro",
    href: "/signup?plan=pro",
    highlighted: true,
  },
];

export default function PricingPage() {
  const offerSchema = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: "Goke Pro",
    price: "19",
    priceCurrency: "CAD",
    description: "Full access to all Goke career advancement tools.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
  };

  return (
    <>
      <SeoSchema schema={offerSchema} />

      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Honest Pricing
          </h1>
          <p className="text-muted-foreground text-lg">
            Start for free. Upgrade when you need more power.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 flex flex-col gap-6 ${
                  plan.highlighted
                    ? "border-accent bg-accent/5 shadow-lg"
                    : "border-border bg-card"
                }`}
              >
                {plan.highlighted && (
                  <div className="inline-flex self-start rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    Most Popular
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold">{plan.name}</h2>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">
                      /{plan.period}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-2 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check
                        size={16}
                        className="text-accent mt-0.5 shrink-0"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href={plan.href}
                  variant={plan.highlighted ? "default" : "outline"}
                  className="w-full justify-center"
                >
                  {plan.cta}
                </ButtonLink>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
