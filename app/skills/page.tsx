import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import NextPage from "@/components/NextPage";
import Reveal from "@/components/Reveal";
import SpotlightCard from "@/components/SpotlightCard";

export const metadata: Metadata = {
  title: "Skills",
  description: "Technical stack: digital design and RTL, verification, FPGA and embedded systems, ASIC design and EDA, programming and scripting.",
};

type Skill = string | [string, string]; // [name, qualifier]

const groups: { title: string; glyph: keyof typeof glyphs; skills: Skill[]; span?: string }[] = [
  {
    title: "Digital Design and RTL",
    glyph: "dff",
    skills: ["Digital Electronics", "Combinational and Sequential Logic", "Verilog HDL", "RTL Design", "Finite State Machines", "Digital Architecture", "Clock and Reset Design", "FPGA Design"],
  },
  {
    title: "Verification",
    glyph: "wave",
    skills: ["RTL Simulation", "Testbench Development", "Directed Testing", "Randomized Testbench Development", "Functional Verification Fundamentals", "Waveform Debugging", ["QuestaSim", "exposure"], "Verilator", "GTKWave"],
  },
  {
    title: "FPGA and Embedded Systems",
    glyph: "lut",
    skills: ["Xilinx Vivado", "FPGA Implementation", "STM32CubeIDE", "STM32 Microcontrollers", ["Embedded C", "fundamentals"], "I2C and SPI Interfaces", "ADXL345 Sensor Interfacing", "NanoEdge AI Studio"],
  },
  {
    title: "ASIC Design and EDA",
    glyph: "cell",
    skills: [["Cadence Genus", "synthesis"], ["Cadence Tempus", "STA"], ["Cadence Virtuoso", "basic exposure"], "OpenROAD", "SDC Constraints", "Timing Analysis", "Setup and Hold Analysis", "Clock Constraints", "Timing Exceptions", ["Physical Design", "fundamentals"]],
  },
  {
    title: "Programming and Scripting",
    glyph: "code",
    skills: ["Python", ["C", "basic"], ["C++", "basic"], ["Tcl", "learning"], "Linux / Shell Commands", "Git and GitHub"],
  },
  {
    title: "Other Technical Areas",
    glyph: "chip",
    skills: ["Static Timing Analysis", "Digital IC Design", ["Low-Power Digital Design", "fundamentals"], "Embedded Systems", "Memory Architecture", ["High-Speed Interface", "fundamentals"], "FPGA-Based System Design"],
  },
];

/* Small schematic glyphs; their strokes light up on card hover. */
const glyphs = {
  dff: (
    <>
      <rect x="10" y="6" width="24" height="32" />
      <path d="M10 30l5 3-5 3M2 14h8M34 14h8M22 38v4" />
      <text x="13" y="17" fontSize="7" stroke="none" fill="currentColor">D</text>
      <text x="25" y="17" fontSize="7" stroke="none" fill="currentColor">Q</text>
    </>
  ),
  wave: <path d="M2 30h6v-16h8v16h6v-16h8v16h6v-16h6M2 40h40" />,
  lut: (
    <>
      <rect x="6" y="6" width="32" height="32" />
      <path d="M6 14h32M6 22h32M6 30h32M22 6v32M1 10h5M1 26h5M38 22h5" />
    </>
  ),
  cell: (
    <>
      <path d="M4 8h36M4 36h36" />
      <rect x="10" y="12" width="10" height="20" />
      <rect x="24" y="12" width="10" height="20" />
      <path d="M15 8v4M29 32v4" />
    </>
  ),
  code: <path d="M16 12l-10 10 10 10M28 12l10 10-10 10M24 8l-4 28" />,
  chip: (
    <>
      <rect x="10" y="10" width="24" height="24" />
      <rect x="17" y="17" width="10" height="10" />
      <path d="M16 4v6M22 4v6M28 4v6M16 34v6M22 34v6M28 34v6M4 16h6M4 22h6M4 28h6M34 16h6M34 22h6M34 28h6" />
    </>
  ),
};

function Chip({ s }: { s: Skill }) {
  const [name, q] = typeof s === "string" ? [s, null] : s;
  return (
    <li className="inline-flex items-baseline gap-2 border border-metal bg-void/50 px-3 py-1.5 text-[14px] text-ink/90 transition-colors duration-300 hover:border-signal/50">
      {name}
      {q && <span className="text-[12px] text-faint">{q}</span>}
    </li>
  );
}

export default function SkillsPage() {
  return (
    <>
      <PageHeader
        path={[{ label: "skills" }]}
        title="Skills"
        lede="The tools and methods I work with, grouped by discipline. Qualifiers mark where the experience is exposure-level or still being built."
      />

      <section className="frame mt-20 grid gap-6 md:mt-28 md:grid-cols-2" aria-label="Skill groups">
        {groups.map((g, i) => (
          <Reveal key={g.title} delay={(i % 2) * 0.08}>
            <SpotlightCard className="h-full p-7 md:p-8">
              <div className="flex items-start justify-between gap-6">
                <h2 className="font-display text-[1.45rem] font-medium leading-tight tracking-tight text-ink">{g.title}</h2>
                <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden fill="none" stroke="currentColor" strokeWidth="1"
                  className="shrink-0 text-faint transition-colors duration-500 group-hover:text-signal">
                  {glyphs[g.glyph]}
                </svg>
              </div>
              <ul className="mt-7 flex flex-wrap gap-2">
                {g.skills.map(s => <Chip key={typeof s === "string" ? s : s[0]} s={s} />)}
              </ul>
            </SpotlightCard>
          </Reveal>
        ))}
      </section>

      <section className="frame mt-20" aria-labelledby="learning">
        <Reveal>
          <div className="grid gap-8 border border-dashed border-metal p-7 md:grid-cols-12 md:p-10">
            <div className="md:col-span-5">
              <h2 id="learning" className="font-display text-[1.45rem] font-medium tracking-tight text-ink">Currently learning</h2>
              <p className="mt-3 leading-relaxed text-mute">Areas in active study, listed separately from working experience.</p>
            </div>
            <ul className="flex flex-wrap content-start gap-2 md:col-span-7">
              {["SystemVerilog", "UVM"].map(s => (
                <li key={s} className="inline-flex items-center gap-2.5 border border-dashed border-signal/45 px-4 py-2 text-ink/90">
                  <span className="h-[6px] w-[6px] border border-signal" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <NextPage href="/education" label="Education" />
    </>
  );
}
