import type { Metadata } from "next";
import Image from "next/image";

import foodStreetTacos from "@/assets/images/food-street-tacos.jpg";
import { CateringInquiryForm } from "@/components/catering/CateringInquiryForm";
import { FadeIn } from "@/components/motion/Motion";
import { ParallaxY } from "@/components/motion/Scroll";
import { getCatering, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Mexican Catering | Taqueria Los Hermanos | Metro Atlanta, GA",
  description:
    "Buffet-style Mexican catering from $12.95 per person — taco bars, fajita bars, nacho bars and more for offices, weddings and quinceañeras across metro Atlanta. Family-owned since 2001.",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function faqJsonLd(minimumGuests: number, noticeHours: number) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many guests do you cater for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Catering orders start at ${minimumGuests} people, buffet style.`,
        },
      },
      {
        "@type": "Question",
        name: "How much notice do you need?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Please give us at least ${noticeHours} hours notice for any catering order.`,
        },
      },
      {
        "@type": "Question",
        name: "Are drinks served with ice and cups?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — ice and cups are provided whenever drinks are ordered.",
        },
      },
    ],
  };
}

export default function CateringPage() {
  const catering = getCatering();
  const site = getSiteSettings();

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(catering.minimumGuests, catering.noticeHours),
          ),
        }}
      />

      {/* HERO */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-5xl items-center gap-6 px-4 pt-8 pb-10 md:grid-cols-2 md:pt-14">
          <div className="text-center md:text-left">
            <p className="text-sm tracking-widest uppercase text-terra-text">
              Buffet-style · From {catering.minimumGuests} guests
            </p>
            <h1 className="font-display mt-2 text-[length:var(--text-display-lg)] leading-tight">
              Catering by Los Hermanos
            </h1>
            <p className="mx-auto mt-4 max-w-md text-lg text-charcoal-soft md:mx-0">
              Taco bars, fajita bars y más — from{" "}
              {formatPrice(12.95)} per person for offices, weddings,
              quinceañeras and everything in between.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              <a
                href="#inquiry"
                className="bg-cta inline-flex min-h-12 items-center rounded-md px-6 font-semibold text-white transition-opacity duration-[var(--duration-micro)] hover:opacity-90"
              >
                Get a quote
              </a>
              <a
                href="#packages"
                className="inline-flex min-h-12 items-center rounded-md border border-charcoal/20 px-6 font-semibold transition-colors duration-[var(--duration-micro)] hover:border-terra"
              >
                See the packages
              </a>
            </div>
            <p className="mt-4 text-sm text-charcoal-soft">
              Please allow at least {catering.noticeHours} hours notice for
              any catering order.
            </p>
          </div>
          <ParallaxY shift={26}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={foodStreetTacos}
                alt="Street tacos on handmade tortillas with salsas and lime"
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </ParallaxY>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section aria-label="Why Los Hermanos" className="bg-terra-text text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-1 px-4 py-3 text-center text-sm font-medium">
          <p>Family-owned since 2001</p>
          <p>🏆 “Best Mexican Food” — Best of Perimeter winner</p>
          <p>Five kitchens across metro Atlanta</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4">
        {/* HOW IT WORKS */}
        <section aria-labelledby="how-heading" className="pt-12">
          <h2
            id="how-heading"
            className="font-display text-center text-[length:var(--text-display-md)]"
          >
            How it works
          </h2>
          <ol className="mx-auto mt-6 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              ["1", "Tell us about your event", "Two minutes — date, guests, and the menu you have in mind."],
              ["2", "We size it with you", "Miguel or Christian will reach out to lock in the details."],
              ["3", "We cook & set up", "Buffet-style spread, hot and ready when your guests are."],
            ].map(([step, title, body]) => (
              <li
                key={step}
                className="rounded-lg border border-cream-dark bg-white p-5 text-center"
              >
                <p className="font-display text-2xl text-terra-text">{step}</p>
                <h3 className="mt-1 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-charcoal-soft">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* PACKAGES */}
        <section aria-labelledby="packages-heading" id="packages" className="scroll-mt-20 pt-14">
          <h2
            id="packages-heading"
            className="font-display text-center text-[length:var(--text-display-md)]"
          >
            The packages
          </h2>
          <p className="mt-2 text-center text-charcoal-soft">
            Buffet-style, {catering.minimumGuests}-person minimum.
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {catering.packages.map((pkg) => (
              <li key={pkg.slug} className="flex">
                <FadeIn className="card-lift flex w-full flex-col rounded-xl border border-cream-dark bg-white p-6">
                  <p className="text-xs tracking-widest uppercase text-charcoal-soft">
                    Menu #{pkg.menuNumber}
                  </p>
                  <div className="mt-1 flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl">{pkg.name}</h3>
                    {pkg.pricePerPerson && (
                      <p className="shrink-0 text-lg font-semibold">
                        {formatPrice(pkg.pricePerPerson)}
                        <span className="text-sm font-normal text-charcoal-soft">
                          /person
                        </span>
                      </p>
                    )}
                  </div>
                  {pkg.note && (
                    <p className="mt-1 text-sm text-charcoal-soft">{pkg.note}</p>
                  )}
                  {pkg.variants && (
                    <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                      {pkg.variants.map((variant) => (
                        <li
                          key={variant.name}
                          className="rounded-full bg-cream px-3 py-1"
                        >
                          {variant.name} ·{" "}
                          <span className="font-semibold">
                            {formatPrice(variant.pricePerPerson)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <ul className="mt-4 space-y-1 text-sm text-charcoal-soft">
                    {pkg.includes.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span aria-hidden="true" className="text-terra-text">
                          •
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>
                  {pkg.pricePerPerson && (
                    <p className="mt-4 rounded-md bg-cream px-3 py-2 text-sm">
                      For 20 guests:{" "}
                      <span className="font-semibold">
                        {formatPrice(pkg.pricePerPerson * 20)}
                      </span>
                    </p>
                  )}
                  <a
                    href="#inquiry"
                    className="mt-auto pt-4 text-sm font-semibold text-terra-text underline-offset-2 hover:underline"
                  >
                    Quote this package →
                  </a>
                </FadeIn>
              </li>
            ))}
          </ul>
        </section>

        {/* À LA CARTE + DESSERTS + DRINKS */}
        <section aria-labelledby="extras-heading" className="pt-14">
          <h2
            id="extras-heading"
            className="font-display text-center text-[length:var(--text-display-md)]"
          >
            Finger foods, postres & drinks
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {(
              [
                ["Finger foods", catering.alaCarte],
                ["Postres", catering.desserts],
                ["Drinks", catering.drinks],
              ] as const
            ).map(([title, lines]) => (
              <div
                key={title}
                className="rounded-xl border border-cream-dark bg-white p-6"
              >
                <h3 className="font-display text-xl">{title}</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {lines.map((line) => (
                    <li
                      key={line.name}
                      className="flex items-baseline justify-between gap-3"
                    >
                      <span className="text-charcoal-soft">{line.name}</span>
                      <span className="shrink-0 font-semibold">
                        {formatPrice(line.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="pt-14">
          <h2
            id="faq-heading"
            className="font-display text-center text-[length:var(--text-display-md)]"
          >
            Good to know
          </h2>
          <div className="mx-auto mt-6 max-w-2xl">
            {[
              [
                "How many guests do you cater for?",
                `Catering orders start at ${catering.minimumGuests} people, buffet style. For very large events, call us and we'll plan it together.`,
              ],
              [
                "How much notice do you need?",
                `Please give us at least ${catering.noticeHours} hours notice for any catering order.`,
              ],
              [
                "Are drinks served with ice and cups?",
                "Yes — ice and cups are provided whenever drinks are ordered.",
              ],
              [
                "Can you handle dietary needs?",
                "Vegetarian options are built into every bar (veggie fajitas, veggie quesadillas, beans and rice). Tell us about allergies in your inquiry and we'll work with you.",
              ],
            ].map(([question, answer]) => (
              <details
                key={question}
                className="group border-b border-cream-dark py-3"
              >
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-medium">
                  {question}
                  <span
                    aria-hidden="true"
                    className="text-terra-text transition-transform duration-[var(--duration-micro)] group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-2 text-sm leading-relaxed text-charcoal-soft">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* INQUIRY */}
        <section
          aria-labelledby="inquiry-heading"
          id="inquiry"
          className="scroll-mt-20 py-14"
        >
          <CateringInquiryForm
            email={site.catering.email}
            minimumGuests={catering.minimumGuests}
          />
          <p className="mt-6 text-center text-sm text-charcoal-soft">
            Prefer the phone?{" "}
            {site.catering.phones.map((person, index) => (
              <span key={person.phone}>
                {index > 0 && " · "}
                {person.name}:{" "}
                <a
                  href={`tel:+1-${person.phone}`}
                  className="font-medium text-terra-text underline-offset-2 hover:underline"
                >
                  {person.phone}
                </a>
              </span>
            ))}
          </p>
        </section>
      </div>
    </main>
  );
}
