import type { MetadataRoute } from "next";

import { getLocations } from "@/lib/content";

const BASE = "https://www.taquerialoshermanos.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/menu",
    "/catering",
    "/locations",
    "/nuestra-historia",
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const locationRoutes = getLocations().map((location) => ({
    url: `${BASE}/locations/${location.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...locationRoutes];
}
