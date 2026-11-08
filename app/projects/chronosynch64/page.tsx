import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import DocSection from "@/components/DocSection";
import Toc from "@/components/Toc";
import ChronoDiagram from "@/components/ChronoDiagram";
import { chronoBlocks } from "@/lib/chrono";
import PpsTicker from "@/components/PpsTicker";
import NextPage from "@/components/NextPage";

export const metadata: Metadata = {
  title: "ChronoSynch64",
  description:
    "ChronoSynch64 — FPGA-based precision clock synchronization architecture: 100 MHz reference, 64-bit free-running timestamp counter, GPS PPS capture and interval/phase measurement.",
};

const toc = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem statement" },
  { id: "architecture", label: "Architecture" },
  { id: "blocks", label: "RTL blocks" },
  { id: "implementation", label: "Technical implementation" },
  { id: "verification", label: "Verification" },
  { id: "status", label: "Development status" },
  { id: "future", label: "Future scope" },
];

const objectives = [
  "Develops a hardware-based timing architecture using a 100 MHz reference clock and a 64-bit free-running timestamp counter.",
  "Captures GPS PPS rising edges to establish precise timing reference events.",
  "Measures PPS-to-PPS intervals against the expected 100,000,000 clock cycles per second.",
  "Implements phase-error measurement to identify timing deviations between the received PPS interval and the nominal reference.",
  "Establishes a foundation for precision timestamping and multi-sensor synchronization.",
  "Designed with future GPS-loss holdover, deterministic trigger generation and host-side diagnostics in mind.",
];

const statusCols = [
  {
    title: "Implemented",
    mark: "bg-signal",
    items: ["64-bit free-running timestamp counter", "PPS capture module"],
  },
  {
    title: "In development",
    mark: "border border-signal",
    items: ["PPS interval / phase measurement", "RTL simulation and testbench development for PPS capture"],
  },
  {
    title: "Planned",
    mark: "border border-dashed border-faint",
    items: ["Phase/frequency detector", "Discipline controller", "Disciplined timebase", "Sensor event capture", "Trigger generator", "Event FIFO and host interface"],
  },
];

const statusText = { implemented: "Implemented", development: "In development", planned: "Planned" } as const;

function Eq({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <div className="flex flex-col gap-1.5 border-l border-signal/50 bg-substrate/50 px-5 py-4">
      <div className="font-mono text-[14px] text-ink md:text-[15px]">{children}</div>
      {note && <div className="text-[13px] text-faint">{note}</div>}
    </div>
  );
}

