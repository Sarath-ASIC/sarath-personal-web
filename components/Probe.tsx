"use client";

/**
 * Probe readout — the cursor's position expressed as die coordinates.
 * Fine pointers only; hidden on touch and under reduced motion.
 */
import { useEffect, useRef, useState } from "react";

export default function Probe() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduce);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!ref.current) return;
        // 1 px ≈ 0.5 µm on this imaginary die
        const x = (e.clientX * 0.5).toFixed(1).padStart(6, " ");
        const y = (e.clientY * 0.5).toFixed(1).padStart(6, " ");
        ref.current.textContent = `x ${x}  y ${y} µm`;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-5 right-[var(--gutter)] z-30 hidden items-center gap-2 font-mono text-[11px] text-faint lg:flex"
    >
      <span className="h-1.5 w-1.5 bg-signal/70" />
      <span ref={ref} className="whitespace-pre tabular-nums">x    0.0  y    0.0 µm</span>
    </div>
  );
}
