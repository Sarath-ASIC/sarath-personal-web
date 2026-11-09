"use client";

/**
 * RoutingField — "Living Silicon" background.
 *
 * A Canvas 2D simulation of a detail router working on an abstract die:
 *  - a placement grid with macro blocks (floorplan) on a static offscreen layer
 *  - Manhattan nets on alternating horizontal / vertical layers, vias at bends
 *  - nets are routed in (animated head), live for a while, then rip up and
 *    re-route elsewhere, so the floorplan slowly changes
 *  - signal pulses travel along routed nets
 *  - the pointer acts as a probe: nets near it light up; the whole field
 *    shifts a few pixels for parallax
 *
 * Performance: one canvas, static layer cached, DPR capped at 2, density scaled
 * by viewport area, rAF paused when the tab is hidden. Reduced motion renders a
 * single still frame.
 */

import { useEffect, useRef } from "react";

type P = { x: number; y: number };

type Net = {
  pts: P[]; // pixel polyline (corners only)
  segs: number[]; // segment lengths
  len: number;
  cells: number[]; // occupied grid indices (freed on rip-up)
  state: "routing" | "idle" | "fading";
  progress: number; // routed length (px)
  life: number; // remaining idle time (s)
  alpha: number;
  flash: number; // event-driven illumination 0..1
  glow: number; // smoothed rendered glow
};

type Pulse = { net: Net; s: number; speed: number; trail: number };

const MACRO_NAMES = ["u_tsc64", "u_pps_cap", "u_phase_meas", "u_cxl_rx", "u_addr_map", "u_sched", "u_lp5x_cmd", "u_evt_fifo"];

const COLORS = {
  dot: "rgba(120,150,200,0.07)",
  macroFill: "rgba(26,39,66,0.22)",
  macroStroke: "rgba(80,120,180,0.20)",
  macroLabel: "rgba(135,145,165,0.32)",
  wire: (a: number) => `rgba(95,125,175,${0.21 * a})`,
  signal: (a: number) => `rgba(70,210,255,${a})`,
};

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}
function irand(a: number, b: number) {
  return Math.floor(rand(a, b + 1));
}