export default function ChronoPage() {
  return (
    <>
      <PageHeader
        path={[{ label: "projects", href: "/projects" }, { label: "chronosynch64" }]}
        title="ChronoSynch64"
        lede={
          <>
            <span className="block font-display text-xl text-ink/90 md:text-2xl">FPGA-Based Precision Clock Synchronization Architecture</span>
            <span className="mt-5 block">
              An FPGA-based precision timing and synchronization architecture designed to support GPS-disciplined timing,
              multi-sensor synchronization, event timestamping and deterministic triggering.
            </span>
          </>
        }
      >
        <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-metal/60 pt-6 sm:grid-cols-4">
          {[
            ["Reference", "100 MHz"],
            ["Counter", "64-bit"],
            ["Resolution", "10 ns"],
            ["Status", "In development"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[13px] text-faint">{k}</dt>
              <dd className="mt-1 font-display text-xl text-ink md:text-2xl">{v}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      <div className="frame mt-20 grid gap-12 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <Toc items={toc} />
        </aside>

        <article className="min-w-0 lg:col-span-9">
          <DocSection id="overview" title="Overview">
            <blockquote className="font-display text-[clamp(1.35rem,2.4vw,1.85rem)] leading-snug tracking-[-0.01em] text-ink">
              “Designed to evolve into a hardware timing subsystem that enables deterministic event correlation and
              synchronized multi-sensor acquisition.”
            </blockquote>
            <h3 className="mt-12 text-sm text-faint">Engineering objectives and architecture contributions</h3>
            <ul className="mt-5 grid gap-x-10 gap-y-5 md:grid-cols-2">
              {objectives.map(o => (
                <li key={o} className="flex gap-4 leading-relaxed text-ink/90">
                  <span aria-hidden className="mt-[0.6em] h-[5px] w-[5px] shrink-0 border border-signal/80" />
                  {o}
                </li>
              ))}
            </ul>
          </DocSection>

          <DocSection id="problem" title="Problem statement">
            <div className="measure space-y-5 leading-relaxed text-mute">
              <p>
                Correlating data from several sensors needs a common, trustworthy notion of time. Each device usually runs
                from its own oscillator, so independent clocks drift apart, and timestamps taken in software inherit
                interrupt and scheduling latency.
              </p>
              <p>
                A GPS receiver&apos;s pulse-per-second (PPS) output marks second boundaries against an external reference.
                ChronoSynch64 measures the local 100 MHz reference against PPS directly in hardware, building towards a
                disciplined timebase that can timestamp events and fire triggers deterministically.
              </p>
            </div>
          </DocSection>

          <DocSection id="architecture" title="Architecture">
            <p className="measure mb-8 leading-relaxed text-mute">
              The raw timestamp counter is the fixed reference of the design. Future clock discipline is applied to a
              separate disciplined timebase, never to the raw counter.
            </p>
            <ChronoDiagram />
          </DocSection>

          <DocSection id="blocks" title="RTL blocks">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-[14px]">
                <thead className="text-faint">
                  <tr className="border-b border-metal">
                    <th className="py-3 pr-6 font-normal">Block</th>
                    <th className="py-3 pr-6 font-normal">Instance</th>
                    <th className="py-3 pr-6 font-normal">Status</th>
                    <th className="py-3 font-normal">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {chronoBlocks.map(b => (
                    <tr key={b.id} className="border-b border-metal/50 align-top">
                      <td className="py-4 pr-6 text-ink">{b.name}</td>
                      <td className="py-4 pr-6 font-mono text-[12.5px] text-faint">{b.inst}</td>
                      <td className={`whitespace-nowrap py-4 pr-6 ${b.status === "planned" ? "text-faint" : "text-signal"}`}>{statusText[b.status]}</td>
                      <td className="py-4 leading-relaxed text-mute">{b.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[13px] text-faint">Instance names are descriptive labels for this page.</p>
          </DocSection>

          <DocSection id="implementation" title="Technical implementation">
            <div className="grid gap-10 xl:grid-cols-2">
              <div className="space-y-3">
                <h3 className="mb-4 font-display text-lg text-ink">Timebase arithmetic</h3>
                <Eq note="one count">t<sub>res</sub> = 1 / f<sub>ref</sub> = 1 / 100 MHz = 10 ns</Eq>
                <Eq note="never wraps in practice">T<sub>wrap</sub> = 2<sup>64</sup> / 10<sup>8</sup> s ≈ 1.84 × 10<sup>11</sup> s ≈ 5,845 yr</Eq>
                <Eq note="PPS-to-PPS interval">Δ<sub>n</sub> = ts<sub>n</sub> − ts<sub>n−1</sub></Eq>
                <Eq note="nominal N = 100,000,000">e<sub>n</sub> = Δ<sub>n</sub> − N</Eq>
                <Eq note="1 cycle/s ≡ 10 ppb">y<sub>n</sub> ≈ e<sub>n</sub> / N</Eq>
              </div>
              <div>
                <h3 className="mb-4 font-display text-lg text-ink">PPS capture, illustrated</h3>
                <div className="border border-metal/80 bg-substrate/60 p-5">
                  <PpsTicker />
                </div>
              </div>
            </div>

            <h3 className="mt-14 font-display text-lg text-ink">Design considerations</h3>
            <ul className="mt-5 space-y-4 text-mute">
              {[
                ["Asynchronous PPS input", "gps_pps is not related to clk_100m, so it has to pass through a synchronizer before edge detection. The synchronizer's fixed latency cancels in Δ, but the captured edge carries ±1 cycle (10 ns) quantization."],
                ["Raw vs disciplined time", "Keeping the raw counter untouched preserves a monotonic, uncorrected reference for measurement; corrections live only in the disciplined timebase."],
                ["Counter width", "A 64-bit increment at 100 MHz must close within a 10 ns period; FPGA carry chains make this comfortable, but it should be confirmed in post-implementation timing."],
              ].map(([k, v]) => (
                <li key={k} className="grid gap-1 border-t border-metal/50 pt-4 md:grid-cols-[220px_1fr] md:gap-8">
                  <span className="text-ink">{k}</span>
                  <span className="leading-relaxed">{v}</span>
                </li>
              ))}
            </ul>
          </DocSection>

          <DocSection id="verification" title="Verification">
            <p className="measure leading-relaxed text-mute">
              Verification is simulation-first at the RTL level, starting with the PPS capture path.
            </p>
            <ul className="mt-8 space-y-0">
              {[
                ["In progress", "RTL simulation and testbench for PPS capture: PPS edges driven at known cycle positions, captured timestamps checked against the expected counter values."],
                ["Planned", "Interval and phase-error checks with PPS intervals deliberately offset from the nominal 100,000,000 cycles."],
                ["Planned", "PPS edges at varying phase relative to clk_100m, to exercise the synchronizer and edge detection."],
                ["Planned", "Missing-PPS scenarios, as groundwork for GPS-loss holdover behaviour."],
              ].map(([s, v], i) => (
                <li key={i} className="grid gap-1 border-t border-metal/50 py-4 md:grid-cols-[140px_1fr] md:gap-8">
                  <span className={s === "Planned" ? "text-faint" : "text-signal"}>{s}</span>
                  <span className="leading-relaxed text-ink/90">{v}</span>
                </li>
              ))}
            </ul>
          </DocSection>

          <DocSection id="status" title="Development status">
            <div className="grid gap-px bg-metal/60 md:grid-cols-3">
              {statusCols.map(c => (
                <div key={c.title} className="bg-void/90 p-6">
                  <h3 className="flex items-center gap-3 text-ink">
                    <span className={`h-2.5 w-2.5 ${c.mark}`} aria-hidden />
                    {c.title}
                  </h3>
                  <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-mute">
                    {c.items.map(it => <li key={it}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </DocSection>

          <DocSection id="future" title="Future scope">
            <ul className="measure space-y-4 leading-relaxed text-mute">
              <li>Close the loop: phase/frequency detector and discipline controller steering a separate disciplined timebase.</li>
              <li>Holdover: keep disciplined time usable when the GPS PPS reference is lost.</li>
              <li>Sensor event capture and deterministic trigger generation on the common timebase.</li>
              <li>Event FIFO and host interface, including host-side diagnostics.</li>
            </ul>
          </DocSection>
        </article>
      </div>

      <NextPage href="/projects/cxl-lpddr5x" label="CXL-to-LPDDR5X" note="under development" />
    </>
  );
}
