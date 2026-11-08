import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import DocSection from "@/components/DocSection";
import Toc from "@/components/Toc";
import CxlFlow from "@/components/CxlFlow";
import NextPage from "@/components/NextPage";

export const metadata: Metadata = {
  title: "CXL-to-LPDDR5X Memory Architecture",
  description:
    "Under development: an RTL-based memory architecture connecting a CXL.mem interface to LPDDR5X memory for high-performance computing and Edge AI workloads.",
};

const toc = [
  { id: "overview", label: "Overview" },
  { id: "dataflow", label: "Data flow" },
  { id: "direction", label: "Technical direction" },
  { id: "explores", label: "What it explores" },
  { id: "status", label: "Status" },
];

// The request path is a genuine sequence, so it is numbered.
const direction = [
  ["CXL.mem transaction handling", "Accept memory requests arriving over the CXL.mem interface."],
  ["Request packet decoding", "Extract opcode, address and data from incoming requests."],
  ["Address mapping and translation", "Map host addresses onto the LPDDR5X organisation."],
  ["Request buffering and queue management", "Hold pending requests so they can be reordered and issued efficiently."],
  ["Adaptive scheduling", "Choose which queued request to serve next."],
  ["LPDDR5X command generation", "Turn scheduled requests into LPDDR5X command sequences."],
  ["Memory read/write transaction management", "Track outstanding reads and writes through to completion."],
  ["Refresh and memory timing control", "Insert refresh and respect LPDDR5X timing parameters alongside normal traffic."],
];

const explores = [
  "Reduced transaction latency.",
  "Improved memory bandwidth utilization.",
  "Intelligent request scheduling.",
  "Better memory access efficiency.",
  "Support for high-throughput Edge AI workloads.",
];

export default function CxlPage() {
  return (
    <>
      <PageHeader
        path={[{ label: "projects", href: "/projects" }, { label: "cxl-lpddr5x" }]}
        title="CXL-to-LPDDR5X Memory Architecture"
        lede="Exploring an RTL-based memory architecture connecting a CXL.mem interface to LPDDR5X memory for high-performance computing and Edge AI workloads."
      >
        <p className="mt-10 inline-flex items-center gap-3 border border-dashed border-signal/50 px-4 py-2 text-sm text-mute">
          <span className="h-[7px] w-[7px] border border-signal" aria-hidden />
          Under development — not a completed product
        </p>
      </PageHeader>

      <div className="frame mt-20 grid gap-12 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <Toc items={toc} />
        </aside>

        <article className="min-w-0 lg:col-span-9">
          <DocSection id="overview" title="Overview">
            <h3 className="text-sm text-faint">Project objective</h3>
            <p className="mt-3 font-display text-[clamp(1.35rem,2.4vw,1.85rem)] leading-snug tracking-[-0.01em] text-ink">
              Develop an efficient memory-interface architecture that bridges high-speed CXL memory transactions with
              LPDDR5X memory operations.
            </p>
          </DocSection>

          <DocSection id="dataflow" title="Data flow">
            <p className="measure mb-8 leading-relaxed text-mute">
              Requests move left to right through the pipeline; read data returns on the response path. Refresh and timing
              control share the scheduler and command generator with normal traffic.
            </p>
            <div className="overflow-x-auto border border-metal/80 bg-substrate/60 p-4 md:p-6">
              <CxlFlow />
            </div>
          </DocSection>

          <DocSection id="direction" title="Technical direction">
            <ol className="grid gap-px bg-metal/60 sm:grid-cols-2">
              {direction.map(([t, d], i) => (
                <li key={t} className="group bg-void/90 p-6 transition-colors duration-300 hover:bg-substrate/80">
                  <span className="font-mono text-[12px] text-faint transition-colors group-hover:text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-ink">{t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-mute">{d}</p>
                </li>
              ))}
            </ol>
          </DocSection>

          <DocSection id="explores" title="What it explores">
            <ul className="space-y-0">
              {explores.map(e => (
                <li key={e} className="flex items-center gap-4 border-b border-metal/50 py-4 text-lg text-ink/90">
                  <span aria-hidden className="h-[5px] w-[5px] shrink-0 border border-signal/80" />
                  {e}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[13px] text-faint">These are design goals under investigation, not measured results.</p>
          </DocSection>

          <DocSection id="status" title="Status">
            <p className="measure leading-relaxed text-mute">
              Architecture and RTL are in progress. Results, benchmarks and verification status will be published here as
              the work matures.
            </p>
          </DocSection>
        </article>
      </div>

      <NextPage href="/skills" label="Skills" />
    </>
  );
}
