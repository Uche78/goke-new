import type { Metadata } from "next";
import { SeoSchema } from "@/components/shared/seo-schema";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Goke's mission to help new immigrants navigate Canada's job market with AI-powered career tools.",
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Goke",
  url: process.env.NEXT_PUBLIC_SITE_URL,
  description:
    "Goke is a career advancement platform built specifically for new immigrants to Canada, providing AI-powered tools to help them find and advance in their careers.",
  foundingDate: "2024",
  areaServed: "Canada",
};

export default function AboutPage() {
  return (
    <>
      <SeoSchema schema={orgSchema} />

      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Mission
          </h1>
          <p className="text-lg text-muted-foreground">
            Goke was built to solve one of the biggest challenges facing new
            immigrants — navigating an unfamiliar job market. We combine
            AI-powered career tools with deep knowledge of the Canadian job
            landscape to give newcomers a real competitive edge.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl space-y-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Why Goke?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Moving to a new country is already hard. Finding a job that
              matches your skills and experience shouldn&apos;t be harder.
              Many immigrants arrive in Canada with years of professional
              experience, only to find their credentials aren&apos;t recognized
              or their resumes don&apos;t resonate with Canadian employers.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Goke changes that. Our AI analyzes your background, understands
              the Canadian job market, and gives you clear, actionable guidance
              — from identifying the right career paths to preparing you for
              interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Built for Immigrants",
                body: "Every feature is designed around the unique challenges newcomers face in Canada's job market.",
              },
              {
                title: "AI-Powered Insights",
                body: "Leverage advanced AI to get career analysis, resume optimization, and interview preparation tailored to you.",
              },
              {
                title: "Canadian Focus",
                body: "Deep knowledge of Canadian industries, salary benchmarks, and hiring practices across all provinces.",
              },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl border border-border">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <ButtonLink href="/signup" size="lg">
              Start Your Journey
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
