"use client";

import {
  LazyMotion,
  m,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { loadFeatures } from "@/components/motion/Motion";

/**
 * Pointer-reactive primitives (CLAUDE.md amended June 2026). All are:
 * - fine-pointer only (touch devices get the static experience)
 * - disabled under prefers-reduced-motion
 * - driven by motion values + springs (no React re-renders per frame)
 * - transform/opacity only
 */

/** True only for mouse-like pointers with motion allowed. */
export function useInteractivePointer(): boolean {
  const reduceMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    setFinePointer(query.matches);
    const onChange = (event: MediaQueryListEvent) =>
      setFinePointer(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return finePointer && !reduceMotion;
}

/** CTA that leans toward the cursor and snaps back on leave. */
export function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const active = useInteractivePointer();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 18 });
  const y = useSpring(0, { stiffness: 220, damping: 18 });

  return (
    <LazyMotion features={loadFeatures} strict>
      <span
        ref={ref}
        className={`inline-block ${className ?? ""}`}
        onPointerMove={(event) => {
          if (!active || !ref.current) return;
          const rect = ref.current.getBoundingClientRect();
          x.set((event.clientX - rect.left - rect.width / 2) * strength);
          y.set((event.clientY - rect.top - rect.height / 2) * strength);
        }}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        <m.span className="inline-block" style={{ x, y }}>
          {children}
        </m.span>
      </span>
    </LazyMotion>
  );
}

/** Card that tilts in 3D toward the cursor. */
export function TiltCard({
  children,
  maxTilt = 8,
  className,
}: {
  children: React.ReactNode;
  maxTilt?: number;
  className?: string;
}) {
  const active = useInteractivePointer();
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { stiffness: 180, damping: 16 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 16 });
  const scale = useSpring(1, { stiffness: 180, damping: 20 });

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
        ref={ref}
        className={className}
        style={{
          rotateX,
          rotateY,
          scale,
          transformPerspective: 900,
        }}
        onPointerMove={(event) => {
          if (!active || !ref.current) return;
          const rect = ref.current.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          rotateX.set(-py * maxTilt);
          rotateY.set(px * maxTilt);
          scale.set(1.02);
        }}
        onPointerLeave={() => {
          rotateX.set(0);
          rotateY.set(0);
          scale.set(1);
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

/**
 * Warm radial glow that follows the cursor across a section. Render as
 * a sibling overlay inside a `relative` parent; call the returned
 * handler from the parent's onPointerMove.
 */
export function useSpotlight() {
  const active = useInteractivePointer();
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const background = useMotionTemplate`radial-gradient(480px circle at ${mx}px ${my}px, rgb(217 164 65 / 0.16), transparent 70%)`;

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!active) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set(event.clientX - rect.left);
    my.set(event.clientY - rect.top);
  };

  const overlay = (
    <LazyMotion features={loadFeatures} strict>
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background }}
      />
    </LazyMotion>
  );

  return { onPointerMove, overlay };
}
