"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/partners", label: "For Organizations" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColor = scrolled ? "text-muted-foreground hover:text-foreground" : "text-black hover:text-black/70";

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm" : "bg-transparent"}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className={`text-2xl font-bold font-[family-name:var(--font-heading)] transition-colors duration-300 ${scrolled ? "text-primary" : "text-black"}`}>Goke</span>
        </Link>

        {/* Desktop nav + CTA — all right aligned */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors duration-300 ${textColor}`}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-black/10">
            <ButtonLink
              href="/login"
              variant="outline"
              className={`transition-colors duration-300 text-sm border-[#487f6a] text-[#487f6a] hover:bg-[#487f6a] hover:text-white ${scrolled ? "" : ""}`}
            >
              Sign In
            </ButtonLink>
            <ButtonLink
              href="/get-started"
              style={{ padding: '0.6rem 1.25rem' }}
            >
              Get Started
            </ButtonLink>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} className={scrolled ? "" : "text-black"} /> : <Menu size={20} className={scrolled ? "" : "text-black"} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <ButtonLink href="/login" variant="outline" className="w-full justify-center">
                Sign In
              </ButtonLink>
              <ButtonLink
                href="/get-started"
                className="w-full justify-center"
              >
                Get Started
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
