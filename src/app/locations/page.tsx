import type { Metadata } from "next";
import Link from "next/link";

import { OpenBadge } from "@/components/home/OpenBadge";
import { getLocations } from "@/lib/content";
import { directionsHref, telHref } from "@/lib/links";

export const metadata: Metadata = {
  title:
    "Locations | Taqueria Los Hermanos | Tucker, Lilburn, Suwanee, Lawrenceville & Dunwoody GA",
  description:
    "Five family-owned taquerias across metro Atlanta: Tucker, Lilburn, Suwanee, Lawrenceville and Dunwoody. Hours, directions, phone numbers and online ordering for each location.",
};

export default function LocationsPage() {
  const locations = getLocations();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16">
      <header className="pt-10 pb-2 text-center">
        <h1 className="font-display text-[length:var(--text-display-lg)]">
          Five taquerias, one familia
        </h1>
        <p className="mx-auto mt-3 max-w-md text-charcoal-soft">
          Across metro Atlanta since 2001 — find yours.
        </p>
      </header>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <li
            key={location.slug}
            className="flex flex-col rounded-lg border border-cream-dark bg-white p-5 shadow-sm"
          >
            <h2 className="font-display text-xl">{location.name}</h2>
            <OpenBadge
              hours={location.hours}
              overrides={location.holidayOverrides}
            />
            <address className="mt-2 text-sm not-italic leading-relaxed text-charcoal-soft">
              {location.address.street}
              <br />
              {location.address.city}, {location.address.state}{" "}
              {location.address.zip}
            </address>
            <p className="mt-2 flex flex-wrap gap-x-4 text-sm font-medium">
              <a
                href={telHref(location)}
                className="min-h-11 content-center text-terra-text underline-offset-2 hover:underline"
              >
                {location.phone}
              </a>
              <a
                href={directionsHref(location)}
                target="_blank"
                rel="noopener"
                className="min-h-11 content-center text-terra-text underline-offset-2 hover:underline"
              >
                Directions
              </a>
              <Link
                href={`/locations/${location.slug}`}
                className="min-h-11 content-center underline-offset-2 hover:underline"
              >
                Details
              </Link>
            </p>
            <a
              className="bg-cta mt-auto inline-flex min-h-12 items-center justify-center rounded-md px-5 font-semibold text-white transition-opacity duration-[var(--duration-micro)] hover:opacity-90"
              href={location.toastUrl}
            >
              Order online
              <span className="sr-only"> from {location.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
