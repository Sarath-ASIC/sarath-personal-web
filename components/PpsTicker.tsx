"use client";

/**
 * PPS capture illustration: a free-running 64-bit counter (hex) and a
 * scrolling time axis. Each PPS edge crossing the capture line latches the
 * counter. Runs at the NOMINAL rate (exactly 100,000,000 cycles per PPS) —
 * this is an illustration of the mechanism, not measured hardware data.
 * One simulated second = 2.4 s of wall time.
 */
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const F = 100_000_000; // cycles per second at 100 MHz
const WALL_PER_SIM = 2.4; // seconds of wall time per simulated second
const PX_PER_SIM = 220; // axis scale

function hex64(n: number) {
  const h = Math.floor(n).toString(16).toUpperCase().padStart(16, "0");
  return `0x${h.slice(0, 4)}_${h.slice(4, 8)}_${h.slice(8, 12)}_${h.slice(12)}`;
}

export default function PpsTicker({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion();
  const counterRef = useRef<HTMLSpanElement>(null);
  const axisRef = useRef<SVGGElement>(null);
  const [caps, setCaps] = useState<number[]>([1, 2]); // captured PPS indices
  const start = 0.62; // start just before an edge, so the first capture happens soon

  useEffect(() => {
    if (reduce) {
      if (counterRef.current) counterRef.current.textContent = hex64(2.62 * F);
      return;
    }
    let raf = 0;
    let lastSec = 2;
    const t0 = performance.now();
    const loop = (now: number) => {
      const sim = 2 + start + (now - t0) / 1000 / WALL_PER_SIM;
      if (counterRef.current) counterRef.current.textContent = hex64(sim * F);
      if (axisRef.current) axisRef.current.setAttribute("transform", `translate(${-(sim % 1) * PX_PER_SIM} 0)`);
      const sec = Math.floor(sim);
      if (sec !== lastSec) {
        lastSec = sec;
        setCaps(c => [...c.slice(-2), sec]);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  // Axis: ticks every 0.1 s, PPS edge at each integer second. Capture line at x = 0.7 * width.
  const width = compact ? 400 : 660;
  const capX = Math.round(width * 0.7);
  const ticks = [];
  for (let i = -4; i <= 4; i++) {
    for (let k = 0; k < 10; k++) {
      const x = capX + (i + k / 10) * PX_PER_SIM;
      ticks.push({ x, pps: k === 0 });
    }
  }

  const last = caps[caps.length - 1];

  return (
    <div className="select-none">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-[11px] text-faint">ts[63:0] @ 100 MHz</span>
        <span ref={counterRef} className="font-mono text-[13px] tabular-nums text-ink md:text-[15px]">{hex64(2.62 * F)}</span>
      </div>

      <svg viewBox={`0 0 ${width} 64`} className="mt-3 block w-full" aria-hidden preserveAspectRatio="none">
        <line x1="0" x2={width} y1="44" y2="44" stroke="rgba(120,150,200,.25)" />
        <g ref={axisRef}>
          {ticks.map((t, i) =>
            t.pps ? (
              <g key={i}>
                <path d={`M${t.x} 44 V14 H${t.x + 26} V44`} fill="none" stroke="var(--color-signal)" strokeWidth="1.25" />
              </g>
            ) : (
              <line key={i} x1={t.x} x2={t.x} y1="40" y2="44" stroke="rgba(120,150,200,.35)" />
            ),
          )}
        </g>
        {/* capture line */}
        <line x1={capX} x2={capX} y1="4" y2="60" stroke="rgba(230,234,240,.5)" strokeDasharray="2 3" />
        <text x={capX + 6} y="60" fontSize="10" className="fill-faint font-mono">capture</text>
        <text x="4" y="10" fontSize="10" className="fill-faint font-mono">gps_pps</text>
      </svg>

      {compact && (
        <div className="mt-5 flex items-baseline justify-between gap-3 border-t border-metal/60 pt-3 font-mono text-[12px] tabular-nums">
          <span className="text-faint">last capture</span>
          <span className="text-mute">{hex64(last * F)}</span>
        </div>
      )}
      {!compact && (
        <table className="mt-5 w-full text-left font-mono text-[12px] tabular-nums md:text-[13px]">
          <thead className="text-faint">
            <tr>
              <th className="py-1.5 pr-4 font-normal">edge</th>
              <th className="py-1.5 pr-4 font-normal">captured ts</th>
              <th className="py-1.5 font-normal">Δ cycles</th>
            </tr>
          </thead>
          <tbody>
            {caps.map(n => (
              <tr key={n} className={`border-t border-metal/60 ${n === last ? "text-ink" : "text-mute"}`}>
                <td className="py-1.5 pr-4">n={n}</td>
                <td className="py-1.5 pr-4">{hex64(n * F)}</td>
                <td className="py-1.5">{(100_000_000).toLocaleString("en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="mt-3 text-[11px] text-faint">Illustration at the nominal rate; not measured data.</p>
    </div>
  );
}
