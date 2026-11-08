import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SpotlightCard from "@/components/SpotlightCard";
import PpsTicker from "@/components/PpsTicker";
import CxlFlow from "@/components/CxlFlow";
import NextPage from "@/components/NextPage";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Projects",
  description: "ChronoSynch64, an FPGA-based precision clock synchronization architecture, and a CXL-to-LPDDR5X memory architecture under development.",
};

function Status({ children, live = false }: { children: React.ReactNode; live?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] text-mute">
      <span className={`h-[7px] w-[7px] ${live ? "bg-signal" : "border border-signal/70"}`} aria-hidden />
      {children}
    </span>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        path={[{ label: "projects" }]}
        title="Projects"
        lede="Digital architectures built at the RTL level, with honest status on what is implemented and what is planned."
      />

      {/* Featured */}
      <section className="frame mt-20 md:mt-28" aria-labelledby="featured">
        <h2 id="featured" className="sr-only">Featured project</h2>
        <Reveal>
          <SpotlightCard href="/projects/chronosynch64" ariaLabel="ChronoSynch64 — open project page" className="overflow-hidden">
            <div className="grid lg:grid-cols-12">
              <div className="p-7 md:p-10 lg:col-span-7">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <span className="text-[13px] text-signal">Featured</span>
                  <Status live>Core blocks implemented, measurement in development</Status>
                </div>
                <h3 className="mt-6 font-display text-[clamp(2.4rem,5.4vw,4.4rem)] font-medium leading-[0.92] tracking-[-0.035em] text-ink">
                  ChronoSynch64
                </h3>
                <p className="mt-3 font-display text-lg text-ink/85 md:text-xl">
                  FPGA-Based Precision Clock Synchronization Architecture
                </p>
                <p className="measure mt-6 leading-relaxed text-mute">
                  An FPGA-based precision timing and synchronization architecture designed to support GPS-disciplined
                  timing, multi-sensor synchronization, event timestamping and deterministic triggering.
                </p>
                <dl className="mt-8 grid max-w-md grid-cols-2 gap-6 border-t border-metal/60 pt-6">
                  <div>
                    <dt className="text-[13px] text-faint">Reference clock</dt>
                    <dd className="mt-1 font-display text-2xl text-ink">100 MHz</dd>
                  </div>
                  <div>
                    <dt className="text-[13px] text-faint">Timestamp width</dt>
                    <dd className="mt-1 font-display text-2xl text-ink">64-bit</dd>
                  </div>
                </dl>
                <span className="mt-9 inline-flex items-center gap-3 text-[15px] text-ink">
                  <span className="netlink">Read the architecture</span>
                </span>
              </div>
              <div className="flex flex-col justify-center border-t border-metal/70 bg-void/40 p-7 md:p-10 lg:col-span-5 lg:border-l lg:border-t-0">
                <PpsTicker compact />
              </div>
            </div>
          </SpotlightCard>
        </Reveal>
      </section>

      {/* Upcoming */}
      <section className="frame mt-28 md:mt-36" aria-labelledby="upcoming">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="upcoming" className="font-display text-[clamp(1.2rem,2.2vw,1.6rem)] font-medium tracking-[0.06em] text-ink">
            UPCOMING / CURRENTLY UNDER DEVELOPMENT
          </h2>
          <p className="text-sm text-faint">Work in progress — scope and results not final.</p>
        </div>
        <div className="track mt-5" />

        <Reveal className="mt-10">
          <SpotlightCard href="/projects/cxl-lpddr5x" ariaLabel="CXL-to-LPDDR5X Memory Architecture — open project page">
            <div className="grid gap-10 p-7 md:p-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Status>Under development</Status>
                <h3 className="mt-6 font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium leading-[1] tracking-[-0.03em] text-ink">
                  CXL-to-LPDDR5X Memory Architecture
                </h3>
                <p className="mt-6 leading-relaxed text-mute">
                  Exploring an RTL-based memory architecture connecting a CXL.mem interface to LPDDR5X memory for
                  high-performance computing and Edge AI workloads.
                </p>
                <span className="mt-8 inline-flex text-[15px] text-ink">
                  <span className="netlink">See the technical direction</span>
                </span>
              </div>
              <div className="flex items-center lg:col-span-7">
                <CxlFlow compact />
              </div>
            </div>
          </SpotlightCard>
        </Reveal>
      </section>

      <NextPage href="/skills" label="Skills" />
    </>
  );
}
