import type { Metadata } from "next";
import { SeoSchema } from "@/components/shared/seo-schema";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "About Goke | Our Story",
  description:
    "Goke was built to give everyone access to the career clarity that used to require a mentor, a coach, or the right connections.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Goke Technologies",
  url: process.env.NEXT_PUBLIC_SITE_URL,
  description:
    "AI-powered career tools that give everyone access to the clarity and direction that used to require a mentor or a career coach.",
  foundingDate: "2024",
  areaServed: "Canada",
};

const VALUES = [
  {
    title: "Access over privilege",
    description:
      "Career clarity shouldn't be reserved for people with mentors or money. We built Goke so that anyone — regardless of their network or budget — can access the guidance that changes careers.",
  },
  {
    title: "Honesty over hype",
    description:
      "We tell you what's real, not what you want to hear. Our tools are built to give you an honest picture of where you stand and what it will actually take to move forward.",
  },
  {
    title: "Empowerment over dependency",
    description:
      "We give you the tools, the analysis, and the plan. The work is yours to own. Our goal is to make you capable and confident — not dependent on us.",
  },
  {
    title: "Breadth over assumption",
    description:
      "We show you what's possible before telling you what to do. Too many people don't know what they're qualified for or what's available to them. We fix that first.",
  },
];

export default function AboutPage() {
  return (
    <>
      <SeoSchema schema={orgSchema} />

      {/* Hero */}
      <section className="py-14 md:py-24 bg-[#2a5144]">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#487f6a] mb-4">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Built for the people nobody built anything for
          </h1>
          <p className="text-white/85 text-base md:text-lg max-w-2xl mx-auto">
            Goke exists to give everyone access to the career clarity that used to require a mentor, a coach, or the right connections.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">The Founder Story</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10 leading-tight">
              Why Goke exists
            </h2>
          </div>

          <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>
              Nobody tells you what you&apos;re qualified for. Nobody maps out what&apos;s available to you. You&apos;re just expected to figure it out — and if you don&apos;t, the assumption is that you weren&apos;t good enough.
            </p>
            <p>
              The people who do navigate their careers well almost always have one thing others don&apos;t: access. A mentor in the right industry. A coach they could afford. A network that opened doors before they even knew the doors existed.
            </p>
            <p>
              Goke was built from the recognition that this isn&apos;t a talent problem — it&apos;s an access problem.
            </p>
            <p>
              The goal was to show people what&apos;s actually available to them. To broaden the choices they could see and empower them to make informed decisions about their own careers. Most career tools tell you what to do. Goke starts by showing you what&apos;s possible.
            </p>
            <p className="text-foreground font-medium">
              Because when people can see the full picture, they make better decisions. And better decisions change careers.
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-12 md:py-20 bg-[#f0eee4]">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">Our Vision</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            A world where your career potential isn&apos;t limited by who you know or what you can afford.
          </h2>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8 md:mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">Our Values</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What we stand for
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
              These aren&apos;t words on a wall. They&apos;re the decisions we make every time we build something.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((value) => (
              <div key={value.title} className="bg-card border border-white rounded-2xl p-8">
                <h3 className="text-lg font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-12 md:py-20 bg-[#f0eee4]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8 md:mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">Who We Serve</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Two audiences. One mission.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Goke is built for anyone at a career crossroads — and for the organizations that help them get through it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-white rounded-2xl p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Individuals</p>
              <h3 className="text-xl font-bold text-foreground mb-4">People figuring out their next move</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Whether you&apos;re new to Canada, changing industries, or just feeling stuck — Goke gives you a clear, personalized path forward. Career analysis, resume optimization, career planning, and interview prep in one place.
              </p>
              <div className="mt-6">
                <ButtonLink
                  href="/signup"
                  size="lg"
                                  >
                  Get Started Free
                </ButtonLink>
              </div>
            </div>

            <div className="bg-[#2a5144] border border-white rounded-2xl p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#487f6a] mb-3">Organizations</p>
              <h3 className="text-xl font-bold text-white mb-4">Teams that help people transition</h3>
              <p className="text-sm text-white/85 leading-relaxed">
                Settlement agencies, employment centers, and nonprofits use Goke to give their clients structured career tools at scale — without building anything themselves. White-label options available.
              </p>
              <div className="mt-6">
                <ButtonLink
                  href="/partners"
                  size="lg"
                                  >
                  Explore Goke Partners
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-24 bg-[#2a5144]">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-card border border-white rounded-2xl px-6 md:px-10 py-10 md:py-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight">
              Ready to see what&apos;s possible for your career?
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-10">
              Your first career analysis is free. No credit card required. Takes less than 5 minutes.
            </p>
            <ButtonLink
              href="/signup"
              size="lg"
              style={{ padding: '1.25rem 2.5rem' }}
            >
              Get Started Free
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
