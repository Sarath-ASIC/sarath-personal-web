"use client";

/**
 * Contact interaction: direct channels plus a short compose form that opens the
 * visitor's email app with the message prefilled (no backend required).
 */
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { links } from "@/lib/site";

const address = links.email.href.replace(/^mailto:/, "");

export default function ContactPanel() {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the address stays visible to copy manually */
    }
  }

  function compose(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Hello from ${name || "your portfolio"}`);
    const body = encodeURIComponent(msg);
    window.location.href = `mailto:${address}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  const channels = [links.linkedin, links.github, links.email];

  return (
    <div className="grid gap-16 lg:grid-cols-12">
      <ul className="min-w-0 lg:col-span-6">
        {channels.map(l => {
          const isMail = l.href.startsWith("mailto:");
          return (
            <li key={l.label} className="border-b border-metal/60 first:border-t">
              <div className="group flex items-center justify-between gap-6 py-6">
                <a
                  href={l.href}
                  {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  className="min-w-0 flex-1"
                >
                  <span className="flex items-center gap-3 text-sm text-faint">
                    {l.label}
                    {l.placeholder && (
                      <span className="border border-dashed border-faint px-1.5 py-px font-mono text-[10px] leading-tight">placeholder</span>
                    )}
                  </span>
                  <span className="mt-1 block truncate font-display text-[clamp(1.25rem,2.4vw,1.75rem)] tracking-tight text-mute transition-colors duration-300 group-hover:text-ink">
                    {l.handle}
                  </span>
                </a>
                <div className="flex shrink-0 items-center gap-3">
                  {isMail ? (
                    <button
                      type="button"
                      onClick={copy}
                      className="relative h-9 min-w-[72px] border border-metal px-3 text-[13px] text-mute transition-colors hover:border-signal/60 hover:text-ink"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span key={copied ? "c" : "n"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }} className="block">
                          {copied ? "Copied" : "Copy"}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                  ) : (
                    <span aria-hidden className="h-[7px] w-[7px] border border-faint transition-colors duration-300 group-hover:border-signal group-hover:bg-signal" />
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <form onSubmit={compose} className="min-w-0 lg:col-span-6" aria-label="Write a message">
        <h2 className="font-display text-xl font-medium tracking-tight text-ink">Write a message</h2>
        <p className="mt-2 text-[14px] text-mute">Opens your email app with the message ready to send.</p>
        <label className="mt-8 block">
          <span className="text-sm text-faint">Your name</span>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
            className="mt-2 block w-full border-0 border-b border-metal bg-transparent px-0 py-3 text-lg text-ink outline-none transition-colors placeholder:text-faint focus:border-signal focus-visible:outline-none"
            placeholder="Name"
          />
        </label>
        <label className="mt-8 block">
          <span className="text-sm text-faint">Message</span>
          <textarea
            required
            value={msg}
            onChange={e => setMsg(e.target.value)}
            rows={4}
            className="mt-2 block w-full resize-none border-0 border-b border-metal bg-transparent px-0 py-3 text-lg text-ink outline-none transition-colors placeholder:text-faint focus:border-signal focus-visible:outline-none"
            placeholder="What would you like to discuss?"
          />
        </label>
        <div className="mt-10 flex flex-wrap items-center gap-5">
          <button
            type="submit"
            className="group relative inline-flex h-12 items-center border border-signal/50 px-6 text-[15px] text-ink transition-colors duration-300 hover:border-signal hover:bg-signal/[0.06]"
          >
            <span aria-hidden className="absolute -left-[3px] -top-[3px] h-[5px] w-[5px] bg-signal" />
            <span aria-hidden className="absolute -bottom-[3px] -right-[3px] h-[5px] w-[5px] bg-signal" />
            Open in email app
          </button>
          <span className="text-[13px] text-faint" aria-live="polite">
            {sent ? "Your email app should open with the message filled in." : ""}
          </span>
        </div>
      </form>
    </div>
  );
}
