import type { Course } from "./courseData";

/**
 * Generated SVG pattern overlay for course card thumbnails. Pure SVG so we
 * don't ship stock imagery — part of the premium feel is that nothing is
 * sourced.
 */
export function CoursePattern({ pattern }: { pattern: Course["pattern"] }) {
  const id = `p-${pattern}`;
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-30 mix-blend-screen"
      viewBox="0 0 120 68"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {pattern === "dots" && (
          <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="white" />
          </pattern>
        )}
        {pattern === "grid" && (
          <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
            <path
              d="M8 0H0V8"
              fill="none"
              stroke="white"
              strokeOpacity="0.4"
              strokeWidth="0.3"
            />
          </pattern>
        )}
        {pattern === "lines" && (
          <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
            <line x1="0" y1="0" x2="0" y2="12" stroke="white" strokeOpacity="0.5" strokeWidth="0.4" />
          </pattern>
        )}
        {pattern === "waves" && (
          <pattern id={id} width="24" height="12" patternUnits="userSpaceOnUse">
            <path
              d="M0 6 Q 6 0 12 6 T 24 6"
              fill="none"
              stroke="white"
              strokeOpacity="0.4"
              strokeWidth="0.5"
            />
          </pattern>
        )}
      </defs>
      <rect width="120" height="68" fill={`url(#${id})`} />
    </svg>
  );
}
