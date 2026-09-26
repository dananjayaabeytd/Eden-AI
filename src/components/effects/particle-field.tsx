"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type Particle = { x: number; y: number; vx: number; vy: number; r: number; color: string };

type ParticleFieldProps = {
  className?: string;
  /** Particles per 10,000 px² of canvas. */
  density?: number;
  /** Max distance (px) at which particles link up. */
  linkDistance?: number;
};

// Mostly neutral greys with a few soft accents that echo the photography.
const PALETTE = [
  "120 120 120",
  "150 150 150",
  "90 90 90",
  "120 120 120",
  "249 115 22", // orange
  "236 72 153", // pink
  "139 92 246", // violet
  "6 182 212", // cyan
];

const MOUSE_RADIUS = 140;

/**
 * Interactive constellation of drifting particles that link up and gently
 * scatter away from the cursor. Pure canvas, no dependencies.
 * Pauses off-screen / in background tabs and renders a single static frame
 * for users who prefer reduced motion.
 */
export function ParticleField({ className, density = 0.9, linkDistance = 120 }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(160, Math.round(((width * height) / 10_000) * density));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      }));
      if (reduceMotion) draw();
    };

    const step = () => {
      for (const p of particles) {
        // Ease away from the cursor.
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * 0.6;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        // Friction back to a slow drift.
        p.vx = p.vx * 0.96 + (Math.random() - 0.5) * 0.02;
        p.vy = p.vy * 0.96 + (Math.random() - 0.5) * 0.02;
        p.x += p.vx;
        p.y += p.vy;
        // Wrap around the edges.
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const maxSq = linkDistance * linkDistance;

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dSq = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
          if (dSq < maxSq) {
            ctx.strokeStyle = `rgb(140 140 140 / ${(1 - dSq / maxSq) * 0.22})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // Links to the cursor make the field feel alive.
        const mSq = (a.x - mouse.x) ** 2 + (a.y - mouse.y) ** 2;
        if (mSq < maxSq * 1.6) {
          ctx.strokeStyle = `rgb(${a.color} / ${(1 - mSq / (maxSq * 1.6)) * 0.45})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      for (const p of particles) {
        ctx.fillStyle = `rgb(${p.color} / 0.75)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      step();
      draw();
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduceMotion || frame || !visible || document.hidden) return;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    intersectionObserver.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, linkDistance]);

  return <canvas ref={canvasRef} aria-hidden className={cn("pointer-events-none absolute inset-0 size-full", className)} />;
}
