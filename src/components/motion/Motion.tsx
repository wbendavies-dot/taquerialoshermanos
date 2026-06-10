"use client";

import { LazyMotion, m, useReducedMotion } from "framer-motion";

/**
 * The only sanctioned entry point for motion (CLAUDE.md): LazyMotion with
 * domAnimation features, transform/opacity only, reduced-motion respected.
 *
 * Features load asynchronously so the animation runtime stays out of
 * First Load JS (the budget reason LazyMotion exists).
 */
const loadFeatures = () =>
  import("framer-motion").then((mod) => mod.domAnimation);

const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const;

export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={loadFeatures} strict>
      {/* data-motion: globals.css forces visibility when scripting is
          unavailable, so the SSR'd opacity-0 never strands no-JS users. */}
      <m.div
        data-motion=""
        className={className}
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, delay, ease: EASE_ENTRANCE }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
