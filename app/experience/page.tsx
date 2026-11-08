import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SpotlightCard from "@/components/SpotlightCard";
import NextPage from "@/components/NextPage";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Experience",
  description: "Intern, RTL / FPGA at KriSemi Design Technologies — decoder-side work in the NSGU team.",
};

const responsibilities = [
  "Working on FPGA and RTL design activities.",
  "Contributing to the NSGU team, specifically on the decoder side.",
  "Supporting decoder-side development and integration within the team.",
  "Gaining practical exposure to hardware design, implementation and testing.",
];

export default function ExperiencePage() {
  return (
    <>
      <PageHeader path={[{ label: "experience" }]} title="Experience" lede="Industry work alongside the M.Tech programme." />

      <section className="frame mt-20 md:mt-28" aria-label="Timeline">
        <ol className="relative">
          {/* timeline rail */}
          <span aria-hidden className="absolute bottom-0 left-[5px] top-2 w-px bg-gradient-to-b from-signal/70 via-metal to-transparent md:left-[calc(25%+5px)]" />

          <Reveal as="li" className="relative grid gap-6 pl-10 md:grid-cols-4 md:gap-0 md:pl-0">
            {/* node */}
            <span aria-hidden className="absolute left-0 top-2 flex h-[11px] w-[11px] items-center justify-center border border-signal bg-void md:left-[25%]">
              <span className="h-[5px] w-[5px] animate-pulse bg-signal motion-reduce:animate-none" />
            </span>

            <div className="md:pr-10 md:text-right">
              <p className="text-sm text-signal">Current</p>
              <p className="mt-1 text-sm text-faint">Internship</p>
            </div>

            <div className="md:col-span-3 md:pl-12">
              <SpotlightCard className="p-7 md:p-10">
                <div className="flex flex-col gap-1">
                  <h2 className="font-display text-[clamp(1.6rem,3vw,2.35rem)] font-medium leading-tight tracking-tight text-ink">
                    KriSemi Design Technologies
                  </h2>
                  <p className="text-lg text-mute">Intern – RTL / FPGA</p>
                </div>

                <div className="track my-8" />

                <h3 className="text-sm text-faint">Responsibilities and contribution</h3>
                <ul className="mt-5 space-y-4">
                  {responsibilities.map(r => (
                    <li key={r} className="flex gap-4 leading-relaxed text-ink/90">
                      <span aria-hidden className="mt-[0.6em] h-[5px] w-[5px] shrink-0 border border-signal/80" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-wrap gap-2">
                  {["RTL design", "FPGA", "NSGU team", "Decoder side", "Integration"].map(t => (
                    <span key={t} className="border border-metal px-3 py-1 text-[13px] text-mute">{t}</span>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          </Reveal>
        </ol>
      </section>

      <NextPage href="/projects" label="Projects" />
    </>
  );
}
