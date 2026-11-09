import Link from "next/link";

/** End-of-page continuation link, following the navigation order. */
export default function NextPage({ href, label, note }: { href: string; label: string; note?: string }) {
  return (
    <div className="frame mt-32">
      <Link href={href} className="group block border-t border-metal/70 pt-8">
        <span className="text-sm text-faint">Next{note ? ` — ${note}` : ""}</span>
        <span className="mt-2 flex items-center gap-5 font-display text-[clamp(2rem,5vw,3.75rem)] font-medium leading-none tracking-tight text-mute transition-colors duration-300 group-hover:text-ink">
          {label}
          <svg width="56" height="14" viewBox="0 0 56 14" aria-hidden className="shrink-0 text-signal">
            <path d="M0 7h48" stroke="currentColor" strokeWidth="1" className="origin-left scale-x-50 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100" />
            <rect x="48.5" y="3.5" width="7" height="7" fill="none" stroke="currentColor" />
          </svg>
        </span>
      </Link>
    </div>
  );
}
