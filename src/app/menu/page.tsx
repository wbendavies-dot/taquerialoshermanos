import type { Metadata } from "next";

import { MenuExplorer } from "@/components/menu/MenuExplorer";
import { getLocations, getMenuCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Menu | Taqueria Los Hermanos | Metro Atlanta, GA",
  description:
    "Browse the full Taqueria Los Hermanos menu with prices — tacos, burritos, enchiladas, fajitas, tlayudas and more. Authentic Mexican food, made fresh daily in metro Atlanta.",
};

/** schema.org Menu rich result: every section and priced item. */
function menuJsonLd() {
  const categories = getMenuCategories();
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Taqueria Los Hermanos Menu",
    hasMenuSection: categories.map((category) => ({
      "@type": "MenuSection",
      name: category.name,
      hasMenuItem: category.items.map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
        offers: {
          "@type": "Offer",
          price: item.price.toFixed(2),
          priceCurrency: "USD",
        },
      })),
    })),
  };
}

export default function MenuPage() {
  const categories = getMenuCategories();
  const locations = getLocations();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd()) }}
      />

      <header className="pt-10 pb-2 text-center">
        <h1 className="font-display text-[length:var(--text-display-lg)]">
          The Menu
        </h1>
        <p className="mx-auto mt-3 max-w-md text-charcoal-soft">
          Made fresh every morning, the way it&rsquo;s been since 2001.
        </p>
      </header>

      <MenuExplorer categories={categories} locations={locations} />
    </main>
  );
}
