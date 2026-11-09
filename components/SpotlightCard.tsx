"use client";

/**
 * Card surface with a pointer-tracked spotlight and corner pins (a cell
 * boundary). The spotlight only exists on fine pointers; on touch it's a calm,
 * static card. Pass `href` to make the entire card one link.
 */
import Link from "next/link";
import { useRef } from "react";

export default function SpotlightCard({
  children,
  className = "",
  href,
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const body = (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={`group relative isolate border border-metal/80 bg-substrate/55 backdrop-blur-[2px] transition-colors duration-500 hover:border-signal/40 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(70,210,255,0.07), transparent 65%)" }}
      />
      {(["-left-[3px] -top-[3px]", "-right-[3px] -top-[3px]", "-bottom-[3px] -left-[3px]", "-bottom-[3px] -right-[3px]"] as const).map(pos => (
        <span key={pos} aria-hidden className={`absolute ${pos} h-[5px] w-[5px] bg-faint transition-colors duration-500 group-hover:bg-signal`} />
      ))}
      {children}
    </div>
  );

  if (!href) return body;
  return (
    <Link href={href} aria-label={ariaLabel} className="block focus-visible:outline-offset-[6px]">
      {body}
    </Link>
  );
}
