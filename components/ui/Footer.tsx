"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Eyebrow } from "./Eyebrow";

const LINKS = {
  Academy: ["Courses", "Categories", "Live Cohorts", "Instructors"],
  Resources: ["Blog", "Guides", "Case Studies", "Help Center"],
  Legal: ["Privacy", "Terms", "Code of Conduct", "Contact"],
};

export function Footer() {
  const [noWebgl, setNoWebgl] = useState(false);

  const toggleWebgl = () => {
    const next = !noWebgl;
    setNoWebgl(next);
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("nowebgl", "1");
    else url.searchParams.delete("nowebgl");
    window.location.href = url.toString();
  };

  return (
    <footer className="relative border-t border-[var(--fog)] bg-[var(--ink)] px-6 py-20 text-white lg:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 md:grid-cols-[2fr_3fr_2fr]">
        {/* Logo column */}
        <div>
          <span className="display text-2xl text-[var(--gold-bright)]">Prime Learning</span>
          <p className="body-lg mt-4 max-w-xs">
            Learn Smarter. Grow Faster. Lead With Purpose.
          </p>
          <a
            href="mailto:hello@primelearning.ae"
            className="mt-6 inline-block text-sm text-[var(--text-secondary)] hover:text-[var(--gold-bright)]"
          >
            hello@primelearning.ae
          </a>
        </div>

        {/* Links */}
        <div className="grid grid-cols-3 gap-8">
          {Object.entries(LINKS).map(([header, items]) => (
            <div key={header}>
              <Eyebrow>{header}</Eyebrow>
              <ul className="mt-4 space-y-2">
                {items.map((i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--gold-bright)]"
                    >
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div>
          <Eyebrow>Stay in the loop</Eyebrow>
          <p className="body-lg mt-4 max-w-xs">
            Monthly dispatch on new courses and free resources.
          </p>
          <form
            className="mt-6 flex gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder="you@example.com"
              className="h-11 flex-1 rounded-full border border-[var(--fog)] bg-transparent px-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--gold-bright)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--gold-bright)]"
            />
            <Button type="submit" variant="gold" className="h-11 px-5">
              Join
            </Button>
          </form>
        </div>
      </div>

      {/* Bottom strip */}
      <div
        className="mx-auto mt-20 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[var(--fog)] pt-6 text-xs md:flex-row"
        style={{ color: "var(--text-tertiary)" }}
      >
        <span>© {new Date().getFullYear()} Prime Learning. All rights reserved.</span>
        <span>Made in Dubai</span>
        <button
          onClick={toggleWebgl}
          className="text-[var(--text-secondary)] underline-offset-4 hover:text-[var(--gold-bright)] hover:underline"
          type="button"
        >
          {noWebgl ? "Enable WebGL" : "Disable WebGL"}
        </button>
      </div>
    </footer>
  );
}
