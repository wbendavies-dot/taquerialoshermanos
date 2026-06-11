"use client";

import Link from "next/link";

import { useSiteState } from "@/components/chrome/site-state";
import { directionsHref, telHref } from "@/lib/links";

/**
 * Mobile thumb-zone action bar (DESIGN_SPEC §7): Menu · Order · Call ·
 * Directions. With a remembered location, Call/Directions act on it
 * directly; otherwise they open the chooser. Order goes straight to the
 * remembered location's Toast page, or opens the order dialog.
 */
export function BottomBar() {
  const { selected, openDialog } = useSiteState();

  const actionClass =
    "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium";

  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-cream-dark bg-cream pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="flex">
        <Link href="/menu" className={actionClass}>
          <span aria-hidden="true" className="text-base leading-none">
            ☰
          </span>
          Menu
        </Link>
        {selected ? (
          <a href={selected.toastUrl} className={`${actionClass} text-cta`}>
            <span aria-hidden="true" className="text-base leading-none">
              ●
            </span>
            Order · {selected.name}
          </a>
        ) : (
          <button
            type="button"
            onClick={() => openDialog("order")}
            className={`${actionClass} text-cta`}
          >
            <span aria-hidden="true" className="text-base leading-none">
              ●
            </span>
            Order
          </button>
        )}

        {selected ? (
          <a href={telHref(selected)} className={actionClass}>
            <span aria-hidden="true" className="text-base leading-none">
              ☎
            </span>
            Call
          </a>
        ) : (
          <button
            type="button"
            onClick={() => openDialog("choose")}
            className={actionClass}
          >
            <span aria-hidden="true" className="text-base leading-none">
              ☎
            </span>
            Call
          </button>
        )}

        {selected ? (
          <a
            href={directionsHref(selected)}
            target="_blank"
            rel="noopener"
            className={actionClass}
          >
            <span aria-hidden="true" className="text-base leading-none">
              ➤
            </span>
            Directions
          </a>
        ) : (
          <button
            type="button"
            onClick={() => openDialog("choose")}
            className={actionClass}
          >
            <span aria-hidden="true" className="text-base leading-none">
              ➤
            </span>
            Directions
          </button>
        )}
      </div>
    </nav>
  );
}
