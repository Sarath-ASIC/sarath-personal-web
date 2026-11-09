"use client";

/**
 * Technical interests as a set of routed taps off a vertical trunk net.
 * Each tap draws in once as it scrolls into view; hover lights the via.
 */
import { motion, useReducedMotion } from "motion/react";

export default function InterestList({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  return (
    <ul className="relative pl-7">
      {/* trunk */}
      <motion.span
        aria-hidden
        className="absolute bottom-3 left-[3px] top-3 w-px origin-top bg-metal"
        initial={reduce ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      />
      {items.map((item, i) => (
        <motion.li
          key={item}
          className="group relative flex items-center py-[0.85rem] text-[1.05rem] text-ink/90 md:text-lg"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.5, delay: 0.25 + i * 0.07 }}
        >
          {/* via on the trunk */}
          <span aria-hidden className="absolute -left-7 top-1/2 h-[7px] w-[7px] -translate-y-1/2 border border-faint bg-void transition-colors duration-300 group-hover:border-signal group-hover:bg-signal" />
          {/* tap wire */}
          <motion.span
            aria-hidden
            className="absolute -left-[17px] top-1/2 h-px w-3 origin-left bg-metal transition-colors duration-300 group-hover:bg-signal"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.3 + i * 0.07 }}
          />
          <span className="transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1">{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}
