import type { NextConfig } from "next";

/**
 * Two deploy targets from one codebase:
 *  - Vercel (default): full Next.js, no extra config.
 *  - GitHub Pages: GITHUB_PAGES=true is set in the workflow.
 *    Produces a static export in ./out, served under /<repo-name>/.
 */
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "sarath-personal-web"; // must match the GitHub repository name

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isPages && {
    output: "export",
    basePath: `/${repo}`,
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
