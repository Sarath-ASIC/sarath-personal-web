import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import NextPage from "@/components/NextPage";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Education",
  description: "M.Tech in VLSI Design and Embedded Systems, R V College of Engineering (RVCE), Bengaluru.",
};

export default function EducationPage() {
  return (
    <>
      <PageHeader path={[{ label: "education" }]} title="Education" />

      <section className="frame mt-20 md:mt-28" aria-label="Education timeline">
        <ol className="relative">
          <span aria-hidden className="absolute bottom-0 left-[5px] top-3 w-px bg-gradient-to-b from-signal/70 via-metal to-transparent" />
          <Reveal as="li" className="relative pl-12 md:pl-20">
            <span aria-hidden className="absolute left-0 top-3 flex h-[11px] w-[11px] items-center justify-center border border-signal bg-void">
              <span className="h-[5px] w-[5px] bg-signal" />
            </span>

            <p className="text-sm text-signal">Current</p>
            <h2 className="mt-3 max-w-[20ch] font-display text-[clamp(2rem,4.6vw,3.6rem)] font-medium leading-[1] tracking-[-0.03em] text-ink">
              Master of Technology (M.Tech)
            </h2>

            <dl className="mt-10 grid max-w-4xl gap-px bg-metal/60 sm:grid-cols-3">
              {[
                ["Specialization", "VLSI Design and Embedded Systems"],
                ["Institution", "R V College of Engineering (RVCE), Bengaluru"],
                ["Department", "Electronics and Communication Engineering"],
              ].map(([k, v]) => (
                <div key={k} className="bg-void/90 p-6">
                  <dt className="text-[13px] text-faint">{k}</dt>
                  <dd className="mt-2 leading-snug text-ink/90">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </ol>
      </section>

      <NextPage href="/contact" label="Contact" />
    </>
  );
}
