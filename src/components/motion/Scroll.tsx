"use client";

import {
  LazyMotion,
  m,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useEffect, useRef } from "react";

import { loadFeatures } from "@/components/motion/Motion";

/**
 * Scroll-linked primitives (CLAUDE.md amended June 2026): transform-only,
 * motion-value driven (no per-frame re-renders), static under
 * prefers-reduced-motion.
 */

/** Thin gold reading-progress bar under the sticky header. */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  // If the page is already scrolled when we hydrate (scroll restoration,
  // anchor links, or scrolling before JS loads), the source emits no
  // change event — sync the spring to reality once on mount.
  useEffect(() => {
    scaleX.jump(scrollYProgress.get());
  }, [scaleX, scrollYProgress]);

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-40 h-[3px] origin-left bg-gradient-to-r from-gold via-terra to-cta"
        style={{ scaleX }}
      />
    </LazyMotion>
  );
}

/** Child drifts vertically at a different rate than the page scroll. */
export function ParallaxY({
  children,
  shift = 40,
  className,
}: {
  children: React.ReactNode;
  /** Max px travel across the element's scroll window (negative inverts). */
  shift?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [shift, -shift]);

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
        ref={ref}
        className={className}
        style={reduceMotion ? undefined : { y }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

function wrap(min: number, max: number, value: number): number {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

/**
 * Marquee that reacts to scroll: speeds up with scroll velocity and
 * reverses direction when you scroll back up. Children are rendered
 * twice for the seamless loop, so pass aria-hidden content only.
 */
export function VelocityTicker({
  children,
  baseVelocity = 2.5,
  className,
}: {
  children: React.ReactNode;
  /** Base drift in % of track width per second. */
  baseVelocity?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });
  const direction = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    let moveBy = direction.current * baseVelocity * (delta / 1000);
    moveBy += moveBy * Math.abs(factor);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <LazyMotion features={loadFeatures} strict>
      <div className="overflow-hidden">
        <m.div
          className={`flex w-max whitespace-nowrap ${className ?? ""}`}
          style={{ x }}
        >
          <div className="flex">{children}</div>
          <div className="flex">{children}</div>
        </m.div>
      </div>
    </LazyMotion>
  );
}
