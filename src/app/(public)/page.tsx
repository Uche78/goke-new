import type { Metadata } from "next";
import { SeoSchema } from "@/components/shared/seo-schema";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Goke | Career Advancement for New Immigrants to Canada",
  description:
    "Goke helps new immigrants navigate the Canadian job market with AI-powered career analysis, resume optimization, and personalized career planning.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Goke",
  url: process.env.NEXT_PUBLIC_SITE_URL,
  description: "Career advancement platform for new immigrants to Canada.",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Goke",
  url: process.env.NEXT_PUBLIC_SITE_URL,
  logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.svg`,
  description:
    "Helping new immigrants navigate the Canadian job market with AI-powered career tools.",
};

const FEATURES = [
  {
    title: "Career Analysis",
    description:
      "Get a personalized AI-powered career analysis based on your resume, experience, and goals.",
    icon: "🎯",
  },
  {
    title: "Career Planning",
    description:
      "Create actionable 1-month, 3-month, and 6-month career plans tailored to your goals.",
    icon: "📋",
  },
  {
    title: "Resume Optimizer",
    description:
      "Optimize your resume for any job description to increase your chances of landing interviews.",
    icon: "📄",
  },
  {
    title: "Interview Prep",
    description:
      "Practice with AI-generated interview questions tailored to your target role.",
    icon: "🎤",
  },
];

export default function LandingPage() {
  return (
    <>
      <SeoSchema schema={websiteSchema} />
      <SeoSchema schema={organizationSchema} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent font-medium mb-6">
            Built for newcomers to Canada
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Navigate Canada&apos;s{" "}
            <span className="text-accent">Job Market</span> with Confidence
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Goke helps new immigrants discover career opportunities, optimize
            their resumes, and create actionable plans to land their dream job
            in Canada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonLink href="/signup" size="lg">
              Get Started Free
            </ButtonLink>
            <ButtonLink href="/about" size="lg" variant="outline">
              Learn More
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to advance your career
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our AI-powered tools are designed specifically for immigrants
              navigating a new job market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: "500+", label: "Immigrants Helped" },
              { stat: "85%", label: "Improved Job Prospects" },
              { stat: "50+", label: "Industries Covered" },
              { stat: "10", label: "Canadian Provinces" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-3xl font-bold text-primary mb-1">
                  {item.stat}
                </div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to start your Canadian career?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Join thousands of immigrants who have used Goke to find their path
            in Canada&apos;s job market.
          </p>
          <ButtonLink
            href="/signup"
            size="lg"
            variant="secondary"
            className="font-semibold"
          >
            Create Free Account
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
