/**
 * Seven inline SVG line-art icons for Chapter 4 categories. Each uses a
 * dashed stroke that the card hover animates (stroke-dashoffset → 0) to
 * "draw" the illustration.
 *
 * Kept small, monochrome, and currentColor-driven so Tailwind text utilities
 * can color them on hover.
 */

type IconProps = { className?: string };

const baseProps = {
  width: 72,
  height: 72,
  viewBox: "0 0 72 72",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconLeadership({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <circle cx="36" cy="22" r="10" />
      <path d="M18 58c2-10 10-16 18-16s16 6 18 16" />
      <path d="M26 10l4 4M46 10l-4 4" />
    </svg>
  );
}

export function IconTech({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <rect x="10" y="18" width="52" height="34" rx="2" />
      <path d="M10 28h52" />
      <circle cx="16" cy="23" r="1.5" />
      <circle cx="22" cy="23" r="1.5" />
      <path d="M24 62h24M36 52v10" />
    </svg>
  );
}

export function IconFinance({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M10 54l12-14 10 8 14-20 16 14" />
      <path d="M10 60h52" />
      <circle cx="62" cy="42" r="2.5" />
    </svg>
  );
}

export function IconCreative({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M14 58c0-4 2-8 8-10l18-26a4 4 0 016 6L20 52c-2 2-6 4-6 6z" />
      <path d="M42 18l8 8" />
    </svg>
  );
}

export function IconProfessional({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <rect x="10" y="22" width="52" height="36" rx="3" />
      <path d="M26 22v-6a3 3 0 013-3h14a3 3 0 013 3v6" />
      <path d="M10 36h52" />
    </svg>
  );
}

export function IconAcademic({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M4 28l32-14 32 14-32 14L4 28z" />
      <path d="M16 34v12c0 4 8 8 20 8s20-4 20-8V34" />
      <path d="M60 30v16" />
    </svg>
  );
}

export function IconAdmissions({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className} aria-hidden="true">
      <path d="M36 8l26 24-26 32L10 32z" />
      <path d="M36 20v14" />
      <circle cx="36" cy="42" r="2" />
    </svg>
  );
}
