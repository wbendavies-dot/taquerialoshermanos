import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import dunwoodyExterior from "@/assets/images/location-dunwoody-exterior.jpg";
import { OpenBadge } from "@/components/home/OpenBadge";
import type { Location } from "@/content/schema";
import { getLocation, getLocations } from "@/lib/content";
import { DAY_LABELS, formatTime } from "@/lib/hours";
import { directionsHref, telHref } from "@/lib/links";

/**
 * One template, five statically generated city pages — the local SEO
 * spine. NAP renders only from the locations collection.
 */

export function generateStaticParams() {
  return getLocations().map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocations().find((l) => l.slug === slug);
  if (!location) return {};
  return {
    title: `Mexican Restaurant in ${location.address.city}, GA | Taqueria Los Hermanos`,
    description: `Taqueria Los Hermanos ${location.name} — authentic Mexican food at ${location.address.street}, ${location.address.city}, GA. Family-owned since 2001. Hours, directions and online ordering for pickup.`,
  };
}

/** Genuine per-city copy — no invented claims, no near-duplicates. */
const LOCAL_COPY: Record<string, string> = {
  tucker:
    "The Tucker taqueria sits on Hugh Howell Road, an easy stop off Highway 78. Same family recipes as every Los Hermanos — tacos on handmade tortillas, fresh salsas, and a menu that runs from quick lunch bowls to full fajita dinners. Order ahead for pickup or come sit down.",
  lilburn:
    "On Lawrenceville Highway in the heart of Lilburn, this taqueria serves the same scratch cooking the brothers started with in 2001. Fresh meat prepped every morning, vegetarian options across the menu, and a counter that knows its regulars by name.",
  suwanee:
    "The Suwanee location on Peachtree Parkway brings the family's coastal-Mexico recipes to north Gwinnett. Quick online pickup when you're on the move, full plates of fajitas and chef's specials when you're not.",
  lawrenceville:
    "Find the Lawrenceville taqueria on Sugarloaf Parkway — buffet-ready for the office crowd, family-sized for everyone else. The full menu, from cesina tacos to tres leches, made fresh daily like every Los Hermanos kitchen.",
  dunwoody:
    "The Dunwoody taqueria on Chamblee Dunwoody Road is where the neighbors voted Los Hermanos “Best Mexican Food” in the Best of Perimeter awards. Bright patio tables out front, the full family menu inside, online ordering for nights you'd rather eat at home.",
};

function restaurantJsonLd(location: Location) {
  const days: Record<string, string> = {
    sun: "Sunday",
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
  };
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: `Taqueria Los Hermanos ${location.name}`,
    servesCuisine: "Mexican",
    telephone: `+1-${location.phone}`,
    url: `https://www.taquerialoshermanos.com/locations/${location.slug}`,
    menu: "https://www.taquerialoshermanos.com/menu",
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address.street,
      addressLocality: location.address.city,
      addressRegion: location.address.state,
      postalCode: location.address.zip,
      addressCountry: "US",
    },
    openingHoursSpecification: Object.entries(location.hours)
      .filter(([, day]) => day !== null)
      .map(([key, day]) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: days[key],
        opens: day!.open,
        closes: day!.close,
      })),
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let location: Location;
  try {
    location = getLocation(slug);
  } catch {
    notFound();
  }

  const localCopy = LOCAL_COPY[location.slug];

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restaurantJsonLd(location)),
        }}
      />

      <header className="pt-10 text-center">
        <p className="text-sm tracking-widest uppercase text-terra-text">
          Taqueria Los Hermanos
        </p>
        <h1 className="font-display mt-1 text-[length:var(--text-display-lg)]">
          {location.name}
        </h1>
        <div className="mt-2 flex justify-center">
          <OpenBadge
            hours={location.hours}
            overrides={location.holidayOverrides}
          />
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href={location.toastUrl}
            className="bg-cta inline-flex min-h-12 items-center rounded-md px-6 font-semibold text-white transition-opacity duration-[var(--duration-micro)] hover:opacity-90"
          >
            Order from {location.name}
          </a>
          <a
            href={directionsHref(location)}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-12 items-center rounded-md border border-charcoal/20 px-6 font-semibold transition-colors duration-[var(--duration-micro)] hover:border-terra"
          >
            Directions
          </a>
          <a
            href={telHref(location)}
            className="inline-flex min-h-12 items-center rounded-md border border-charcoal/20 px-6 font-semibold transition-colors duration-[var(--duration-micro)] hover:border-terra"
          >
            Call
          </a>
        </div>
      </header>

      {location.slug === "dunwoody" && (
        <div className="relative mt-8 aspect-[3/2] overflow-hidden rounded-xl">
          <Image
            src={dunwoodyExterior}
            alt="The Dunwoody storefront with its colorful patio picnic tables"
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      {localCopy && (
        <p className="mx-auto mt-8 max-w-prose leading-relaxed text-charcoal-soft">
          {localCopy}
        </p>
      )}

      <section
        aria-labelledby="essentials-heading"
        className="mt-8 grid gap-4 sm:grid-cols-2"
      >
        <div className="rounded-xl border border-cream-dark bg-white p-6">
          <h2 id="essentials-heading" className="font-display text-xl">
            Find us
          </h2>
          <address className="mt-2 not-italic leading-relaxed text-charcoal-soft">
            {location.address.street}
            <br />
            {location.address.city}, {location.address.state}{" "}
            {location.address.zip}
          </address>
          <a
            href={telHref(location)}
            className="mt-2 inline-block min-h-11 content-center font-medium text-terra-text underline-offset-2 hover:underline"
          >
            {location.phone}
          </a>
        </div>

        <div className="rounded-xl border border-cream-dark bg-white p-6">
          <h2 className="font-display text-xl">Hours</h2>
          <table className="mt-2 w-full text-sm">
            <tbody>
              {(
                Object.entries(DAY_LABELS) as [
                  keyof typeof DAY_LABELS,
                  string,
                ][]
              ).map(([key, label]) => {
                const day = location.hours[key];
                return (
                  <tr key={key}>
                    <th scope="row" className="py-0.5 pr-4 text-left font-medium">
                      {label}
                    </th>
                    <td className="py-0.5 text-charcoal-soft">
                      {day
                        ? `${formatTime(day.open)} – ${formatTime(day.close)}`
                        : "Closed"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-label="More" className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/menu"
          className="rounded-xl border border-cream-dark bg-white p-5 font-semibold transition-colors duration-[var(--duration-micro)] hover:border-terra"
        >
          Browse the full menu →
        </Link>
        <Link
          href="/catering"
          className="rounded-xl border border-cream-dark bg-white p-5 font-semibold transition-colors duration-[var(--duration-micro)] hover:border-terra"
        >
          Catering in {location.address.city}? We deliver →
        </Link>
      </section>
    </main>
  );
}
