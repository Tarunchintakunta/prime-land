"use client";

import { cn } from "@/lib/cn";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "gold";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  as?: "button" | "a";
  href?: string;
}

const base =
  "group relative inline-flex items-center justify-center gap-2 " +
  "h-12 px-6 rounded-full text-sm font-medium tracking-tight " +
  "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "disabled:opacity-40 disabled:pointer-events-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-4";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--gold)] text-[var(--ink)] hover:bg-[var(--gold-soft)] " +
    "shadow-[0_0_0_0_rgba(212,165,116,0)] hover:shadow-[0_0_32px_0_rgba(212,165,116,0.35)]",
  ghost:
    "border border-[var(--fog)] text-[var(--text-primary)] hover:border-[var(--gold-bright)] hover:text-white " +
    "hover:bg-white/[0.03]",
  gold:
    "bg-transparent text-[var(--gold-bright)] border border-[var(--gold-bright)] hover:bg-[var(--gold)] hover:text-[var(--ink)] hover:border-[var(--gold)]",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", className, children, as, href, ...rest },
  ref
) {
  const classes = cn(base, variants[variant], className);
  if (as === "a" && href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button ref={ref} className={classes} {...rest}>
      {children}
    </button>
  );
});
