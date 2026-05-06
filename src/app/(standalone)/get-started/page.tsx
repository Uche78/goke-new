import type { Metadata } from "next";
import Link from "next/link";
import { PreAuthWizard } from "@/components/career-analysis/pre-auth-wizard";

export const metadata: Metadata = {
  title: "Get Your Free Career Analysis | Goke",
  description:
    "Upload your resume and get an AI-powered career analysis in minutes — no account required to start.",
};

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary">Goke</Link>
          <h1 className="text-3xl font-bold text-foreground mt-4 mb-2">
            Get your free career analysis
          </h1>
          <p className="text-muted-foreground">
            Takes less than 5 minutes. No account needed to start.
          </p>
        </div>
        <PreAuthWizard />
        <p className="text-center text-xs text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-accent font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
