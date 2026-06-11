"use client";

import Link from "next/link";

import { useSiteState } from "@/components/chrome/site-state";
import type { MenuItem } from "@/content/schema";

type PopularItem = MenuItem & { categorySlug: string };

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

/** Owner-confirmed bestsellers, location-aware like the menu cards. */
export function FavoritesGrid({ items }: { items: PopularItem[] }) {
  const { selected, openDialog } = useSiteState();

  return (
    <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const price =
          (selected && item.priceOverrides[selected.slug]) || item.price;
        return (
          <li
            key={item.id}
            className="card-lift flex flex-col rounded-lg border border-cream-dark bg-white p-4"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="shrink-0 font-semibold">{formatPrice(price)}</p>
            </div>
            {item.description && (
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-charcoal-soft">
                {item.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-4">
              {selected ? (
                <a
                  href={selected.toastUrl}
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-terra-text underline-offset-2 hover:underline"
                >
                  Order →
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => openDialog("order")}
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-terra-text underline-offset-2 hover:underline"
                >
                  Order →
                </button>
              )}
              <Link
                href={`/menu#${item.categorySlug}`}
                className="inline-flex min-h-11 items-center text-sm font-medium text-charcoal-soft underline-offset-2 hover:underline"
              >
                View on menu
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
