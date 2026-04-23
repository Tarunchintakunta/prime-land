import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://primelearning.ae/sitemap.xml",
    host: "https://primelearning.ae",
  };
}
