import type { NextConfig } from "next";

/**
 * Legacy Wix URL redirect map — entries are never deleted (CLAUDE.md SEO
 * rules). /online-order stays at "/" because the order modal lives on
 * every page.
 */
const legacyRedirects = [
  { source: "/menu-1", destination: "/menu", permanent: true },
  { source: "/copy-of-menu", destination: "/catering", permanent: true },
  { source: "/online-order", destination: "/", permanent: true },
  // Story page renamed June 2026 (owner direction: "About Us").
  { source: "/nuestra-historia", destination: "/about-us", permanent: true },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
