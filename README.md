# Sarath K C — Portfolio

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · Motion · Canvas/SVG

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Before deploying — replace placeholders

All external links live in `lib/site.ts`. Each is flagged `placeholder: true`,
which renders a visible "placeholder" tag on the site. Set the real URL and flip
the flag to `false`:

- `links.github`, `links.linkedin`, `links.email`
- `site.url` (production domain, used for SEO metadata, sitemap and robots)

## Routes

| URL | Page |
| --- | --- |
| `/` | Home |
| `/about` | About |
| `/experience` | Experience (KriSemi Design Technologies) |
| `/projects` | Projects index (featured + under development) |
| `/projects/chronosynch64` | ChronoSynch64 project page |
| `/projects/cxl-lpddr5x` | CXL-to-LPDDR5X project page |
| `/skills` | Skills |
| `/education` | Education |
| `/contact` | Contact |

## Structure

- `components/RoutingField.tsx` — animated routing background (Canvas 2D): macro
  floorplan, Manhattan nets with vias, rip-up/re-route, signal pulses, pointer
  probe and parallax. Respects `prefers-reduced-motion`; pauses when the tab is hidden.
- `app/template.tsx` — per-route transition (scan line + content settle).
- `components/ChronoDiagram.tsx` — interactive block diagram; data in `lib/chrono.ts`.
- `components/PpsTicker.tsx` — PPS capture illustration (nominal-rate simulation).
- `components/CxlFlow.tsx` — CXL.mem → LPDDR5X data-flow animation.

GSAP is intentionally not included: Motion covers every animation here, and
adding a second animation runtime would cost bundle size without a visible gain.
