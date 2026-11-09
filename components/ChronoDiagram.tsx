"use client";

/**
 * ChronoSynch64 architecture diagram.
 * Status is encoded structurally: implemented = solid + live wires,
 * in development = solid outline, planned = dashed outline + static wires.
 * Blocks are focusable; selecting one shows its description below.
 */
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { chronoBlocks, type Block, type Status } from "@/lib/chrono";

const W = 180, H = 70;

const statusLabel: Record<Status, string> = {
  implemented: "Implemented",
  development: "In development",
  planned: "Planned",
};

// Wires: [path, live?]
const wires: { d: string; live: boolean; label?: { x: number; y: number; t: string } }[] = [
  { d: "M20 65 H120", live: true, label: { x: 22, y: 57, t: "clk_100m" } },
  { d: "M20 225 H120", live: true, label: { x: 22, y: 217, t: "gps_pps" } },
  { d: "M20 385 H120", live: false, label: { x: 22, y: 377, t: "sensor_evt" } },
  // ts[63:0] trunk from the counter, tapped by PPS capture and event capture
  { d: "M300 65 H320 V375", live: true, label: { x: 306, y: 57, t: "ts[63:0]" } },
  { d: "M320 205 H300", live: true },
  { d: "M320 365 H300", live: false },
  { d: "M300 240 H340", live: true, label: { x: 302, y: 255, t: "pps_ts" } },
  { d: "M520 225 H560", live: false, label: { x: 522, y: 217, t: "err" } },
  { d: "M740 225 H780", live: false },
  { d: "M870 260 V350", live: false, label: { x: 876, y: 310, t: "corr" } },
  { d: "M780 385 H740", live: false, label: { x: 744, y: 377, t: "t_disc" } },
  { d: "M300 395 H340", live: false },
  { d: "M650 420 V448", live: false, label: { x: 656, y: 444, t: "trig_out" } },
  { d: "M430 420 V448", live: false, label: { x: 436, y: 444, t: "host" } },
];

/** Split a long block name into two balanced lines. */
function splitName(name: string): string[] {
  if (name.length <= 20) return [name];
  const words = name.split(" ");
  let best = 1, bestScore = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ").length, b = words.slice(i).join(" ").length;
    if (Math.max(a, b) < bestScore) { bestScore = Math.max(a, b); best = i; }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

function BlockShape({ b, selected, onSelect }: { b: Block; selected: boolean; onSelect: () => void }) {
  const stroke =
    b.status === "implemented" ? "var(--color-signal)" : b.status === "development" ? "rgba(70,210,255,.55)" : "var(--color-faint)";
  return (
    <g
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${b.name} — ${statusLabel[b.status]}`}
      onClick={onSelect}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect())}
      className="cursor-pointer outline-none [&:focus-visible>rect:first-of-type]:stroke-[2]"
    >
      <rect
        x={b.x + 0.5}
        y={b.y + 0.5}
        width={W - 1}
        height={H - 1}
        fill={selected ? "rgba(70,210,255,0.10)" : b.status === "implemented" ? "rgba(70,210,255,0.05)" : "rgba(10,17,34,0.85)"}
        stroke={selected ? "var(--color-signal)" : stroke}
        strokeWidth={selected ? 1.5 : 1}
        strokeDasharray={b.status === "planned" ? "4 4" : undefined}
        style={{ transition: "fill .3s, stroke .3s" }}
      />
      {b.status === "development" && (
        // half-filled bar: work in progress
        <rect x={b.x + 1} y={b.y + H - 4} width={(W - 2) / 2} height={3} fill="rgba(70,210,255,.5)" />
      )}
      <text x={b.x + 12} y={b.y + 22} className="fill-faint font-mono" fontSize="10">{b.inst}</text>
      <text x={b.x + 12} y={b.y + 46} className={b.status === "planned" ? "fill-mute" : "fill-ink"} fontSize="13" fontWeight={500}>
        {(() => {
          const lines = splitName(b.name);
          if (lines.length === 1) return lines[0];
          return lines.map((l, i) => (
            <tspan key={i} x={b.x + 12} dy={i === 0 ? -6 : 16}>{l}</tspan>
          ));
        })()}
      </text>
    </g>
  );
}

export default function ChronoDiagram() {
  const [sel, setSel] = useState<string>("tsc");
  const reduce = useReducedMotion();
  const active = chronoBlocks.find(b => b.id === sel)!;

  return (
    <figure className="border border-metal/80 bg-substrate/60">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-metal/70 px-5 py-3 text-[12px] text-mute">
        <span>Select a block to read its role</span>
        <span className="flex flex-wrap gap-x-5 gap-y-1">
          <span className="flex items-center gap-2"><span className="h-2.5 w-4 border border-signal bg-signal/10" />Implemented</span>
          <span className="flex items-center gap-2"><span className="relative h-2.5 w-4 border border-signal/55"><span className="absolute bottom-0 left-0 h-[2px] w-1/2 bg-signal/60" /></span>In development</span>
          <span className="flex items-center gap-2"><span className="h-2.5 w-4 border border-dashed border-faint" />Planned</span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox="0 0 1000 460" className="block min-w-[780px]" role="group" aria-label="ChronoSynch64 block architecture">
          {/* faint grid */}
          <defs>
            <pattern id="cgrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="rgba(120,150,200,.05)" />
            </pattern>
          </defs>
          <rect width="1000" height="460" fill="url(#cgrid)" />

          {/* constraint note: raw vs disciplined domains */}
          <g>
            <rect x="560.5" y="30.5" width="399" height="69" fill="none" stroke="rgba(70,210,255,.25)" strokeDasharray="2 4" />
            <text x="576" y="58" fontSize="12" className="fill-mute">Constraint: the raw counter is never adjusted.</text>
            <text x="576" y="78" fontSize="12" className="fill-mute">Discipline acts only on a separate timebase.</text>
          </g>

          {wires.map((w, i) => (
            <g key={i}>
              <path d={w.d} fill="none" stroke={w.live ? "rgba(70,210,255,.35)" : "rgba(120,150,200,.28)"} strokeDasharray={w.live ? undefined : "3 4"} />
              {w.live && !reduce && <path d={w.d} fill="none" stroke="var(--color-signal)" strokeWidth="1.25" className="wire-live" />}
              {w.label && <text x={w.label.x} y={w.label.y} fontSize="10" className="fill-faint font-mono">{w.label.t}</text>}
            </g>
          ))}
          {/* trunk taps as vias */}
          {[[320, 205], [320, 365]].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x - 3} y={y - 3} width="6" height="6" fill="var(--color-void)" stroke="rgba(70,210,255,.6)" />
          ))}

          {chronoBlocks.map(b => (
            <BlockShape key={b.id} b={b} selected={b.id === sel} onSelect={() => setSel(b.id)} />
          ))}
        </svg>
      </div>

      <div className="min-h-[132px] border-t border-metal/70 px-5 py-5 md:px-7" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h4 className="font-display text-lg font-medium text-ink">{active.name}</h4>
              <span className="font-mono text-[12px] text-faint">{active.inst}</span>
              <span className={`text-[12px] ${active.status === "planned" ? "text-faint" : "text-signal"}`}>{statusLabel[active.status]}</span>
            </div>
            <p className="measure mt-2 leading-relaxed text-mute">{active.desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </figure>
  );
}
