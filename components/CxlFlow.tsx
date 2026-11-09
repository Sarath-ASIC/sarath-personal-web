"use client";

/**
 * CXL.mem → LPDDR5X data-flow visualization.
 * Request lane runs left→right through the planned pipeline; the response lane
 * returns read data right→left. Refresh/timing control feeds the scheduler and
 * command generator. This depicts the intended architecture under development.
 */
import { useReducedMotion } from "motion/react";

const stagesFull = [
  { x: 20, t1: "CXL.mem", t2: "transactions" },
  { x: 145, t1: "Packet", t2: "decode" },
  { x: 270, t1: "Address", t2: "map / xlate" },
  { x: 395, t1: "Request", t2: "queue" },
  { x: 520, t1: "Adaptive", t2: "scheduler" },
  { x: 645, t1: "LPDDR5X", t2: "cmd gen" },
  { x: 770, t1: "LPDDR5X", t2: "memory" },
];
const stagesCompact = [
  { x: 20, t1: "CXL.mem", t2: "requests" },
  { x: 200, t1: "Request", t2: "queue" },
  { x: 380, t1: "Adaptive", t2: "scheduler" },
  { x: 560, t1: "LPDDR5X", t2: "cmd gen" },
];

export default function CxlFlow({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion();
  const stages = compact ? stagesCompact : stagesFull;
  const bw = compact ? 140 : 110;
  const vw = compact ? 720 : 900;
  const reqY = 140, rspY = 166;
  const last = stages[stages.length - 1];
  const queue = stages.find(s => s.t1 === "Request")!;

  const reqPath = `M${stages[0].x + bw / 2} ${reqY} H${last.x + bw / 2}`;
  const rspPath = `M${last.x + bw / 2} ${rspY} H${stages[0].x + bw / 2}`;

  return (
    <svg viewBox={`0 0 ${vw} ${compact ? 200 : 250}`} className={`block w-full ${compact ? "" : "min-w-[680px]"}`} role="img"
      aria-label="Data flow: CXL.mem requests are decoded, address-mapped, queued, scheduled and converted to LPDDR5X commands; read data returns on a response path. Refresh and timing control feed the scheduler.">
      {/* lanes */}
      <path d={reqPath} stroke="rgba(120,150,200,.3)" fill="none" />
      <path d={rspPath} stroke="rgba(120,150,200,.3)" fill="none" strokeDasharray="3 4" />

      {stages.map((s, i) => (
        <g key={i}>
          <rect x={s.x + 0.5} y={60.5} width={bw - 1} height={119} fill="rgba(10,17,34,.92)"
            stroke={i === stages.length - 1 ? "rgba(70,210,255,.45)" : "rgba(120,150,200,.35)"} />
          {!compact && <text x={s.x + 10} y={78} fontSize="10" className="fill-faint font-mono">{i + 1}</text>}
          <text x={s.x + 10} y={compact ? 82 : 98} fontSize="12.5" className="fill-ink" fontWeight={500}>{s.t1}</text>
          <text x={s.x + 10} y={compact ? 98 : 114} fontSize="12" className="fill-mute">{s.t2}</text>
        </g>
      ))}

      {/* queue slots */}
      {Array.from({ length: 6 }).map((_, k) => (
        <rect key={k} x={queue.x + 10 + k * ((bw - 20) / 6)} y={compact ? 110 : 122} width={(bw - 20) / 6 - 3} height={9}
          fill="var(--color-signal)" opacity={0.12}>
          {!reduce && (
            <animate attributeName="opacity" values="0.12;0.75;0.75;0.12" keyTimes="0;0.15;0.6;1" dur="3.6s"
              begin={`${k * 0.45}s`} repeatCount="indefinite" />
          )}
        </rect>
      ))}

      {/* refresh & timing control, feeding scheduler/cmd gen */}
      {(() => {
        const sched = stages.find(s => s.t1 === "Adaptive")!;
        const cmd = stages.find(s => s.t2 === "cmd gen")!;
        const x0 = sched.x, x1 = cmd.x + bw;
        return (
          <g>
            <rect x={x0 + 0.5} y={4.5} width={x1 - x0 - 1} height={30} fill="none" stroke="rgba(120,150,200,.35)" strokeDasharray="4 4" />
            <text x={x0 + 10} y={24} fontSize="11.5" className="fill-mute">Refresh &amp; timing control</text>
            <path d={`M${sched.x + bw / 2} 35 V60 M${cmd.x + bw / 2} 35 V60`} stroke="rgba(120,150,200,.35)" />
          </g>
        );
      })()}

      {/* packets */}
      {!reduce &&
        [0, 1.1, 2.2, 3.3].map((d, i) => (
          <g key={`q${i}`}>
            <rect x={-3} y={-3} width={6} height={6} fill={i % 2 ? "none" : "var(--color-signal)"} stroke="var(--color-signal)">
              <animateMotion path={reqPath} dur="4.4s" begin={`${d}s`} repeatCount="indefinite" keyPoints="0;0.42;0.5;1" keyTimes="0;0.35;0.6;1" calcMode="linear" />
            </rect>
          </g>
        ))}
      {!reduce &&
        [0.6, 2.8].map((d, i) => (
          <circle key={`r${i}`} r={3} fill="var(--color-signal)" opacity={0.8}>
            <animateMotion path={rspPath} dur="4.4s" begin={`${d}s`} repeatCount="indefinite" />
          </circle>
        ))}

      {!compact && (
        <g fontSize="10" className="fill-faint font-mono">
          <rect x={20} y={222} width={6} height={6} fill="var(--color-signal)" />
          <text x={32} y={228}>read req</text>
          <rect x={100} y={222} width={6} height={6} fill="none" stroke="var(--color-signal)" />
          <text x={112} y={228}>write req</text>
          <circle cx={186} cy={225} r={3} fill="var(--color-signal)" />
          <text x={194} y={228}>read data</text>
          <text x={280} y={228}>Intended architecture — under development</text>
        </g>
      )}
    </svg>
  );
}
