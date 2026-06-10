"use client";

import { useEffect, useRef } from "react";

import { useSiteState } from "@/components/chrome/site-state";

/**
 * Native <dialog> gives focus trapping, Escape handling, inert background,
 * and focus return for free — no ARIA reimplementation.
 *
 * "order" mode: location links navigate to Toast (and remember the choice).
 * "choose" mode: location buttons only remember the choice.
 */
export function LocationDialog() {
  const { locations, selected, selectLocation, dialogMode, closeDialog } =
    useSiteState();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (dialogMode && !dialog.open) {
      dialog.showModal();
    } else if (!dialogMode && dialog.open) {
      dialog.close();
    }
  }, [dialogMode]);

  return (
    <dialog
      ref={ref}
      onClose={closeDialog}
      onClick={(event) => {
        // Backdrop click: the dialog element itself is the click target
        // only when the click lands outside the inner panel.
        if (event.target === ref.current) closeDialog();
      }}
      aria-labelledby="location-dialog-title"
      className="m-auto w-[calc(100vw-2rem)] max-w-md rounded-xl bg-cream p-0 text-charcoal shadow-xl backdrop:bg-charcoal/60"
    >
      <div className="p-6">
        <h2
          id="location-dialog-title"
          className="font-display text-[length:var(--text-display-md)]"
        >
          {dialogMode === "order" ? "Order online" : "Choose your taqueria"}
        </h2>
        <p className="mt-1 text-sm text-charcoal-soft">
          {dialogMode === "order"
            ? "Pick your location to start your order."
            : "We’ll remember it for calls, directions, and ordering."}
        </p>

        <ul className="mt-5 space-y-2">
          {locations.map((location) => {
            const isSelected = selected?.slug === location.slug;
            const label = (
              <span className="flex min-h-12 items-center justify-between gap-3 px-4">
                <span>
                  <span className="font-semibold">{location.name}</span>
                  <span className="block text-xs text-charcoal-soft">
                    {location.address.street}
                  </span>
                </span>
                {isSelected && (
                  <span className="text-xs font-semibold tracking-wide text-terra-text uppercase">
                    Your spot
                  </span>
                )}
              </span>
            );
            const itemClass =
              "block w-full rounded-lg border border-cream-dark bg-white text-left transition-colors duration-[var(--duration-micro)] hover:border-terra";

            return (
              <li key={location.slug}>
                {dialogMode === "order" ? (
                  <a
                    href={location.toastUrl}
                    className={itemClass}
                    onClick={() => selectLocation(location.slug)}
                  >
                    {label}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={itemClass}
                    onClick={() => {
                      selectLocation(location.slug);
                      closeDialog();
                    }}
                  >
                    {label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={closeDialog}
          className="mt-5 min-h-11 w-full rounded-md border border-cream-dark text-sm font-medium hover:bg-cream-dark/40"
        >
          Cancel
        </button>
      </div>
    </dialog>
  );
}
