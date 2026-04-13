import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


export const metadata: Metadata = {
  title: {
    default: "AI Career Tools for the Canadian Job Market | Goke",
    template: "%s | Goke",
  },
  description:
    "Goke gives you a clear, personalized path forward with AI-powered career analysis, resume optimization, and an actionable plan to get hired — wherever you are in your journey.",
  keywords: [
    "career advancement Canada",
    "how to get a job in Canada",
    "resume optimizer Canada",
    "career analysis tool",
    "interview preparation Canada",
    "AI career tools",
    "job search Canada",
    "career planning tool",
    "settlement agency career tools",
    "Canadian job market",
  ],
  authors: [{ name: "Goke" }],
  creator: "Goke",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Goke",
    title: "AI Career Tools for the Canadian Job Market | Goke",
    description:
      "AI-powered career tools to help you find clarity, optimize your resume, and land your next role.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Career Tools for the Canadian Job Market | Goke",
    description:
      "AI-powered career tools to help you find clarity, optimize your resume, and land your next role.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${lora.variable} antialiased min-h-screen`}
        suppressHydrationWarning
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
