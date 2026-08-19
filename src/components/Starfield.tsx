import { memo, useEffect, useRef } from "react";
import { TAU } from "../data/bodies";

interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
  sp: number;
  ph: number;
  vx: number;
  c: string;
}

interface Shooter {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const STAR_COLORS = ["#e9edfb", "#e9edfb", "#cfe0ff", "#ffe9c9", "#ffffff"];

/** Full-viewport canvas: drifting twinkling stars + occasional meteors. */
export const Starfield = memo(function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let shooter: Shooter | null = null;
    let nextShoot = 3.5;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(110, Math.min(280, Math.round((w * h) / 5200)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.85 ? 0.5 + Math.random() * 0.8 : 1.3 + Math.random() * 0.9,
        a: 0.25 + Math.random() * 0.6,
        sp: 0.4 + Math.random() * 1.6,
        ph: Math.random() * TAU,
        vx: (Math.random() - 0.5) * 2.4,
        c: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = performance.now();
    let t = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        ctx.globalAlpha = reduced ? s.a : s.a * (0.55 + 0.45 * Math.sin(t * s.sp + s.ph));
        ctx.fillStyle = s.c;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, TAU);
        ctx.fill();
        if (!reduced) {
          s.x += s.vx * dt;
          if (s.x > w + 3) s.x = -3;
          else if (s.x < -3) s.x = w + 3;
        }
      }

      if (!reduced) {
        nextShoot -= dt;
        if (!shooter && nextShoot <= 0) {
          shooter = {
            x: w * (0.12 + Math.random() * 0.7),
            y: h * Math.random() * 0.35,
            vx: 360 + Math.random() * 280,
            vy: 130 + Math.random() * 130,
            life: 0,
          };
          nextShoot = 5 + Math.random() * 7;
        }
        if (shooter) {
          shooter.life += dt;
          shooter.x += shooter.vx * dt;
          shooter.y += shooter.vy * dt;
          const fade = Math.max(0, 1 - shooter.life / 0.9);
          const tailX = shooter.x - shooter.vx * 0.16;
          const tailY = shooter.y - shooter.vy * 0.16;
          const grad = ctx.createLinearGradient(shooter.x, shooter.y, tailX, tailY);
          grad.addColorStop(0, `rgba(255,255,255,${0.85 * fade})`);
          grad.addColorStop(1, "rgba(255,255,255,0)");
          ctx.globalAlpha = 1;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(shooter.x, shooter.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
          if (shooter.life > 0.95) shooter = null;
        }
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[1]" />;
});
