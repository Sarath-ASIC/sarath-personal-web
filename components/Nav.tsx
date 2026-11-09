"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  // Close the mobile menu whenever the route changes
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-substrate focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || open
            ? "border-b border-metal/70 bg-void/70 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <div className="frame flex h-16 items-center justify-between md:h-[72px]">
          <Link href="/" className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
            {/* Mark: a via with two routed stubs */}
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden className="text-signal">
              <path d="M1 11h6M15 11h6M11 1v6" stroke="currentColor" strokeOpacity=".5" strokeWidth="1" />
              <rect x="7.5" y="7.5" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.25" />
              <rect x="9.75" y="9.75" width="2.5" height="2.5" fill="currentColor" className="transition-transform duration-500 group-hover:scale-150 origin-center [transform-box:fill-box]" />
            </svg>
            <span className="font-display text-[15px] font-medium tracking-tight text-ink">{site.name}</span>
          </Link>

          {/* Desktop */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.slice(1).map(item => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative block px-3.5 py-2 text-[14px] transition-colors duration-300 ${
                        active ? "text-ink" : "text-mute hover:text-ink"
                      }`}
                    >
                      {item.label}
                      {active && (
                        <motion.span
                          layoutId="nav-indicator"
                          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                          className="absolute inset-x-3.5 -bottom-[1px] flex items-center"
                          aria-hidden
                        >
                          <span className="h-px flex-1 bg-signal/70" />
                          <span className="h-[5px] w-[5px] bg-signal" />
                          <span className="h-px flex-1 bg-signal/70" />
                        </motion.span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            className="relative -mr-2 flex h-11 items-center gap-3 px-2 text-sm text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(v => !v)}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className="relative block h-3 w-5" aria-hidden>
              <span className={`absolute left-0 top-0 h-px w-5 bg-ink transition-transform duration-300 ${open ? "translate-y-[6px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px bg-ink transition-all duration-300 ${open ? "w-5 -translate-y-[5px] -rotate-45" : "w-3"}`} />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-40 bg-void/95 backdrop-blur-lg lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Mobile" className="frame flex h-full flex-col justify-center pb-10 pt-24">
              <ul className="space-y-1">
                {nav.map((item, i) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reduce ? 0 : 0.12 + i * 0.045, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-4 py-2 font-display text-[2.4rem] leading-none tracking-tight ${
                          active ? "text-ink" : "text-mute"
                        }`}
                      >
                        <span className={`h-2 w-2 ${active ? "bg-signal" : "border border-faint"}`} aria-hidden />
                        {item.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
