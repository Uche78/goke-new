import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Goke | Career Advancement for New Immigrants to Canada",
    template: "%s | Goke",
  },
  description:
    "Goke helps new immigrants navigate the Canadian job market with AI-powered career analysis, resume optimization, and personalized career planning.",
  keywords: [
    "career advancement",
    "Canada jobs",
    "immigrants",
    "career analysis",
    "resume optimizer",
    "job market Canada",
  ],
  authors: [{ name: "Goke" }],
  creator: "Goke",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Goke",
    title: "Goke | Career Advancement for New Immigrants to Canada",
    description:
      "AI-powered career tools to help new immigrants find their path in Canada.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Goke - Career Advancement for Immigrants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Goke | Career Advancement for New Immigrants to Canada",
    description:
      "AI-powered career tools to help new immigrants find their path in Canada.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
