import type { ExternalLink } from "@/lib/site";

/** External link that visibly flags placeholder URLs until real ones are set. */
export default function ExtLink({ link, showHandle = false, className = "" }: { link: ExternalLink; showHandle?: boolean; className?: string }) {
  const isMail = link.href.startsWith("mailto:");
  return (
    <a
      href={link.href}
      {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      className={`netlink inline-flex items-baseline gap-2 text-mute ${className}`}
      title={link.placeholder ? `${link.label}: placeholder — replace in lib/site.ts` : link.label}
    >
      <span>{showHandle ? link.handle : link.label}</span>
      {link.placeholder && (
        <span className="border border-dashed border-faint px-1.5 py-px font-mono text-[10px] leading-none text-faint">
          placeholder
        </span>
      )}
    </a>
  );
}
