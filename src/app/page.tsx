import Image from "next/image";
import Link from "next/link";

import drinksLoteria from "@/assets/images/drinks-loteria.jpg";
import brandAward from "@/assets/images/brand-award.jpg";
import foodStreetTacos from "@/assets/images/food-street-tacos.jpg";
import foodTacoSalad from "@/assets/images/food-taco-salad.jpg";
import foodTilapia from "@/assets/images/food-tilapia.jpg";
import heroBurrito from "@/assets/images/hero-burrito.jpg";
import { FavoritesGrid } from "@/components/home/FavoritesGrid";
import { OpenBadge } from "@/components/home/OpenBadge";
import { FadeIn } from "@/components/motion/Motion";
import { getLocations, getPopularItems, getSiteSettings } from "@/lib/content";
import { DAY_LABELS, formatTime } from "@/lib/hours";
import { telHref } from "@/lib/links";

const GALLERY = [
  { src: foodStreetTacos, alt: "Street tacos on handmade corn tortillas with salsas and lime" },
  { src: foodTacoSalad, alt: "Taco salad piled with shredded cheese, tomatoes and lettuce" },
  { src: foodTilapia, alt: "Grilled fish filet with sautéed spinach and roasted potatoes" },
  { src: drinksLoteria, alt: "Shrimp cocktail and a chile-rimmed michelada in a hand-painted Lotería mug on the patio" },
];

