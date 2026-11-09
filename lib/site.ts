/**
 * Single source of truth for identity, navigation and external links.
 *
 * PLACEHOLDERS: every value flagged `placeholder: true` must be replaced with
 * the real URL / address before deployment. The UI renders a visible
 * "placeholder" marker next to these links until the flag is set to false.
 */

export const site = {
  name: "Sarath K C",
  nameDisplay: "SARATH K C",
  headline: ["RTL DESIGN", "FPGA ENGINEERING", "DIGITAL SYSTEMS"],
  intro:
    "An M.Tech student specializing in VLSI Design and Embedded Systems, interested in developing reliable digital architectures, FPGA-based systems, and high-performance hardware solutions.",
  url: "https://example.com", // PLACEHOLDER: production domain (used for SEO metadata)
  description:
    "Portfolio of Sarath K C — M.Tech, VLSI Design and Embedded Systems, RVCE Bengaluru. RTL design, FPGA engineering and digital systems.",
} as const;

export type ExternalLink = {
  label: string;
  href: string;
  handle: string;
  placeholder: boolean;
};

export const links: Record<"github" | "linkedin" | "email", ExternalLink> = {
  github: {
    label: "GitHub",
    href: "https://github.com/your-username", // PLACEHOLDER
    handle: "github.com/your-username",
    placeholder: true,
  },
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/your-profile", // PLACEHOLDER
    handle: "linkedin.com/in/your-profile",
    placeholder: true,
  },
  email: {
    label: "Email",
    href: "mailto:your.email@example.com", // PLACEHOLDER
    handle: "your.email@example.com",
    placeholder: true,
  },
};

/** Order matters: Experience follows About, as specified. */
export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/education", label: "Education" },
  { href: "/contact", label: "Contact" },
] as const;
