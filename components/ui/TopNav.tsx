"use client";

import { useEffect, useState } from "react";
import { useScrollStore } from "@/components/providers/ScrollStore";
import { Button } from "./Button";

const LINKS = [
  { label: "Why", href: "#chapter-manifesto" },
  { label: "Categories", href: "#chapter-categories" },
  { label: "Courses", href: "#chapter-courses" },
  { label: "How", href: "#chapter-how" },
];

/**
 * Fixed top nav. Fades in after the user leaves the hero, and supports
 * smooth-scroll to section anchors via the global Lenis instance (falls back
 * to window.scrollTo if Lenis isn't available, e.g. prefers-reduced-motion).
 */
export function TopNav() {
  const scrollY = useScrollStore((s) => s.scrollY);
  const theme = useScrollStore((s) => s.theme);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(scrollY > window.innerHeight * 0.6);
  }, [scrollY]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href) as HTMLElement | null;
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY;

    // Use Lenis if it has been attached to window by the provider; otherwise
    // fall back. We don't import Lenis here to avoid another client bundle.
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(top, { duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 5) });
    } else {
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Skip-to-content — visually hidden until focused */}
      <a
        href="#chapter-gate"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-[var(--gold)] focus:px-3 focus:py-2 focus:text-[var(--ink)]"
      >
        Skip to content
      </a>
      <nav
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-all duration-500 lg:px-12 ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
        style={{
          background:
            theme === "paper"
              ? "linear-gradient(to bottom, rgba(245,242,235,0.85), rgba(245,242,235,0))"
              : "linear-gradient(to bottom, rgba(10,10,15,0.85), rgba(10,10,15,0))",
          backdropFilter: "blur(10px)",
          color: theme === "paper" ? "var(--ink)" : "white",
        }}
        aria-label="Primary"
      >
        <a
          href="#chapter-gate"
          onClick={(e) => handleNav(e, "#chapter-gate")}
          className="display text-xl tracking-tight"
          style={{
            color: theme === "paper" ? "var(--gold-dark)" : "var(--gold-bright)",
          }}
        >
          Prime Learning
        </a>
        <ul className="hidden gap-8 text-sm md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => handleNav(e, l.href)}
                className="opacity-70 transition-opacity hover:opacity-100"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <Button variant="gold" className="h-10 px-4 text-xs">
          Enroll
        </Button>
      </nav>
    </>
  );
}
