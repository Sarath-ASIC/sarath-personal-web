"use client";

/**
 * Route transition. App Router re-mounts template.tsx on every navigation, so
 * the entry animation plays per page (including back/forward). A single
 * scan line sweeps the viewport — the "reprobe" moment — while content settles.
 */
import { motion, useReducedMotion } from "motion/react";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[45] h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(70,210,255,.9) 30%, rgba(70,210,255,.9) 70%, transparent)" }}
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: "100vh", opacity: 0 }}
        transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      >
        {children}
      </motion.div>
    </>
  );
}
