import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import InterestList from "@/components/InterestList";
import NextPage from "@/components/NextPage";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "M.Tech student in VLSI Design and Embedded Systems with interests in RTL design, FPGA development, digital architecture and hardware engineering.",
};

const interests = [
  "Digital design and RTL development",
  "FPGA-based hardware implementation",
  "Digital system architecture",
  "Static Timing Analysis",
  "Functional verification",
  "Memory architectures and high-speed interfaces",
  "Hardware acceleration",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader path={[{ label: "about" }]} title="Digital hardware, built from the RTL up." />

      <section className="frame mt-20 grid gap-16 md:mt-28 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-7">
          <p className="font-display text-[clamp(1.55rem,2.6vw,2.2rem)] font-normal leading-[1.28] tracking-[-0.015em] text-ink">
            I am an M.Tech student specializing in VLSI Design and Embedded Systems, with an interest in RTL design,
            FPGA development, digital architecture, and hardware engineering.
          </p>
          <div className="mt-10 grid gap-6 border-t border-metal/60 pt-8 text-mute sm:grid-cols-2">
            <div>
              <h2 className="text-sm text-faint">Studying</h2>
              <p className="mt-2 leading-relaxed">M.Tech, VLSI Design and Embedded Systems, R V College of Engineering, Bengaluru</p>
            </div>
            <div>
              <h2 className="text-sm text-faint">Currently</h2>
              <p className="mt-2 leading-relaxed">Intern, RTL / FPGA at KriSemi Design Technologies</p>
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-5 lg:pl-8">
          <h2 className="mb-4 font-display text-xl font-medium tracking-tight text-ink">Technical interests</h2>
          <InterestList items={interests} />
        </div>
      </section>

      <NextPage href="/experience" label="Experience" />
    </>
  );
}
