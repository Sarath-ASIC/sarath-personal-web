import Link from "next/link";

export default function NotFound() {
  return (
    <section className="frame flex min-h-[80dvh] flex-col justify-center pt-24">
      <p className="font-mono text-sm text-faint">Error: net unrouted — no driver for this path.</p>
      <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,5rem)] font-medium leading-none tracking-tight">Page not found</h1>
      <p className="mt-6 text-mute">The address doesn&apos;t match any page on this site.</p>
      <Link href="/" className="netlink mt-10 w-fit text-ink">Return home</Link>
    </section>
  );
}
