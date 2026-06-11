"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

import { NAV_LINKS } from "@/components/chrome/nav-links";
import { useSiteState } from "@/components/chrome/site-state";

// Code-split: the drawer only loads when first opened, keeping it out of
// First Load JS on every page.
const MobileNavDrawer = dynamic(
  () =>
    import("@/components/chrome/MobileNavDrawer").then(
      (mod) => mod.MobileNavDrawer,
    ),
  { ssr: false },
);

export function Header() {
  const { openDialog } = useSiteState();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerRequested, setDrawerRequested] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-cream-dark bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setDrawerRequested(true);
              setDrawerOpen(true);
            }}
            aria-label="Open navigation"
            className="-ml-2 flex size-11 items-center justify-center rounded-md text-xl hover:bg-cream-dark/50 md:hidden"
          >
            ☰
          </button>
          <Link href="/" className="flex min-h-11 flex-col justify-center">
            <span className="font-display text-xl leading-none">
              Los Hermanos
            </span>
            <span className="text-[0.65rem] tracking-[0.2em] text-charcoal-soft uppercase">
              Taqueria · Est. 2001
            </span>
          </Link>
        </div>

        <nav aria-label="Main" className="flex items-center gap-2 md:gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden min-h-11 content-center text-sm font-medium hover:text-terra-text md:block"
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => openDialog("order")}
            className="bg-cta inline-flex min-h-12 items-center rounded-md px-4 font-semibold text-white transition-opacity duration-[var(--duration-micro)] hover:opacity-90 sm:px-5"
          >
            Order online
          </button>
        </nav>
      </div>

      {drawerRequested && (
        <MobileNavDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </header>
  );
}
