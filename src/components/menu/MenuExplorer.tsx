"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useSiteState } from "@/components/chrome/site-state";
import type { Location, MenuCategory, MenuItem } from "@/content/schema";

/**
 * The menu island. Renders fully on the server (every dish and price is
 * in the static HTML for SEO); search/filter state hydrates from the URL
 * after mount and is written back with history.replaceState — no
 * useSearchParams, which would bail SSG out to a Suspense fallback.
 */

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function priceFor(item: MenuItem, locationSlug: string | undefined): number {
  return (locationSlug && item.priceOverrides[locationSlug]) || item.price;
}

function matches(item: MenuItem, query: string, vegOnly: boolean): boolean {
  if (vegOnly && !item.dietary.includes("vegetarian")) return false;
  if (!query) return true;
  const haystack = `${item.name} ${item.description}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}

export function MenuExplorer({
  categories,
  locations,
}: {
  categories: MenuCategory[];
  locations: Location[];
}) {
  const { selected, openDialog } = useSiteState();
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const sectionRefs = useRef(new Map<string, HTMLElement>());

  // Hydrate filter state from the URL (shareable filtered views).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setQuery(q);
    if (params.get("diet") === "vegetarian") setVegOnly(true);
  }, []);

  // Write filter state back to the URL without navigation.
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (vegOnly) params.set("diet", "vegetarian");
    const search = params.toString();
    window.history.replaceState(
      null,
      "",
      search ? `?${search}` : window.location.pathname,
    );
  }, [query, vegOnly]);

  // Scroll-spy: highlight the category currently in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
            return;
          }
        }
      },
      { rootMargin: "-100px 0px -70% 0px" },
    );
    for (const section of sectionRefs.current.values()) {
      observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  const filtering = query !== "" || vegOnly;
  const visible = useMemo(
    () =>
      categories
        .map((category) => ({
          ...category,
          items: category.items.filter((item) =>
            matches(item, query, vegOnly),
          ),
        }))
        .filter((category) => category.items.length > 0),
    [categories, query, vegOnly],
  );
  const resultCount = visible.reduce((n, c) => n + c.items.length, 0);

  // Prices shown for the remembered location; Dunwoody prices are the
  // captured base, so make the pricing context explicit either way.
  const pricingLocation = selected ?? null;

  return (
    <div>
      {/* Location / pricing context */}
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => openDialog("choose")}
          className="min-h-11 rounded-full border border-cream-dark bg-white px-4 text-sm font-medium hover:border-terra"
        >
          {pricingLocation
            ? `Prices for ${pricingLocation.name} ▾`
            : "Prices for Dunwoody — choose your taqueria ▾"}
        </button>
      </div>

      {/* Sticky controls: category chips + search + filter */}
      <div className="sticky top-16 z-10 -mx-4 mt-6 border-b border-cream-dark bg-cream/95 px-4 py-3 backdrop-blur-sm">
        <nav aria-label="Menu categories" className="overflow-x-auto">
          <ul className="flex gap-2 whitespace-nowrap">
            {categories.map((category) => (
              <li key={category.slug}>
                <a
                  href={`#${category.slug}`}
                  aria-current={
                    activeCategory === category.slug ? "true" : undefined
                  }
                  className={`inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors duration-[var(--duration-micro)] ${
                    activeCategory === category.slug
                      ? "border-terra-text bg-terra-text text-white"
                      : "border-cream-dark bg-white hover:border-terra"
                  }`}
                >
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-3 flex gap-2">
          <label className="flex-1">
            <span className="sr-only">Search the menu</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tacos, mole, brisket…"
              className="min-h-11 w-full rounded-md border border-cream-dark bg-white px-3 text-base"
            />
          </label>
          <button
            type="button"
            aria-pressed={vegOnly}
            onClick={() => setVegOnly((v) => !v)}
            className={`min-h-11 rounded-md border px-4 text-sm font-medium ${
              vegOnly
                ? "border-terra-text bg-terra-text text-white"
                : "border-cream-dark bg-white hover:border-terra"
            }`}
          >
            Vegetarian
          </button>
        </div>

        {filtering && (
          <p aria-live="polite" className="mt-2 text-sm text-charcoal-soft">
            {resultCount === 0
              ? "No dishes match — try a different search."
              : `${resultCount} ${resultCount === 1 ? "dish" : "dishes"} found.`}
          </p>
        )}
      </div>

      {/* Categories */}
      {visible.map((category) => (
        <section
          key={category.slug}
          id={category.slug}
          aria-labelledby={`${category.slug}-heading`}
          ref={(el) => {
            if (el) sectionRefs.current.set(category.slug, el);
            else sectionRefs.current.delete(category.slug);
          }}
          className="scroll-mt-44 pt-10"
        >
          <h2
            id={`${category.slug}-heading`}
            className="font-display text-[length:var(--text-display-md)]"
          >
            {category.name}
          </h2>

          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {category.items.map((item) => (
              <li
                key={item.id}
                className="card-lift flex flex-col rounded-lg border border-cream-dark bg-white p-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold">
                    {item.name}
                    {item.popular && (
                      <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 align-middle text-xs font-medium whitespace-nowrap text-charcoal">
                        ★ Lo más pedido
                      </span>
                    )}
                  </h3>
                  <p className="shrink-0 font-semibold">
                    {item.priceFrom && (
                      <span className="text-xs font-normal text-charcoal-soft">
                        from{" "}
                      </span>
                    )}
                    {formatPrice(priceFor(item, pricingLocation?.slug))}
                  </p>
                </div>

                {item.description && (
                  <p className="mt-1 text-sm leading-relaxed text-charcoal-soft">
                    {item.description}
                  </p>
                )}

                {(item.dietary.length > 0 || item.spice > 0) && (
                  <p className="mt-2 flex gap-2 text-xs font-medium">
                    {item.dietary.includes("vegetarian") && (
                      <span className="rounded-full bg-cream px-2 py-0.5 text-charcoal-soft">
                        Vegetarian
                      </span>
                    )}
                    {item.spice > 0 && (
                      <span
                        className="rounded-full bg-cream px-2 py-0.5 text-terra-text"
                        aria-label={`Spice level ${item.spice} of 3`}
                      >
                        {"🌶".repeat(item.spice)}
                      </span>
                    )}
                  </p>
                )}

                <div className="mt-3">
                  {pricingLocation ? (
                    <a
                      href={pricingLocation.toastUrl}
                      className="inline-flex min-h-11 items-center text-sm font-semibold text-terra-text underline-offset-2 hover:underline"
                    >
                      Add to order · {pricingLocation.name} →
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openDialog("order")}
                      className="inline-flex min-h-11 items-center text-sm font-semibold text-terra-text underline-offset-2 hover:underline"
                    >
                      Add to order →
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {filtering && resultCount === 0 && (
        <p className="py-16 text-center text-charcoal-soft">
          Nothing matched. Clear the search or ask us —{" "}
          {locations[0] ? (
            <a
              className="font-medium text-terra-text underline-offset-2 hover:underline"
              href={`tel:+1-${(pricingLocation ?? locations[0]).phone}`}
            >
              we pick up the phone
            </a>
          ) : null}
          .
        </p>
      )}
    </div>
  );
}
