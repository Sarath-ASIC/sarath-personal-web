/**
 * Page header. The small path line is a breadcrumb in hierarchy-path form
 * (it encodes where the page sits), not a decorative eyebrow.
 */
import Link from "next/link";

export default function PageHeader({
  path,
  title,
  lede,
  children,
}: {
  path: { label: string; href?: string }[];
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="frame pt-36 md:pt-44">
      <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[12px] text-faint">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-mute">top</Link></li>
          {path.map(p => (
            <li key={p.label} className="flex items-center gap-1.5">
              <span aria-hidden>/</span>
              {p.href ? <Link href={p.href} className="hover:text-mute">{p.label}</Link> : <span className="text-mute" aria-current="page">{p.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <h1 className="max-w-[18ch] font-display text-[clamp(2.6rem,7vw,5.75rem)] font-medium leading-[0.95] tracking-[-0.035em] text-ink">
        {title}
      </h1>
      {lede && <div className="measure mt-8 text-[1.075rem] leading-relaxed text-mute md:text-lg">{lede}</div>}
      {children}
    </header>
  );
}
