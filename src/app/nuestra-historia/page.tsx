import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import brandAward from "@/assets/images/brand-award.jpg";
import dunwoodyExterior from "@/assets/images/location-dunwoody-exterior.jpg";
import { FadeIn } from "@/components/motion/Motion";

export const metadata: Metadata = {
  title: "Nuestra Historia | Taqueria Los Hermanos | Metro Atlanta, GA",
  description:
    "Three brothers — Miguel, Roel and Raul — opened Taqueria Los Hermanos in 2001 with recipes from Mexico's southwestern coast. Twenty-five years and five metro Atlanta taquerias later, it's still all family.",
};

export default function StoryPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16">
      <header className="pt-12 text-center">
        <p className="text-sm tracking-widest uppercase text-terra-text">
          Est. 2001 · Metro Atlanta
        </p>
        <h1 className="font-display mt-2 text-[length:var(--text-display-xl)] leading-tight">
          Nuestra Historia
        </h1>
        <p className="font-display mt-3 text-xl text-charcoal-soft">
          Three brothers. One kitchen. Twenty-five years.
        </p>
      </header>

      {/* The origin — owner-provided copy */}
      <section aria-label="Our story" className="mx-auto mt-10 max-w-prose">
        <p className="text-lg leading-relaxed">
          Taqueria Los Hermanos is an authentic Mexican restaurant owned by
          three brothers — Miguel, Roel and Raul — along with their
          families. Los Hermanos first opened its doors back in 2001, and
          the brothers wanted to achieve a comforting environment where
          guests can experience a taste of their culture and the delicious
          foods their families are accustomed to.
        </p>
        <p className="mt-4 text-lg leading-relaxed">
          Our recipes are influenced by adolescent years on the
          southwestern coast of Mexico and years of experience with
          Georgian and Southern Californian cuisine.
        </p>
      </section>

      <div className="relative mt-10 aspect-[3/2] overflow-hidden rounded-xl">
        <Image
          src={dunwoodyExterior}
          alt="A Los Hermanos taqueria with its colorful patio picnic tables"
          fill
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
        />
      </div>

      {/* What that means in practice */}
      <section aria-labelledby="values-heading" className="mt-12">
        <h2 id="values-heading" className="sr-only">
          What we stand for
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {[
            [
              "Fresh every morning",
              "100% fresh meat and produce, prepped daily in every kitchen — the way it's been since day one.",
            ],
            [
              "Family recipes",
              "Salsas, moles and marinades from the coast, made by the family that grew up on them.",
            ],
            [
              "Five taquerias, one familia",
              "Tucker, Lilburn, Suwanee, Lawrenceville and Dunwoody — each one run like the first.",
            ],
          ].map(([title, body]) => (
            <li key={title}>
              <FadeIn className="h-full rounded-xl border border-cream-dark bg-white p-5">
                <h3 className="font-display text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
                  {body}
                </p>
              </FadeIn>
            </li>
          ))}
        </ul>
      </section>

      {/* Recognition */}
      <section
        aria-labelledby="recognition-heading"
        className="mt-12 grid items-center gap-6 rounded-xl border border-cream-dark bg-white p-6 sm:grid-cols-[auto_1fr] sm:p-8"
      >
        <div className="relative mx-auto h-56 w-44 overflow-hidden rounded-lg">
          <Image
            src={brandAward}
            alt="Team member holding the framed Best of Perimeter award for Best Mexican Food"
            fill
            sizes="176px"
            className="object-cover"
          />
        </div>
        <div className="text-center sm:text-left">
          <h2
            id="recognition-heading"
            className="font-display text-[length:var(--text-display-md)]"
          >
            The neighbors noticed
          </h2>
          <p className="mt-3 leading-relaxed text-charcoal-soft">
            Los Hermanos was voted “Best Mexican Food” in the Best of
            Perimeter awards — twenty-five years of morning prep, handmade
            tortillas and familia, recognized by the people who eat here
            every week.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section aria-label="Visit us" className="mt-12 text-center">
        <p className="font-display text-[length:var(--text-display-md)]">
          Visit your local Los Hermanos today
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/locations"
            className="bg-cta inline-flex min-h-12 items-center rounded-md px-6 font-semibold text-white transition-opacity duration-[var(--duration-micro)] hover:opacity-90"
          >
            Find your taqueria
          </Link>
          <Link
            href="/menu"
            className="inline-flex min-h-12 items-center rounded-md border border-charcoal/20 px-6 font-semibold transition-colors duration-[var(--duration-micro)] hover:border-terra"
          >
            See the menu
          </Link>
        </div>
      </section>
    </main>
  );
}
