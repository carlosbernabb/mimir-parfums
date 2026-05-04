"use client";

import { useEffect, useRef } from "react";

export default function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Ash = {
      x: number; y: number;
      vx: number; vy: number;
      size: number; opacity: number;
      life: number; maxLife: number;
      type: "flake" | "spark" | "ember";
      rot: number; rotSpeed: number;
      w: number; h: number;
    };

    const particles: Ash[] = [];

    const spawn = (fromBottom?: boolean): Ash => {
      const type = Math.random() < 0.55 ? "flake" : Math.random() < 0.6 ? "ember" : "spark";
      const side = Math.random();

      // spawn from edges, bottom, or random across screen
      let x: number, y: number;
      if (fromBottom || Math.random() < 0.4) {
        x = Math.random() * canvas.width;
        y = canvas.height + 10;
      } else if (side < 0.15) {
        x = -5;
        y = Math.random() * canvas.height;
      } else if (side < 0.3) {
        x = canvas.width + 5;
        y = Math.random() * canvas.height;
      } else {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
      }

      const size = type === "spark"
        ? Math.random() * 2.5 + 0.8
        : Math.random() * 3.5 + 1;

      return {
        x, y,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(Math.random() * 1.2 + 0.3),
        size,
        w: size * (Math.random() * 1.5 + 0.5),
        h: size * (Math.random() * 2 + 0.5),
        opacity: Math.random() * 0.5 + 0.15,
        life: 0,
        maxLife: Math.random() * 280 + 120,
        type,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
      };
    };

    // Seed initial particles spread across screen
    const total = Math.min(Math.floor(canvas.width * canvas.height / 5000), 200);
    for (let i = 0; i < total; i++) {
      const p = spawn();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    let raf: number;
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle crimson atmospheric glow from top center
      const radGrad = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.15, 0,
        canvas.width * 0.5, canvas.height * 0.15, canvas.width * 0.5
      );
      radGrad.addColorStop(0, "rgba(110,12,12,0.06)");
      radGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;

        // movement — sinusoidal drift + base velocity
        const wave = Math.sin(p.life * 0.022 + i * 0.7) * 0.6;
        p.x += p.vx + wave;
        p.y += p.vy;
        p.rot += p.rotSpeed;

        // slow gradual deceleration
        p.vy *= 0.999;

        const progress = p.life / p.maxLife;
        const fade = progress < 0.2
          ? progress / 0.2
          : progress > 0.75
          ? (1 - progress) / 0.25
          : 1;

        const alpha = p.opacity * fade;
        if (alpha < 0.005) { particles[i] = spawn(true); continue; }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;

        if (p.type === "spark") {
          // Gold spark — bright dot with glow
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2.5);
          g.addColorStop(0, "rgba(220,175,80,0.9)");
          g.addColorStop(0.4, "rgba(201,150,50,0.5)");
          g.addColorStop(1, "rgba(180,120,30,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2.5, 0, Math.PI * 2);
          ctx.fill();

          // bright core
          ctx.fillStyle = "rgba(255,220,120,0.95)";
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();

        } else if (p.type === "flake") {
          // Ash flake — irregular elongated shape
          ctx.fillStyle = `rgba(${185 + Math.random() * 20},${178 + Math.random() * 15},${165 + Math.random() * 15},${alpha})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.w * 0.5, p.h * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // subtle edge
          ctx.strokeStyle = `rgba(220,215,200,${alpha * 0.3})`;
          ctx.lineWidth = 0.3;
          ctx.stroke();

        } else {
          // Ember — glowing orange dot
          const g2 = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2);
          g2.addColorStop(0, "rgba(220,80,30,0.8)");
          g2.addColorStop(0.5, "rgba(180,50,10,0.3)");
          g2.addColorStop(1, "rgba(120,20,0,0)");
          ctx.fillStyle = g2;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        if (p.life >= p.maxLife) {
          particles[i] = spawn(true);
        }
      }

      // Spawn extras over time up to max
      frame++;
      if (frame % 12 === 0 && particles.length < total + 60) {
        particles.push(spawn());
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
