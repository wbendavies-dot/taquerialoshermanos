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
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/Motion";
import { getLocations, getPopularItems, getSiteSettings } from "@/lib/content";
import { DAY_LABELS, formatTime } from "@/lib/hours";
import { telHref } from "@/lib/links";

const GALLERY = [
  { src: foodStreetTacos, alt: "Street tacos on handmade corn tortillas with salsas and lime" },
  { src: foodTacoSalad, alt: "Taco salad piled with shredded cheese, tomatoes and lettuce" },
  { src: foodTilapia, alt: "Grilled fish filet with sautéed spinach and roasted potatoes" },
  { src: drinksLoteria, alt: "Shrimp cocktail and a chile-rimmed michelada in a hand-painted Lotería mug on the patio" },
];

const RIBBON_DISHES = [
  "Tacos al pastor",
  "Cesina",
  "Quesabirria",
  "Fajitas",
  "Tlayudas",
  "Molcajete",
  "Enchiladas suizas",
  "Tres leches",
];

/** Decorative scrolling dish ribbon (CSS transform marquee). */
function DishRibbon() {
  const run = RIBBON_DISHES.map((dish) => (
    <span key={dish} className="flex items-center gap-8 pr-8">
      {dish}
      <span className="text-gold">✦</span>
    </span>
  ));
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-charcoal bg-charcoal py-4 text-cream"
    >
      <div className="marquee-track font-display gap-0 text-2xl whitespace-nowrap sm:text-3xl">
        <div className="flex">{run}</div>
        <div className="flex">{run}</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const locations = getLocations();
  const favorites = getPopularItems();
  const site = getSiteSettings();
  // All locations currently share one schedule; render from the first.
  const hours = locations[0]?.hours;

  return (
    <>
      {/* HERO — full-bleed, cinematic, choreographed entrance */}
      <section className="relative flex min-h-[86svh] items-end overflow-hidden bg-charcoal">
        <Image
          src={heroBurrito}
          alt="Grilled burrito cut in half on a plate, held up in the dining room under papel picado"
          fill
          priority
          sizes="100vw"
          className="kenburns object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/45 to-charcoal/10"
        />

        <Stagger className="relative mx-auto w-full max-w-5xl px-4 pb-16 text-cream sm:pb-20">
          <StaggerItem>
            <p className="text-sm font-medium tracking-[0.25em] text-gold uppercase">
              Taqueria · Familia · Est. 2001
            </p>
          </StaggerItem>
          <StaggerItem>
            <h1 className="font-display mt-3 text-[length:var(--text-display-hero)] leading-[0.95]">
              Los Hermanos
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-4 max-w-md text-lg text-cream/90">
              Three brothers. One kitchen. Authentic Mexican food across
              metro Atlanta since 2001.
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="group bg-cta inline-flex min-h-13 items-center gap-2 rounded-md px-7 text-lg font-semibold text-white transition-opacity duration-[var(--duration-micro)] hover:opacity-90"
              >
                View the menu
                <span
                  aria-hidden="true"
                  className="transition-transform duration-[var(--duration-micro)] group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <a
                href="#locations"
                className="inline-flex min-h-13 items-center rounded-md border border-cream/40 px-7 text-lg font-semibold text-cream backdrop-blur-sm transition-colors duration-[var(--duration-micro)] hover:border-cream"
              >
                Find your taqueria
              </a>
            </div>
          </StaggerItem>
        </Stagger>

        <div
          aria-hidden="true"
          className="pulse-soft absolute bottom-4 left-1/2 hidden -translate-x-1/2 text-cream sm:block"
        >
          ↓
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

      {/* DISH RIBBON */}
      <DishRibbon />

      <main className="mx-auto max-w-5xl px-4">
        {/* LO MÁS PEDIDO */}
        <section aria-labelledby="favorites-heading" className="pt-14">
          <FadeIn>
            <p className="text-center text-sm font-medium tracking-[0.25em] text-terra-text uppercase">
              The dishes our regulars come back for
            </p>
            <h2
              id="favorites-heading"
              className="font-display mt-2 text-center text-[length:var(--text-display-xl)]"
            >
              Lo más pedido
            </h2>
          </FadeIn>
          <FavoritesGrid items={favorites} />
          <p className="mt-8 text-center">
            <Link
              href="/menu"
              className="group inline-flex min-h-12 items-center gap-2 rounded-md border border-charcoal/20 px-6 font-semibold transition-colors duration-[var(--duration-micro)] hover:border-terra"
            >
              See the full menu
              <span
                aria-hidden="true"
                className="transition-transform duration-[var(--duration-micro)] group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </p>
        </section>

        {/* GALLERY — hover zoom mosaic */}
        <section aria-label="From the kitchen" className="pt-16">
          <Stagger as="ul" className="grid grid-cols-2 gap-3 md:grid-cols-4" step={0.06}>
            {GALLERY.map((photo) => (
              <StaggerItem as="li" key={photo.src.src}>
                <div className="group relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* STORY / AWARD */}
        <section aria-labelledby="story-heading" className="pt-16">
          <div className="grid items-center gap-6 rounded-xl border border-cream-dark bg-white p-6 md:grid-cols-[auto_1fr] md:p-8">
            <FadeIn from="right">
              <div className="group relative mx-auto h-56 w-44 overflow-hidden rounded-lg md:h-64 md:w-52">
                <Image
                  src={brandAward}
                  alt="Team member holding the framed Best of Perimeter award for Best Mexican Food"
                  fill
                  sizes="208px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </FadeIn>
            <FadeIn from="left" delay={0.1}>
              <div className="text-center md:text-left">
                <h2
                  id="story-heading"
                  className="font-display text-[length:var(--text-display-md)]"
                >
                  Three brothers, one kitchen
                </h2>
                <p className="mt-3 leading-relaxed text-charcoal-soft">
                  Miguel, Roel, and Raul opened the first Taqueria Los
                  Hermanos in 2001 with recipes from Mexico&rsquo;s
                  southwestern coast. Twenty-five years and five taquerias
                  later, everything is still prepped fresh every morning —
                  and the neighbors keep voting it the best Mexican food
                  around.
                </p>
                <Link
                  href="/nuestra-historia"
                  className="mt-4 inline-flex min-h-11 items-center font-semibold text-terra-text underline-offset-2 hover:underline"
                >
                  Nuestra historia →
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* CATERING */}
        <section
          aria-labelledby="catering-heading"
          className="mt-16 overflow-hidden rounded-xl bg-terra-text text-center text-white"
        >
          <div
            aria-hidden="true"
            className="font-display border-b border-white/15 py-2 text-sm tracking-[0.3em] text-white/90 uppercase"
          >
            ✦ Catering ✦
          </div>
          <div className="px-6 py-10">
            <FadeIn>
              <h2
                id="catering-heading"
                className="font-display text-[length:var(--text-display-lg)]"
              >
                Feed the whole fiesta
              </h2>
              <p className="mx-auto mt-3 max-w-xl leading-relaxed text-white/90">
                Taco bars, fajita bars y más — buffet-style catering from
                $12.95 per person, for offices, weddings, quinceañeras and
                everything in between.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/catering"
                  className="group inline-flex min-h-12 items-center gap-2 rounded-md bg-white px-6 font-semibold text-terra-text transition-opacity duration-[var(--duration-micro)] hover:opacity-90"
                >
                  Plan your event
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-[var(--duration-micro)] group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
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
            </FadeIn>
          </div>
        </section>

        {/* LOCATIONS */}
        <section aria-labelledby="locations-heading" id="locations" className="pt-16">
          <FadeIn>
            <p className="text-center text-sm font-medium tracking-[0.25em] text-terra-text uppercase">
              Tucker · Lilburn · Suwanee · Lawrenceville · Dunwoody
            </p>
            <h2
              id="locations-heading"
              className="font-display mt-2 scroll-mt-20 text-center text-[length:var(--text-display-xl)]"
            >
              Order from your taqueria
            </h2>
          </FadeIn>

          <Stagger as="ul" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={0.06}>
            {locations.map((location) => (
              <StaggerItem as="li" key={location.slug} className="flex">
                <div className="card-lift flex w-full flex-col rounded-lg border border-cream-dark bg-white p-5 shadow-sm">
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
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* TESTIMONIALS — real reviews from the current site */}
        <section aria-labelledby="reviews-heading" className="pt-16">
          <FadeIn>
            <h2
              id="reviews-heading"
              className="font-display text-center text-[length:var(--text-display-xl)]"
            >
              What the neighbors say
            </h2>
          </FadeIn>
          <Stagger as="ul" className="mt-8 grid gap-4 md:grid-cols-3" step={0.08}>
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
              <StaggerItem as="li" key={review.name}>
                <figure className="card-lift h-full rounded-lg border border-cream-dark bg-white p-5">
                  <p
                    aria-hidden="true"
                    className="font-display text-3xl leading-none text-gold"
                  >
                    “
                  </p>
                  <blockquote className="mt-1 leading-relaxed">
                    {review.quote}
                  </blockquote>
                  <figcaption className="mt-3 text-sm font-medium text-charcoal-soft">
                    — {review.name}
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* HOURS */}
        {hours && (
          <section aria-labelledby="hours-heading" className="py-16">
            <FadeIn>
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
            </FadeIn>
          </section>
        )}
      </main>
    </>
  );
}