export default function HomePage() {
  const locations = getLocations();
  const favorites = getPopularItems();
  const site = getSiteSettings();
  // All locations currently share one schedule; render from the first.
  const hours = locations[0]?.hours;

  return (
    <>
      {/* HERO — appetite + the three jobs, first screen */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-5xl items-center gap-6 px-4 pt-8 pb-10 md:grid-cols-2 md:pt-14">
          <div className="text-center md:text-left">
            <p className="text-sm tracking-widest uppercase text-terra-text">
              Taqueria · Est. 2001
            </p>
            <h1 className="font-display mt-2 text-[length:var(--text-display-xl)] leading-tight">
              Los Hermanos
            </h1>
            <p className="mx-auto mt-4 max-w-md text-lg text-charcoal-soft md:mx-0">
              Three brothers. One kitchen. Authentic Mexican food across metro
              Atlanta since 2001.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                href="/menu"
                className="bg-cta inline-flex min-h-12 items-center rounded-md px-6 font-semibold text-white transition-opacity duration-[var(--duration-micro)] hover:opacity-90"
              >
                View the menu
              </Link>
              <a
                href="#locations"
                className="inline-flex min-h-12 items-center rounded-md border border-charcoal/20 px-6 font-semibold transition-colors duration-[var(--duration-micro)] hover:border-terra"
              >
                Find your taqueria
              </a>
            </div>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-xl md:aspect-[4/5]">
            <Image
              src={heroBurrito}
              alt="Grilled burrito cut in half on a plate, held up in the dining room under papel picado"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* TRUST BAR — real claims only */}
      <section aria-label="Recognition" className="bg-terra-text text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-1 px-4 py-3 text-center text-sm font-medium">
          <p>🏆 “Best Mexican Food” — Best of Perimeter winner</p>
          <p>Family-owned since 2001</p>
          <p>100% fresh meat, prepped daily</p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4">
        {/* LO MÁS PEDIDO */}
        <section aria-labelledby="favorites-heading" className="pt-12">
          <h2
            id="favorites-heading"
            className="font-display text-center text-[length:var(--text-display-md)]"
          >
            Lo más pedido
          </h2>
          <p className="mt-2 text-center text-charcoal-soft">
            The dishes our regulars come back for.
          </p>
          <FavoritesGrid items={favorites} />
          <p className="mt-6 text-center">
            <Link
              href="/menu"
              className="inline-flex min-h-12 items-center rounded-md border border-charcoal/20 px-6 font-semibold transition-colors duration-[var(--duration-micro)] hover:border-terra"
            >
              See the full menu →
            </Link>
          </p>
        </section>

        {/* GALLERY */}
        <section aria-label="From the kitchen" className="pt-14">
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {GALLERY.map((photo) => (
              <li key={photo.src.src}>
                <FadeIn className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover"
                  />
                </FadeIn>
              </li>
            ))}
          </ul>
        </section>

        {/* STORY / AWARD */}
        <section aria-labelledby="story-heading" className="pt-14">
          <div className="grid items-center gap-6 rounded-xl border border-cream-dark bg-white p-6 md:grid-cols-[auto_1fr] md:p-8">
            <div className="relative mx-auto h-56 w-44 overflow-hidden rounded-lg md:h-64 md:w-52">
              <Image
                src={brandAward}
                alt="Team member holding the framed Best of Perimeter award for Best Mexican Food"
                fill
                sizes="208px"
                className="object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h2
                id="story-heading"
                className="font-display text-[length:var(--text-display-md)]"
              >
                Three brothers, one kitchen
              </h2>
              <p className="mt-3 leading-relaxed text-charcoal-soft">
                Miguel, Roel, and Raul opened the first Taqueria Los Hermanos
                in 2001 with recipes from Mexico&rsquo;s southwestern coast.
                Twenty-five years and five taquerias later, everything is
                still prepped fresh every morning — and the neighbors keep
                voting it the best Mexican food around.
              </p>
            </div>
          </div>
        </section>

        {/* CATERING */}
        <section
          aria-labelledby="catering-heading"
          className="mt-14 rounded-xl bg-terra-text px-6 py-10 text-center text-white"
        >
          <h2
            id="catering-heading"
            className="font-display text-[length:var(--text-display-md)]"
          >
            Catering for your next event
          </h2>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-white/90">
            Taco bars, fajita bars y más — buffet-style catering from
            $12.95 per person, for offices, weddings, quinceañeras and
            everything in between.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${site.catering.email}`}
              className="inline-flex min-h-12 items-center rounded-md bg-white px-6 font-semibold text-terra-text transition-opacity duration-[var(--duration-micro)] hover:opacity-90"
            >
              Email the catering team
            </a>
            {site.catering.phones[0] && (
              <a
                href={`tel:+1-${site.catering.phones[0].phone}`}
                className="inline-flex min-h-12 items-center rounded-md border border-white/40 px-6 font-semibold text-white transition-colors duration-[var(--duration-micro)] hover:border-white"
              >
                Call {site.catering.phones[0].name}:{" "}
                {site.catering.phones[0].phone}
              </a>
            )}
          </div>
        </section>

        {/* LOCATIONS */}
        <section aria-labelledby="locations-heading" id="locations" className="pt-14">
          <h2
            id="locations-heading"
            className="font-display scroll-mt-20 text-center text-[length:var(--text-display-md)]"
          >
            Order from your taqueria
          </h2>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((location, index) => (
              <li key={location.slug} className="flex">
                <FadeIn
                  delay={Math.min(index * 0.05, 0.2)}
                  className="flex w-full flex-col rounded-lg border border-cream-dark bg-white p-5 shadow-sm"
                >
                  <h3 className="font-display text-xl">{location.name}</h3>
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
                  <a
                    className="mt-2 inline-block min-h-11 content-center text-sm font-medium text-terra-text underline-offset-2 hover:underline"
                    href={telHref(location)}
                  >
                    {location.phone}
                  </a>
                  <a
                    className="bg-cta mt-auto inline-flex min-h-12 items-center justify-center rounded-md px-5 font-semibold text-white transition-opacity duration-[var(--duration-micro)] hover:opacity-90"
                    href={location.toastUrl}
                  >
                    Order online
                    <span className="sr-only"> from {location.name}</span>
                  </a>
                </FadeIn>
              </li>
            ))}
          </ul>
        </section>

        {/* TESTIMONIALS — real reviews from the current site */}
        <section aria-labelledby="reviews-heading" className="pt-14">
          <h2
            id="reviews-heading"
            className="font-display text-center text-[length:var(--text-display-md)]"
          >
            What the neighbors say
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                quote:
                  "If you want real Mexican cooked food this is the place. Everything cooked is made from fresh vegs and meats.",
                name: "Dave Scott",
              },
              {
                quote:
                  "World's best Corn and Shrimp chowder. It is the best thing I've ever put into my mouth.",
                name: "Shawn Williams Collins",
              },
              {
                quote:
                  "Never a bad meal... just yummy. Fresh chips and awesome salsa.",
                name: "Misty Sanders Bowman",
              },
            ].map((review) => (
              <li key={review.name}>
                <FadeIn className="h-full rounded-lg border border-cream-dark bg-white p-5">
                  <blockquote className="leading-relaxed">
                    “{review.quote}”
                  </blockquote>
                  <p className="mt-3 text-sm font-medium text-charcoal-soft">
                    — {review.name}
                  </p>
                </FadeIn>
              </li>
            ))}
          </ul>
        </section>

        {/* HOURS */}
        {hours && (
          <section aria-labelledby="hours-heading" className="py-14">
            <h2
              id="hours-heading"
              className="font-display text-center text-[length:var(--text-display-md)]"
            >
              Hours
            </h2>
            <table className="mx-auto mt-6 text-left">
              <tbody>
                {(
                  Object.entries(DAY_LABELS) as [
                    keyof typeof DAY_LABELS,
                    string,
                  ][]
                ).map(([key, label]) => {
                  const day = hours[key];
                  return (
                    <tr key={key}>
                      <th scope="row" className="pr-8 py-1 font-medium">
                        {label}
                      </th>
                      <td className="py-1 text-charcoal-soft">
                        {day
                          ? `${formatTime(day.open)} – ${formatTime(day.close)}`
                          : "Closed"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-3 text-center text-sm text-charcoal-soft">
              Hours may vary by location and on holidays.
            </p>
          </section>
        )}
      </main>
    </>
  );
}
