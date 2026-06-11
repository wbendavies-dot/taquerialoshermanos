"use client";

import { LazyMotion, m, useReducedMotion } from "framer-motion";

/**
 * The only sanctioned entry point for motion (CLAUDE.md): LazyMotion with
 * domAnimation features, transform/opacity only, reduced-motion respected.
 *
 * Features load asynchronously so the animation runtime stays out of
 * First Load JS (the budget reason LazyMotion exists).
 */
export const loadFeatures = () =>
  import("framer-motion").then((mod) => mod.domAnimation);

export const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const;

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 32 },
  right: { x: -32 },
  none: {},
};

export function FadeIn({
  children,
  delay = 0,
  from = "up",
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  from?: Direction;
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
        initial={reduceMotion ? false : { opacity: 0, ...OFFSET[from] }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay, ease: EASE_ENTRANCE }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

/**
 * Choreographed group reveal: children (StaggerItem) cascade in. Used for
 * the hero entrance and card grids — the "designed, not assembled" feel.
 */
/** Semantic element support so motion never costs list/landmark roles. */
type MotionTag = "div" | "ul" | "li" | "section";

export function Stagger({
  children,
  className,
  delay = 0,
  step = 0.08,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  step?: number;
  as?: MotionTag;
}) {
  const reduceMotion = useReducedMotion();
  const Tag = m[as];

  return (
    <LazyMotion features={loadFeatures} strict>
      <Tag
        data-motion=""
        className={className}
        initial={reduceMotion ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: step, delayChildren: delay } },
        }}
      >
        {children}
      </Tag>
    </LazyMotion>
  );
}

export function StaggerItem({
  children,
  className,
  from = "up",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  from?: Direction;
  as?: MotionTag;
}) {
  const Tag = m[as];
  return (
    <Tag
      data-motion=""
      className={className}
      variants={{
        hidden: { opacity: 0, ...OFFSET[from] },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: 0.55, ease: EASE_ENTRANCE },
        },
      }}
    >
      {children}
    </Tag>
  );
}
