/**
 * ButtonLink renders a Next.js Link styled as a Button.
 * Used instead of <Button asChild><Link> (which is Radix-only).
 */
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface ButtonLinkProps
  extends VariantProps<typeof buttonVariants> {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  style,
  children,
}: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)} style={style}>
      {children}
    </Link>
  );
}
