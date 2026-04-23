import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Prime Learning — Learn Smarter. Grow Faster. Lead With Purpose.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Dynamic OG image. Dark background, gold accent stroke ring, centered
 * wordmark. Rendered on-demand at the edge — no asset pipeline needed.
 */
export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at center, #1a1a24 0%, #0a0a0f 60%, #000 100%)",
          color: "white",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Gold ring — the portal */}
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: "50%",
            border: "1px solid rgba(212,165,116,0.6)",
            boxShadow:
              "inset 0 0 120px rgba(212,165,116,0.15), 0 0 80px rgba(212,165,116,0.25)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 320,
            height: 320,
            borderRadius: "50%",
            border: "1px solid rgba(91,108,255,0.5)",
          }}
        />

        <div
          style={{
            fontSize: 18,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#d4a574",
            marginBottom: 24,
          }}
        >
          Prime Learning
        </div>
        <div
          style={{
            fontSize: 80,
            letterSpacing: "-0.02em",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.05,
          }}
        >
          Learn Smarter.
          <br />
          Grow Faster. Lead With Purpose.
        </div>
      </div>
    ),
    size
  );
}
