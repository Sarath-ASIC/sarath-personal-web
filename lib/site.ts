/**
 * Single source of truth for identity, navigation and external links.
 */

export const site = {
  name: "Sarath K C",
  nameDisplay: "SARATH K C",
  headline: ["RTL DESIGN", "FPGA ENGINEERING", "DIGITAL SYSTEMS"],
  intro:
    "An M.Tech student specializing in VLSI Design and Embedded Systems, interested in developing reliable digital architectures, FPGA-based systems, and high-performance hardware solutions.",
  url: "https://sarath-asic.github.io/sarath-personal-web", // used for SEO metadata, sitemap and robots
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
    href: "https://github.com/Sarath-ASIC",
    handle: "github.com/Sarath-ASIC",
    placeholder: false,
  },
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sarath-k-c-991890226/",
    handle: "linkedin.com/in/sarath-k-c-991890226",
    placeholder: false,
  },
  email: {
    label: "Email",
    href: "mailto:sarathkcofficial@gmail.com",
    handle: "sarathkcofficial@gmail.com",
    placeholder: false,
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
