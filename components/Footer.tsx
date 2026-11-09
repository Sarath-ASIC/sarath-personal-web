import Link from "next/link";
import { links, site } from "@/lib/site";
import ExtLink from "./ExtLink";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-32 border-t border-metal/60">
      <div className="frame flex flex-col gap-6 py-10 text-sm text-mute md:flex-row md:items-center md:justify-between">
        <p>
          {site.name} — M.Tech, VLSI Design and Embedded Systems, RVCE Bengaluru
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <ExtLink link={links.github} />
          <ExtLink link={links.linkedin} />
          <Link href="/contact" className="netlink text-mute">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
