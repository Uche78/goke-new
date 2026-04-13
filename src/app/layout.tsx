import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono, Lora } from "next/font/google";
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

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Goke | AI-Powered Career Advancement",
    template: "%s | Goke",
  },
  description:
    "Goke gives you a clear, personalized path forward with AI-powered career analysis, resume optimization, and an actionable plan to get hired — wherever you are in your journey.",
  keywords: [
    "career advancement",
    "Canada jobs",
    "career analysis",
    "resume optimizer",
    "job market Canada",
    "career planning",
    "interview preparation",
  ],
  authors: [{ name: "Goke" }],
  creator: "Goke",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Goke",
    title: "Goke | AI-Powered Career Advancement",
    description:
      "AI-powered career tools to help you find clarity, optimize your resume, and land your next role.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Goke - AI-Powered Career Advancement",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Goke | AI-Powered Career Advancement",
    description:
      "AI-powered career tools to help you find clarity, optimize your resume, and land your next role.",
    images: ["/og-image.png"],
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
        className={`${plusJakartaSans.variable} ${lora.variable} ${geistMono.variable} antialiased min-h-screen`}
        suppressHydrationWarning
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
