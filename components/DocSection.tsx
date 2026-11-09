/** Section of a long-form project page, anchored for the contents list. */
export default function DocSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28 border-t border-metal/60 pt-10 [&+&]:mt-20">
      <h2 id={`${id}-h`} className="font-display text-[clamp(1.6rem,2.8vw,2.2rem)] font-medium tracking-[-0.02em] text-ink">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}
