import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SeoSchema } from "@/components/shared/seo-schema";
import { ButtonLink } from "@/components/ui/button-link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "AI Career Tools for the Canadian Job Market | Goke",
  description:
    "Goke gives you a clear, personalized path forward with AI-powered career analysis, resume optimization, and interview prep — built for professionals navigating the Canadian job market.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Goke",
  url: process.env.NEXT_PUBLIC_SITE_URL,
  description: "AI-powered career advancement platform.",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Goke",
  url: process.env.NEXT_PUBLIC_SITE_URL,
  logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.svg`,
  description:
    "AI-powered career tools to help professionals get clarity, optimize their resume, and land their next role.",
  sameAs: [
    "https://www.linkedin.com/company/goke-io",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How is Goke different from just using ChatGPT or LinkedIn?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ChatGPT gives generic advice to whoever asks. LinkedIn shows you jobs but doesn't tell you why you're not getting them. Goke is built specifically to analyse your background, identify your gaps, and give you a personalized plan — not a template. The tools work together, so your resume optimization is informed by your career analysis, which feeds into your interview prep. It's a system, not a chatbot.",
      },
    },
    {
      "@type": "Question",
      name: "How does the AI work — is it personalized to me or just generic advice?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Everything Goke generates is based on what you tell us — your experience, skills, goals, and the roles you're targeting. Two people using the same tool will get completely different outputs. The more context you provide, the sharper your results.",
      },
    },
    {
      "@type": "Question",
      name: "Is it really free to start — what's the catch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No catch. You can create an account and run your first career analysis for free. Some advanced features and ongoing tools require a subscription, but you'll see exactly what's included before you're asked to pay anything.",
      },
    },
    {
      "@type": "Question",
      name: "Can I cancel anytime?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, anytime. No contracts, no cancellation fees. If you cancel, you keep access until the end of your billing period and won't be charged again.",
      },
    },
    {
      "@type": "Question",
      name: "Will Goke guarantee I get a job?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No — and we won't pretend otherwise. Getting hired depends on many things outside our control. What Goke does is remove the guesswork, sharpen how you present yourself, and give you a clear plan to follow. The work is still yours to do — we just make sure you're doing the right work.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data private and secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Your career information, resume, and personal details are yours. We don't sell your data, share it with employers, or use it to train AI models. All data is encrypted and stored securely. You can request deletion of your account and data at any time.",
      },
    },
  ],
};

const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Goke AI Career Tools",
  description: "AI-powered career tools built for professionals navigating the Canadian job market.",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "Career Analysis",
        description: "AI-powered analysis of your background and target role, identifying gaps and strengths to give you a clear picture of where you stand in the Canadian job market.",
        provider: { "@type": "Organization", name: "Goke" },
        serviceType: "Career Counseling",
        areaServed: "Canada",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "Resume Optimizer",
        description: "Optimize your resume for specific job postings — get exact rewording suggestions and structural improvements to pass ATS filters and impress hiring managers.",
        provider: { "@type": "Organization", name: "Goke" },
        serviceType: "Resume Writing",
        areaServed: "Canada",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "Career Planning",
        description: "Turn your career goal into a concrete action plan with 1, 3, and 6-month milestones so you always know what to focus on next.",
        provider: { "@type": "Organization", name: "Goke" },
        serviceType: "Career Counseling",
        areaServed: "Canada",
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Service",
        name: "Interview Prep",
        description: "Role-specific behavioral, situational, and technical interview questions with guided answer frameworks built from your actual experience.",
        provider: { "@type": "Organization", name: "Goke" },
        serviceType: "Interview Coaching",
        areaServed: "Canada",
      },
    },
  ],
};

const FEATURES = [
  {
    title: "Career Analysis",
    outcome: "Find out exactly where you stand",
    description:
      "Tell Goke about your background and target role. You get a clear breakdown: what you bring to the table, where the gaps are, and which parts of your experience are most valuable to employers right now.",
    icon: "🎯",
  },
  {
    title: "Career Planning",
    outcome: "Know what to do this week, this month, and in 6 months",
    description:
      "Goke turns your career goal into a concrete timeline — specific actions mapped to 1, 3, and 6-month milestones. No more wondering what to focus on next. You open the plan and do the next thing.",
    icon: "📋",
  },
  {
    title: "Resume Optimizer",
    outcome: "Get your resume past the filters and in front of people",
    description:
      "Paste in a job posting and your resume. Goke shows you exactly what's missing, what to reword, and how to restructure your experience so it matches what that specific employer is screening for.",
    icon: "📄",
  },
  {
    title: "Interview Prep",
    outcome: "Walk into every interview prepared, not hoping for the best",
    description:
      "Based on your target role and background, Goke generates the questions you're most likely to face — behavioral, situational, and technical — and helps you build answers grounded in your actual experience.",
    icon: "🎤",
  },
];

export default async function LandingPage() {
  const posts = await getAllPosts();

  return (
    <>
      <SeoSchema schema={websiteSchema} />
      <SeoSchema schema={organizationSchema} />
      <SeoSchema schema={faqSchema} />
      <SeoSchema schema={servicesSchema} />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto sm:px-0 px-2 pb-2 pt-20">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="relative h-[85vh] md:h-[70vh]">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/careerpro.jpg"
                alt="Professional navigating career advancement in Canada"
                fill
                priority
                sizes="100vw"
                className="object-cover object-[70%_20%] md:object-[60%_20%]"
              />
              {/* Gradient overlay — bottom-up on mobile, left-to-right on desktop */}
              <div className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(to top, #f8f7f2 30%, rgba(248,247,242,0.85) 55%, rgba(248,247,242,0.4) 80%, transparent 100%)' }} />
              <div className="absolute inset-0 hidden md:block" style={{ background: 'linear-gradient(to right, #f8f7f2 20%, rgba(248,247,242,0.7) 45%, transparent 70%)' }} />
            </div>

            {/* Content */}
            <div className="relative h-full px-6 sm:px-10 lg:px-16 z-10">
              <div className="flex items-center md:items-start h-full pt-0 md:pt-20 lg:pt-24">
                <div className="max-w-xl w-full">
                  <p className="text-sm text-foreground/70 mb-2">
                    <span className="font-semibold text-foreground">2,000+ professionals</span> have found their path with Goke
                  </p>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                    Stop Guessing.{" "}
                    <span className="text-accent">Start Moving</span> Forward in Your Career.
                  </h1>
                  <p className="text-base md:text-lg text-foreground/70 mt-4">
                    Whether you&apos;re stuck at a crossroads or navigating a new market — Goke gives you a clear, personalized path forward with AI-powered career analysis, resume optimization, and an actionable plan to get hired.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row items-start gap-4">
                    <ButtonLink href="/signup" size="lg" style={{ padding: '1.50rem 2rem' }}>
                      Get My Free Career Analysis
                    </ButtonLink>
                    <ButtonLink
                      href="/partners"
                      variant="outline"
                      size="lg"
                      style={{ padding: '1.50rem 2rem' }}
                      className="border-[#487f6a] text-[#487f6a] hover:bg-[#487f6a] hover:text-white"
                    >
                      For Organizations →
                    </ButtonLink>
                  </div>
                  <p className="mt-3 text-xs text-foreground/50">No credit card required · Takes less than 5 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              If this sounds familiar, you&apos;re not alone.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              The job market rewards people who know where they&apos;re going, how to present themselves, and what to do next. Most people are missing at least one of those three things.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-card border border-white">
              <div className="text-3xl mb-4">🧭</div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                You don&apos;t know where to start
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                There&apos;s too much conflicting advice online. Every application feels like a shot in the dark. You&apos;re busy but not making real progress.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-white">
              <div className="text-3xl mb-4">📄</div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Your resume isn&apos;t getting responses
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You&apos;re qualified — but not getting callbacks. You don&apos;t know what&apos;s missing, what to fix, or how employers are evaluating you.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-white">
              <div className="text-3xl mb-4">🗺️</div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                You have no clear roadmap
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You know what you want, but have no concrete steps to get there. Without a plan, months pass and nothing changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20 bg-[#f0eee4]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Goke works — from analysis to hired
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
              Three steps. No fluff. Just a clear path from where you are to where you want to be.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-border z-0" />

            {[
              {
                step: "01",
                title: "Tell us about yourself",
                description: "Upload your resume or answer a few quick questions about your experience, skills, and career goals. Takes less than 5 minutes.",
              },
              {
                step: "02",
                title: "Get your personalized analysis",
                description: "Goke breaks down your strengths, identifies the gaps holding you back, and shows you exactly how you're positioned in the market — so you stop guessing and start making informed decisions.",
              },
              {
                step: "03",
                title: "Follow your plan",
                description: "You get a concrete action plan: which roles to target, what to fix on your resume, how to frame your experience, and what to prepare for interviews — all specific to your background.",
              },
            ].map((item) => (
              <div key={item.step} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-background border-2 border-border flex items-center justify-center mb-6 shadow-sm">
                  <span className="text-xl font-bold text-accent">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-14">
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              See your analysis results in minutes — then decide if Goke is right for you.
            </p>
            <ButtonLink href="/signup" size="lg" style={{ padding: '1.25rem 2rem' }}>
              Get Started Free
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              AI career tools built for the Canadian job market
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
              Four tools, one platform — each one built to solve a specific part of the process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1">{feature.title}</p>
                <h3 className="text-lg font-bold text-foreground mb-3">
                  {feature.outcome}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 md:py-20 bg-[#f0eee4]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, honest pricing
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
              Start for free. Upgrade when you need more. No hidden fees, no surprise charges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="rounded-2xl border border-white bg-card p-8 flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Free</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">$0</span>
                  <span className="text-muted-foreground text-sm">/ forever</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Everything you need to get started.</p>
              </div>
              <ul className="space-y-2 flex-1">
                {["1 Career Analysis", "1 Resume Optimization", "Basic Interview Prep", "Career Plan (1 month)"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-accent mt-0.5 shrink-0">✓</span>{f}
                  </li>
                ))}
              </ul>
              <ButtonLink
                href="/signup"
                variant="outline"
                className="w-full justify-center border-[#487f6a] text-[#487f6a] hover:bg-[#487f6a] hover:text-white"
              >
                Get Started Free
              </ButtonLink>
            </div>

            {/* Pro Plan */}
            <div className="rounded-2xl border border-white bg-[#2a5144] p-8 flex flex-col gap-6 relative">
              <div className="absolute top-4 right-4 rounded-full bg-[#487f6a] px-3 py-1 text-xs font-semibold text-white">
                Most Popular
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/75 mb-2">Pro</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$19</span>
                  <span className="text-white/75 text-sm">/ per month</span>
                </div>
                <p className="text-sm text-white/85 mt-2">Everything you need to land your dream job.</p>
              </div>
              <ul className="space-y-2 flex-1">
                {[
                  "Unlimited Career Analyses",
                  "Unlimited Resume Optimizations",
                  "Full Interview Prep (all 7 categories)",
                  "Career Plans (1, 3 & 6 months)",
                  "Priority Support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-[#487f6a] mt-0.5 shrink-0">✓</span>{f}
                  </li>
                ))}
              </ul>
              <ButtonLink
                href="/signup?plan=pro"
                className="w-full justify-center"
              >
                Start Pro
              </ButtonLink>
              <p className="text-center text-xs text-white/60 -mt-2">Cancel anytime. No contracts.</p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Need Goke for your organization?{" "}
            <a href="/partners" className="text-accent font-medium hover:underline">Talk to us about Goke Partners →</a>
          </p>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 md:py-20 bg-[#f0eee4]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Real people. Real results.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
              Here&apos;s what happens when you stop guessing and follow a plan.
            </p>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 md:mb-16">
            {[
              {
                quote: "I knew I had the skills — I just didn't know how to communicate them to Canadian employers. Goke helped me see exactly what was missing and gave me a clear plan to fix it.",
                name: "Amara T.",
                detail: "Marketing Professional · Nigeria → Toronto",
              },
              {
                quote: "After months of applying and hearing nothing back, I finally understood why. The resume optimizer showed me how my experience was being read — and how to change that.",
                name: "Daniel K.",
                detail: "Software Engineer · Kenya → Vancouver",
              },
              {
                quote: "I wasn't even sure what role I should be targeting. The career analysis gave me clarity I didn't know I needed. I finally feel like I have direction.",
                name: "Sofia R.",
                detail: "Project Manager · Colombia → Calgary",
              },
            ].map((t) => (
              <div key={t.name} className="bg-background rounded-2xl border border-border p-8 flex flex-col justify-between">
                <p className="text-sm text-foreground leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: "2,000+", label: "Professionals Helped" },
              { stat: "85%", label: "Report Stronger Job Prospects" },
              { stat: "50+", label: "Industries Covered" },
              { stat: "10", label: "Canadian Provinces" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-3xl font-bold text-accent mb-1">{item.stat}</div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Goke Partners Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="rounded-2xl border border-border overflow-hidden grid grid-cols-1 md:grid-cols-2">
            {/* Left */}
            <div className="bg-[#2a5144] p-6 md:p-14 flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">Goke Partners</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
                Do you work with people building their careers in Canada?
              </h2>
              <p className="text-white/85 text-base leading-relaxed mb-8">
                Settlement agencies and employment centers use Goke to give their clients a structured, personalized path forward — without building anything in-house.
              </p>
              <div>
                <ButtonLink
                  href="/partners"
                  size="lg"
                  style={{ padding: '1.25rem 2rem' }}
                >
                  Learn More →
                </ButtonLink>
              </div>
            </div>

            {/* Right */}
            <div className="bg-[#f0eee4] p-6 md:p-14 flex flex-col justify-center gap-6">
              {[
                {
                  title: "Ready-made career tools for your clients",
                  description: "Give your clients access to AI-powered career analysis, resume optimization, and interview prep — without building anything yourself.",
                },
                {
                  title: "Track client progress at scale",
                  description: "Monitor outcomes and career milestones across your entire client base in one place — whether you serve 10 people or 10,000.",
                },
                {
                  title: "White-label options available",
                  description: "Deploy Goke under your own brand. Your clients get a seamless experience, and your organization gets the credit.",
                },
                {
                  title: "Partnership programs",
                  description: "Flexible models designed to work within your organization's structure, budget, and goals.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
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
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Questions we get asked a lot
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              If something&apos;s holding you back, the answer is probably here.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How is Goke different from just using ChatGPT or LinkedIn?",
                a: "ChatGPT gives generic advice to whoever asks. LinkedIn shows you jobs but doesn't tell you why you're not getting them. Goke is built specifically to analyse your background, identify your gaps, and give you a personalized plan — not a template. The tools work together, so your resume optimization is informed by your career analysis, which feeds into your interview prep. It's a system, not a chatbot.",
              },
              {
                q: "How does the AI work — is it personalized to me or just generic advice?",
                a: "Everything Goke generates is based on what you tell us — your experience, skills, goals, and the roles you're targeting. Two people using the same tool will get completely different outputs. The more context you provide, the sharper your results.",
              },
              {
                q: "Is my data private and secure?",
                a: "Yes. Your career information, resume, and personal details are yours. We don't sell your data, share it with employers, or use it to train AI models. All data is encrypted and stored securely. You can request deletion of your account and data at any time.",
              },
              {
                q: "Is it really free to start — what's the catch?",
                a: "No catch. You can create an account and run your first career analysis for free. Some advanced features and ongoing tools require a subscription, but you'll see exactly what's included before you're asked to pay anything.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes, anytime. No contracts, no cancellation fees. If you cancel, you keep access until the end of your billing period and won't be charged again.",
              },
              {
                q: "Will Goke guarantee I get a job?",
                a: "No — and we won't pretend otherwise. Getting hired depends on many things outside our control. What Goke does is remove the guesswork, sharpen how you present yourself, and give you a clear plan to follow. The work is still yours to do — we just make sure you're doing the right work.",
              },
              {
                q: "I've tried other career tools before and they didn't work. Why is this different?",
                a: "Most career tools give you information. Goke gives you direction. There's a difference between reading career advice and having a tool that looks at your specific background and tells you exactly what to fix, where to focus, and what to do next. If you've felt like other tools were too generic or didn't understand your situation, that's exactly what we built Goke to solve.",
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

      {/* From the Blog Section */}
      <section className="py-12 md:py-20 bg-[#f0eee4]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">Career Resources</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">From the Blog</h2>
            </div>
            <Link href="/blog" className="text-sm font-medium text-accent hover:underline shrink-0 ml-4">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.slice(0, 4).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <article className="bg-card border border-white rounded-2xl p-6 h-full hover:shadow-md transition-shadow">
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                    {post.tags?.[0] ?? "Career Tips"}
                  </p>
                  <h3 className="text-base font-bold text-foreground group-hover:text-accent transition-colors mb-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{post.description}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-14 md:py-24 bg-[#2a5144]">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-card border border-white rounded-2xl px-6 md:px-10 py-10 md:py-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight">
              The right opportunity won&apos;t wait. Neither should you.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-10">
              Join thousands of professionals who stopped waiting for clarity and started building it. Your first step takes less than 5 minutes.
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
