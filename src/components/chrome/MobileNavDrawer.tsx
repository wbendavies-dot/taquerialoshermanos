"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { NAV_LINKS } from "@/components/chrome/nav-links";
import { useSiteState } from "@/components/chrome/site-state";
import { telHref } from "@/lib/links";

/**
 * Full-screen mobile navigation (DESIGN_SPEC §7) on native <dialog> —
 * focus trap, Escape, and focus return come free. Large tap targets,
 * Order repeated at top, remembered location with one-tap call.
 */
export function MobileNavDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { selected, openDialog } = useSiteState();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label="Site navigation"
      className="m-0 h-full max-h-none w-full max-w-none bg-cream p-0 text-charcoal"
    >
      <div className="flex min-h-full flex-col px-6 pt-4 pb-8">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg">Los Hermanos</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex size-11 items-center justify-center rounded-md text-2xl leading-none hover:bg-cream-dark/50"
          >
            ✕
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            openDialog("order");
          }}
          className="bg-cta mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-md text-lg font-semibold text-white"
        >
          Order online
        </button>

        <nav aria-label="Site pages" className="mt-6 border-t border-cream-dark">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="border-b border-cream-dark">
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="font-display block min-h-14 content-center text-xl"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pt-8 text-sm">
          {selected ? (
            <>
              <p className="font-semibold">Your taqueria: {selected.name}</p>
              <a
                href={telHref(selected)}
                className="mt-1 inline-block min-h-11 content-center font-medium text-terra-text underline-offset-2 hover:underline"
              >
                {selected.phone}
              </a>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                openDialog("choose");
              }}
              className="min-h-11 font-medium text-terra-text underline-offset-2 hover:underline"
            >
              Choose your taqueria →
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}
