"use client";

import Link from "next/link";

import { useSiteState } from "@/components/chrome/site-state";

/**
 * Navigation only lists routes that exist — entries are added as their
 * phases ship (no dead links, ever). The full drawer arrives with the
 * multi-page nav in Phase 2.
 */
const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Locations", href: "/#locations" },
];

export function Header() {
  const { openDialog } = useSiteState();

  return (
    <header className="sticky top-0 z-10 border-b border-cream-dark bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex min-h-11 flex-col justify-center">
          <span className="font-display text-xl leading-none">
            Los Hermanos
          </span>
          <span className="text-[0.65rem] tracking-[0.2em] text-charcoal-soft uppercase">
            Taqueria · Est. 2001
          </span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-2 sm:gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden min-h-11 content-center text-sm font-medium hover:text-terra-text sm:block"
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => openDialog("order")}
            className="bg-cta inline-flex min-h-12 items-center rounded-md px-5 font-semibold text-white transition-opacity duration-[var(--duration-micro)] hover:opacity-90"
          >
            Order online
          </button>
        </nav>
      </div>
    </header>
  );
}
