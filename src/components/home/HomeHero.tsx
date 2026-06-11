"use client";

import {
  LazyMotion,
  m,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import heroBurrito from "@/assets/images/hero-burrito.jpg";
import { Magnetic, useSpotlight } from "@/components/motion/Interactive";
import { loadFeatures, Stagger, StaggerItem } from "@/components/motion/Motion";

/**
 * Cinematic hero: choreographed entrance, scroll parallax (image drifts
 * slower than the page, content lifts away and fades), cursor spotlight,
 * magnetic CTAs. Server-rendered content; motion hydrates on top.
 */
export function HomeHero() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const spotlight = useSpotlight();

  return (
    <LazyMotion features={loadFeatures} strict>
      <section
        ref={ref}
        onPointerMove={spotlight.onPointerMove}
        className="relative flex min-h-[86svh] items-end overflow-hidden bg-charcoal"
      >
        {/* No aria-hidden here: the image carries meaningful alt text. */}
        <m.div
          className="absolute inset-0 scale-105"
          style={reduceMotion ? undefined : { y: imageY }}
        >
          <Image
            src={heroBurrito}
            alt="Grilled burrito cut in half on a plate, held up in the dining room under papel picado"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </m.div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/45 to-charcoal/10"
        />
        {spotlight.overlay}

        <m.div
          className="relative w-full"
          style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
        >
          <Stagger className="mx-auto w-full max-w-5xl px-4 pb-16 text-cream sm:pb-20">
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
                <Magnetic>
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
                </Magnetic>
                <Magnetic>
                  <a
                    href="#locations"
                    className="inline-flex min-h-13 items-center rounded-md border border-cream/40 px-7 text-lg font-semibold text-cream backdrop-blur-sm transition-colors duration-[var(--duration-micro)] hover:border-cream"
                  >
                    Find your taqueria
                  </a>
                </Magnetic>
              </div>
            </StaggerItem>
          </Stagger>
        </m.div>

        <div
          aria-hidden="true"
          className="pulse-soft absolute bottom-4 left-1/2 hidden -translate-x-1/2 text-cream sm:block"
        >
          ↓
        </div>
      </section>
    </LazyMotion>
  );
}
