"use client";

/** Sticky contents list that tracks the section in view. */
import { useEffect, useState } from "react";

export default function Toc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    items.forEach(i => {
      const el = document.getElementById(i.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-28">
      <p className="mb-4 text-sm text-faint">On this page</p>
      <ul className="relative border-l border-metal">
        {items.map(i => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className={`relative -ml-px block border-l py-1.5 pl-4 text-[14px] transition-colors duration-300 ${
                active === i.id ? "border-signal text-ink" : "border-transparent text-mute hover:text-ink"
              }`}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