export default function RoutingField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduce = reduceMQ.matches;

    // ─── world state ───
    let W = 0, H = 0, dpr = 1;
    let pitch = 26;
    let cols = 0, rows = 0;
    const margin = 32; // world extends beyond viewport so parallax never shows an edge
    let occ = new Uint8Array(0); // 0 free, 1 wire, 2 macro
    let nets: Net[] = [];
    let pulses: Pulse[] = [];
    let targetNets = 40;
    let staticLayer: HTMLCanvasElement | null = null;

    // pointer / parallax
    const mouse = { x: -9999, y: -9999, active: false };
    const par = { x: 0, y: 0 };

    let raf = 0;
    let last = 0;
    let running = false;

    const idx = (c: number, r: number) => r * cols + c;
    const toPx = (c: number, r: number): P => ({ x: c * pitch - margin, y: r * pitch - margin });

    function buildStatic() {
      staticLayer = document.createElement("canvas");
      staticLayer.width = Math.ceil((W + margin * 2) * dpr);
      staticLayer.height = Math.ceil((H + margin * 2) * dpr);
      const s = staticLayer.getContext("2d")!;
      s.scale(dpr, dpr);
      s.translate(margin, margin);

      // placement-grid dots
      s.fillStyle = COLORS.dot;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          if (occ[idx(c, r)] === 2) continue;
          const p = toPx(c, r);
          s.fillRect(p.x - 0.5, p.y - 0.5, 1, 1);
        }
    }

    function placeMacros() {
      const count = W < 700 ? 2 : W < 1200 ? 4 : 5;
      const macros: { c: number; r: number; w: number; h: number }[] = [];
      for (let i = 0, tries = 0; i < count && tries < 200; tries++) {
        const w = irand(5, 11), h = irand(3, 7);
        const c = irand(2, Math.max(2, cols - w - 3));
        const r = irand(2, Math.max(2, rows - h - 3));
        // keep a channel of at least 2 cells between macros
        const clash = macros.some(m => c < m.c + m.w + 3 && c + w + 3 > m.c && r < m.r + m.h + 3 && r + h + 3 > m.r);
        if (clash) continue;
        macros.push({ c, r, w, h });
        i++;
      }
      for (const m of macros)
        for (let r = m.r; r <= m.r + m.h; r++)
          for (let c = m.c; c <= m.c + m.w; c++) occ[idx(c, r)] = 2;
      return macros;
    }

    function drawMacros(macros: { c: number; r: number; w: number; h: number }[]) {
      if (!staticLayer) return;
      const s = staticLayer.getContext("2d")!;
      s.save();
      s.font = `500 9px ${getComputedStyle(document.body).getPropertyValue("--font-geist-mono") || "monospace"}`;
      macros.forEach((m, i) => {
        const a = toPx(m.c, m.r);
        const w = m.w * pitch, h = m.h * pitch;
        s.fillStyle = COLORS.macroFill;
        s.fillRect(a.x, a.y, w, h);
        s.strokeStyle = COLORS.macroStroke;
        s.lineWidth = 1;
        s.strokeRect(a.x + 0.5, a.y + 0.5, w - 1, h - 1);
        // pin ticks along the boundary, like a hard-macro abstract
        s.fillStyle = COLORS.macroStroke;
        for (let x = a.x + 6; x < a.x + w - 4; x += 6) {
          s.fillRect(x, a.y - 2, 1, 2);
          s.fillRect(x, a.y + h, 1, 2);
        }
        // standard-cell-ish row lines inside
        s.strokeStyle = "rgba(80,120,180,0.07)";
        for (let y = a.y + 8; y < a.y + h - 4; y += 8) {
          s.beginPath();
          s.moveTo(a.x + 4, y + 0.5);
          s.lineTo(a.x + w - 4, y + 0.5);
          s.stroke();
        }
        s.fillStyle = COLORS.macroLabel;
        s.fillText(MACRO_NAMES[i % MACRO_NAMES.length], a.x + 6, a.y + 13);
      });
      s.restore();
    }

    /** Route one Manhattan net: alternating H/V segments over free cells. */
    function makeNet(routed: boolean): Net | null {
      for (let attempt = 0; attempt < 24; attempt++) {
        let c = irand(1, cols - 2), r = irand(1, rows - 2);
        if (occ[idx(c, r)] !== 0) continue;
        let horizontal = Math.random() < 0.5;
        const segCount = irand(2, 5);
        const cells: number[] = [idx(c, r)];
        const corners: P[] = [toPx(c, r)];
        const taken = new Set<number>(cells);

        for (let s = 0; s < segCount; s++) {
          const dir = Math.random() < 0.5 ? -1 : 1;
          const want = irand(3, horizontal ? 13 : 8);
          let walked = 0;
          for (let k = 0; k < want; k++) {
            const nc = horizontal ? c + dir : c;
            const nr = horizontal ? r : r + dir;
            if (nc < 1 || nr < 1 || nc > cols - 2 || nr > rows - 2) break;
            const id = idx(nc, nr);
            if (occ[id] !== 0 || taken.has(id)) break;
            c = nc; r = nr; walked++;
            cells.push(id); taken.add(id);
          }
          if (walked < 2) break;
          corners.push(toPx(c, r));
          horizontal = !horizontal; // alternate routing layer direction
        }
        if (corners.length < 3 || cells.length < 7) continue;

        for (const id of cells) occ[id] = 1;
        const segs: number[] = [];
        let len = 0;
        for (let i = 1; i < corners.length; i++) {
          const d = Math.abs(corners[i].x - corners[i - 1].x) + Math.abs(corners[i].y - corners[i - 1].y);
          segs.push(d); len += d;
        }
        return {
          pts: corners, segs, len, cells,
          state: routed ? "idle" : "routing",
          progress: routed ? len : 0,
          life: routed ? rand(4, 26) : rand(10, 24),
          alpha: routed ? 1 : 1,
          flash: 0, glow: 0,
        };
      }
      return null;
    }

    function ripUp(n: Net) {
      for (const id of n.cells) if (occ[id] === 1) occ[id] = 0;
    }

    function init() {
      W = window.innerWidth;
      H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      pitch = W < 640 ? 30 : 26;
      canvas!.width = Math.floor(W * dpr);
      canvas!.height = Math.floor(H * dpr);
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";

      cols = Math.ceil((W + margin * 2) / pitch) + 1;
      rows = Math.ceil((H + margin * 2) / pitch) + 1;
      occ = new Uint8Array(cols * rows);
      nets = [];
      pulses = [];

      const macros = placeMacros();
      buildStatic();
      drawMacros(macros);

      targetNets = Math.round(Math.min(95, Math.max(16, (W * H) / (pitch * pitch * 34))));
      for (let i = 0; i < targetNets; i++) {
        const n = makeNet(true);
        if (n) nets.push(n);
      }
      if (reduce) {
        // a still composition: a few nets highlighted
        nets.slice(0, Math.ceil(nets.length * 0.12)).forEach(n => (n.glow = 0.55));
      }
    }

    /** Stroke the sub-path of a net between arc-lengths a..b. */
    function tracePartial(n: Net, a: number, b: number) {
      a = Math.max(0, a); b = Math.min(n.len, b);
      if (b <= a) return;
      let acc = 0;
      let started = false;
      for (let i = 0; i < n.segs.length; i++) {
        const p0 = n.pts[i], p1 = n.pts[i + 1], L = n.segs[i];
        const s0 = acc, s1 = acc + L;
        acc = s1;
        if (s1 < a) continue;
        if (s0 > b) break;
        const t0 = Math.max(0, (a - s0) / L), t1 = Math.min(1, (b - s0) / L);
        const x0 = p0.x + (p1.x - p0.x) * t0, y0 = p0.y + (p1.y - p0.y) * t0;
        const x1 = p0.x + (p1.x - p0.x) * t1, y1 = p0.y + (p1.y - p0.y) * t1;
        if (!started) { ctx!.moveTo(x0, y0); started = true; }
        ctx!.lineTo(x1, y1);
      }
    }

    function pointAt(n: Net, s: number): P {
      let acc = 0;
      for (let i = 0; i < n.segs.length; i++) {
        const L = n.segs[i];
        if (acc + L >= s) {
          const t = (s - acc) / L, p0 = n.pts[i], p1 = n.pts[i + 1];
          return { x: p0.x + (p1.x - p0.x) * t, y: p0.y + (p1.y - p0.y) * t };
        }
        acc += L;
      }
      return n.pts[n.pts.length - 1];
    }

    function distToNet(n: Net, x: number, y: number) {
      let best = Infinity;
      for (let i = 0; i < n.segs.length; i++) {
        const a = n.pts[i], b = n.pts[i + 1];
        // segments are axis-aligned: clamp then measure
        const cx = Math.min(Math.max(x, Math.min(a.x, b.x)), Math.max(a.x, b.x));
        const cy = Math.min(Math.max(y, Math.min(a.y, b.y)), Math.max(a.y, b.y));
        const d = Math.hypot(x - cx, y - cy);
        if (d < best) best = d;
      }
      return best;
    }

    function step(dt: number) {
      // parallax towards pointer (inverse, a few px)
      const tx = mouse.active ? (mouse.x - W / 2) * -0.012 : 0;
      const ty = mouse.active ? (mouse.y - H / 2) * -0.012 : 0;
      par.x += (tx - par.x) * Math.min(1, dt * 3);
      par.y += (ty - par.y) * Math.min(1, dt * 3);

      const mx = mouse.x - par.x, my = mouse.y - par.y;
      const R = 170;

      for (const n of nets) {
        if (n.state === "routing") {
          n.progress += dt * 420;
          if (n.progress >= n.len) { n.progress = n.len; n.state = "idle"; n.flash = 0.9; }
        } else if (n.state === "idle") {
          n.life -= dt;
          if (n.life <= 0) n.state = "fading";
          // occasional illumination of an established connection
          if (Math.random() < dt * 0.025) n.flash = 1;
          if (Math.random() < dt * 0.06 && pulses.length < 26) {
            pulses.push({ net: n, s: 0, speed: rand(160, 320), trail: rand(28, 60) });
          }
        } else {
          n.alpha -= dt * 0.8;
        }
        n.flash = Math.max(0, n.flash - dt * 0.7);
        const prox = mouse.active ? Math.max(0, 1 - distToNet(n, mx, my) / R) : 0;
        const target = Math.max(n.flash * 0.85, prox * prox * 0.9);
        n.glow += (target - n.glow) * Math.min(1, dt * 6);
      }

      // rip-up dead nets, route replacements
      for (let i = nets.length - 1; i >= 0; i--) {
        if (nets[i].alpha <= 0) { ripUp(nets[i]); nets.splice(i, 1); }
      }
      if (nets.length < targetNets && Math.random() < dt * 4) {
        const n = makeNet(false);
        if (n) nets.push(n);
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.s += p.speed * dt;
        if (p.s - p.trail > p.net.len || p.net.state === "fading") pulses.splice(i, 1);
      }
    }

    function draw() {
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.fillStyle = "#05070b";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx!.setTransform(dpr, 0, 0, dpr, par.x * dpr, par.y * dpr);

      if (staticLayer) ctx!.drawImage(staticLayer, -margin, -margin, W + margin * 2, H + margin * 2);

      ctx!.lineCap = "square";
      ctx!.lineJoin = "miter";

      // base wires
      ctx!.lineWidth = 1;
      for (const n of nets) {
        ctx!.strokeStyle = COLORS.wire(Math.max(0, n.alpha));
        ctx!.beginPath();
        tracePartial(n, 0, n.progress);
        ctx!.stroke();
      }

      // vias + pins (only on fully routed portions)
      for (const n of nets) {
        const a = Math.max(0, n.alpha);
        let acc = 0;
        for (let i = 0; i < n.pts.length; i++) {
          if (i > 0) acc += n.segs[i - 1];
          if (acc > n.progress) break;
          const p = n.pts[i];
          const end = i === 0 || i === n.pts.length - 1;
          const lit = n.glow > 0.05;
          if (end) {
            ctx!.fillStyle = lit ? COLORS.signal(0.35 + n.glow * 0.6) : `rgba(120,150,200,${0.28 * a})`;
            ctx!.fillRect(p.x - 2, p.y - 2, 4, 4);
          } else {
            ctx!.strokeStyle = lit ? COLORS.signal(0.25 + n.glow * 0.5) : `rgba(120,150,200,${0.22 * a})`;
            ctx!.strokeRect(p.x - 2, p.y - 2, 4, 4);
          }
        }
      }

      // illuminated nets: soft halo + crisp core
      for (const n of nets) {
        if (n.glow < 0.02) continue;
        const a = n.glow * Math.max(0, n.alpha);
        ctx!.beginPath();
        tracePartial(n, 0, n.progress);
        ctx!.lineWidth = 4;
        ctx!.strokeStyle = COLORS.signal(a * 0.1);
        ctx!.stroke();
        ctx!.lineWidth = 1;
        ctx!.strokeStyle = COLORS.signal(a * 0.75);
        ctx!.stroke();
      }

      // routing heads
      for (const n of nets) {
        if (n.state !== "routing") continue;
        ctx!.beginPath();
        tracePartial(n, n.progress - 70, n.progress);
        ctx!.lineWidth = 1.25;
        ctx!.strokeStyle = COLORS.signal(0.85);
        ctx!.stroke();
        const h = pointAt(n, n.progress);
        ctx!.fillStyle = COLORS.signal(1);
        ctx!.fillRect(h.x - 1.5, h.y - 1.5, 3, 3);
      }

      // signal pulses
      for (const p of pulses) {
        ctx!.beginPath();
        tracePartial(p.net, p.s - p.trail, p.s);
        ctx!.lineWidth = 1.5;
        ctx!.strokeStyle = COLORS.signal(0.7);
        ctx!.stroke();
        if (p.s <= p.net.len) {
          const h = pointAt(p.net, p.s);
          ctx!.fillStyle = COLORS.signal(1);
          ctx!.fillRect(h.x - 1.5, h.y - 1.5, 3, 3);
        }
      }
    }

    function loop(t: number) {
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
      last = t;
      step(dt);
      draw();
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    init();
    if (reduce) draw(); else start();

    // ─── events ───
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // no probe on touch; keeps mobile calm
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; };
    let resizeT: ReturnType<typeof setTimeout>;
    let lastW = window.innerWidth;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        // ignore height-only changes on mobile (URL bar show/hide)
        if (window.innerWidth === lastW && Math.abs(window.innerHeight - H) < 120) return;
        lastW = window.innerWidth;
        init();
        if (reduce) draw();
      }, 180);
    };
    const onVis = () => (document.hidden ? stop() : start());
    const onReduce = (e: MediaQueryListEvent) => {
      reduce = e.matches;
      if (reduce) { stop(); init(); draw(); } else start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    reduceMQ.addEventListener("change", onReduce);

    return () => {
      stop();
      clearTimeout(resizeT);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      reduceMQ.removeEventListener("change", onReduce);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div className="scrim absolute inset-0" />
    </div>
  );
}
