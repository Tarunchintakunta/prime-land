import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { DebugFlags } from "@/components/providers/DebugFlags";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { ScrollDebug } from "@/components/ui/ScrollDebug";
import { BackgroundCanvas } from "@/components/ui/BackgroundCanvas";
import { Loader } from "@/components/ui/Loader";
import { CustomCursor } from "@/components/ui/CustomCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_URL = "https://primelearning.ae";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Prime Learning — Learn Smarter. Grow Faster. Lead With Purpose.",
    template: "%s — Prime Learning",
  },
  description:
    "Premium e-learning for ambitious professionals. Courses across Business, Technology, Finance, Design, and more. Made in Dubai.",
  keywords: [
    "online courses",
    "e-learning",
    "Dubai",
    "UAE",
    "professional development",
    "AI fluency",
    "business school admissions",
  ],
  openGraph: {
    title: "Prime Learning — Learn Smarter. Grow Faster. Lead With Purpose.",
    description:
      "Premium e-learning for ambitious professionals. Made in Dubai.",
    url: SITE_URL,
    siteName: "Prime Learning",
    locale: "en_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Learning",
    description:
      "Premium e-learning for ambitious professionals. Made in Dubai.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  colorScheme: "dark light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Prime Learning",
  url: SITE_URL,
  slogan: "Learn Smarter. Grow Faster. Lead With Purpose.",
  description:
    "Premium e-learning for ambitious professionals. Courses across Business, Technology, Finance, Design, and more.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <BackgroundCanvas />
        <DebugFlags />
        <LenisProvider>{children}</LenisProvider>
        <GrainOverlay />
        <CustomCursor />
        <Loader />
        <ScrollDebug />
      </body>
    </html>
  );
}
