"use client";

/**
 * Home hero — the site's one orchestrated load sequence:
 * the name is "routed" onto the page left→right behind a scanning head,
 * then the headline, intro and actions settle in.
 */
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { links, site } from "@/lib/site";
import ExtLink from "./ExtLink";

const ease = [0.22, 1, 0.36, 1] as const;

function NameLine({ text, delay, reduce }: { text: string; delay: number; reduce: boolean | null }) {
  if (reduce) return <span className="block">{text}</span>;
  return (
    <span className="relative block w-fit">
      <motion.span
        className="block"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 1.05, ease: [0.65, 0, 0.35, 1], delay }}
      >
        {text}
      </motion.span>
      {/* scanning head riding the clip edge */}
      <motion.span
        aria-hidden
        className="absolute bottom-[8%] top-[8%] w-px bg-signal"
        style={{ boxShadow: "0 0 18px 2px rgba(70,210,255,.45)" }}
        initial={{ left: "0%", opacity: 1 }}
        animate={{ left: "100%", opacity: [1, 1, 0] }}
        transition={{ duration: 1.05, ease: [0.65, 0, 0.35, 1], delay, opacity: { times: [0, 0.85, 1], duration: 1.25, delay } }}
      />
    </span>
  );
}

export default function HomeHero() {
  const reduce = useReducedMotion();
  const fade = (d: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease, delay: d } };

  return (
    <section className="frame flex min-h-[100svh] flex-col justify-end pb-14 pt-32 md:justify-center md:pb-24">
      <h1
        aria-label={site.nameDisplay}
        className="font-display font-medium uppercase leading-[0.86] tracking-[-0.045em] text-ink text-[clamp(4.2rem,21vw,7rem)] md:text-[clamp(6rem,12.4vw,11.25rem)]"
      >
        {/* Stacked on small screens, one line from md up */}
        <span className="md:hidden" aria-hidden>
          <NameLine text="SARATH" delay={0.15} reduce={reduce} />
          <NameLine text="K C" delay={0.5} reduce={reduce} />
        </span>
        <span className="hidden md:block" aria-hidden>
          <NameLine text={site.nameDisplay} delay={0.15} reduce={reduce} />
        </span>
      </h1>

      <motion.p
        {...fade(1.0)}
        aria-label={site.headline.join(" | ")}
        className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-[11.5px] font-medium tracking-[0.08em] sm:gap-x-4 sm:text-[13px] sm:tracking-[0.14em] text-ink/90 md:mt-10 md:text-[15px]"
      >
        {site.headline.map((h, i) => (
          <span key={h} className="flex items-center gap-3 sm:gap-4" aria-hidden>
            {i > 0 && <span className="h-3.5 w-px bg-signal/70" />}
            {h}
          </span>
        ))}
      </motion.p>

      <motion.p {...fade(1.15)} className="mt-6 max-w-[52ch] text-[1.05rem] leading-relaxed text-mute md:text-lg">
        {site.intro}
      </motion.p>

      <motion.div {...fade(1.3)} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
        <Link
          href="/projects"
          className="group relative inline-flex h-12 items-center gap-3 border border-signal/50 px-6 text-[15px] text-ink transition-colors duration-300 hover:border-signal hover:bg-signal/[0.06]"
        >
          {/* pin squares at the corners, like a cell boundary */}
          <span aria-hidden className="absolute -left-[3px] -top-[3px] h-[5px] w-[5px] bg-signal transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
          <span aria-hidden className="absolute -bottom-[3px] -right-[3px] h-[5px] w-[5px] bg-signal transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          Explore projects
        </Link>
        <Link href="/about" className="netlink text-[15px] text-ink/90">
          About me
        </Link>
        <span className="hidden h-4 w-px bg-metal sm:block" aria-hidden />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px]">
          <ExtLink link={links.github} />
          <ExtLink link={links.linkedin} />
        </div>
      </motion.div>

      <motion.div {...fade(1.5)} className="mt-16 grid gap-px border-t border-metal/60 pt-6 text-sm sm:grid-cols-2 md:mt-24">
        <Link href="/experience" className="group flex items-baseline gap-3 py-1 text-mute transition-colors hover:text-ink">
          <span className="relative top-[-1px] h-1.5 w-1.5 shrink-0 bg-signal" aria-hidden />
          <span>Intern, RTL / FPGA at KriSemi Design Technologies</span>
        </Link>
        <Link href="/projects/chronosynch64" className="group flex items-baseline gap-3 py-1 text-mute transition-colors hover:text-ink">
          <span className="relative top-[-1px] h-1.5 w-1.5 shrink-0 border border-signal" aria-hidden />
          <span>Building ChronoSynch64, a GPS-disciplined timing architecture</span>
        </Link>
      </motion.div>
    </section>
  );
}
