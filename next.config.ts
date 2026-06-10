import type { NextConfig } from "next";

/**
 * Legacy Wix URL redirect map — entries are never deleted (CLAUDE.md SEO rules).
 * Interim destinations point to "/" until the final page ships:
 *   /menu-1, /menu  -> /menu     (Phase 2)
 *   /copy-of-menu   -> /catering (Phase 4)
 *   /online-order   -> /         (order modal lives on every page)
 */
const legacyRedirects = [
  { source: "/menu-1", destination: "/", permanent: true },
  { source: "/copy-of-menu", destination: "/", permanent: true },
  { source: "/online-order", destination: "/", permanent: true },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
