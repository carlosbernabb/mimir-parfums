"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [phase, setPhase] = useState<"in" | "text" | "ash" | "out">("in");
  const ashCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 1100);
    const t2 = setTimeout(() => setPhase("ash"), 3200);
    const t3 = setTimeout(() => setPhase("out"), 4000);
    const t4 = setTimeout(() => onComplete(), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  // Ash particle canvas during exit
  useEffect(() => {
    if (phase !== "ash") return;
    const canvas = ashCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const ashes: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; life: number }[] = [];

    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 80;
      ashes.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 1.8,
        vy: -(Math.random() * 2.5 + 0.5),
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        life: 0,
      });
    }

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      ashes.forEach((a) => {
        a.life++;
        a.x += a.vx + Math.sin(a.life * 0.05) * 0.4;
        a.y += a.vy;
        a.vy *= 0.97;
        a.opacity -= 0.012;
        if (a.opacity > 0) {
          alive = true;
          ctx.beginPath();
          ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
          // mix gold and ash colors
          const isGold = a.size > 1.8;
          ctx.fillStyle = isGold
            ? `rgba(201,168,76,${a.opacity})`
            : `rgba(200,190,180,${a.opacity * 0.6})`;
          ctx.fill();
        }
      });
      if (alive) raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const logoVisible = phase === "in" || phase === "text";
  const ashPhase = phase === "ash" || phase === "out";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #160b0b 0%, #080808 65%)",
        opacity: phase === "out" ? 0 : 1,
        transition: phase === "out" ? "opacity 0.55s ease" : "none",
        pointerEvents: phase === "out" ? "none" : "auto",
      }}
      onClick={onComplete}
    >
      {/* Glow rings */}
      <div className="absolute" style={{
        width: 380, height: 380, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,26,26,0.14) 0%, transparent 70%)",
        animation: "pulseGlow 3s ease-in-out infinite",
      }} />
      <div className="absolute" style={{
        width: 580, height: 580, borderRadius: "50%",
        border: "1px solid rgba(201,168,76,0.07)",
        animation: "float 7s ease-in-out infinite",
      }} />
      <div className="absolute" style={{
        width: 680, height: 680, borderRadius: "50%",
        border: "1px solid rgba(201,168,76,0.03)",
      }} />

      {/* Ash canvas — shows during exit */}
      <canvas
        ref={ashCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: ashPhase ? 1 : 0, transition: "opacity 0.3s" }}
      />

      {/* Logo block */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{
          opacity: logoVisible ? 1 : 0,
          transform: ashPhase
            ? "scale(1.06) translateY(-6px)"
            : phase === "in"
            ? "scale(0.86)"
            : "scale(1)",
          filter: ashPhase ? "blur(6px)" : "blur(0px)",
          transition: ashPhase
            ? "opacity 0.7s ease, transform 0.9s ease, filter 0.8s ease"
            : "all 1.1s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div
          className="animate-float"
          style={{ filter: "drop-shadow(0 0 50px rgba(196,30,58,0.5))" }}
        >
          <img
            src="/MIMIR_LOGO-Photoroom.png"
            alt="MIMIR Parfums"
            width={240}
            style={{ display: "block" }}
          />
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: phase === "text" ? 1 : 0,
            transform: phase === "text" ? "translateY(0)" : "translateY(8px)",
            transition: "all 1s ease 0.2s",
            marginTop: 6,
          }}
          className="flex flex-col items-center gap-3"
        >
          <div className="gold-line" style={{ width: 110 }} />
          <p
            className="font-display"
            style={{
              color: "rgba(200,185,165,0.55)",
              fontSize: "0.58rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              fontStyle: "italic",
            }}
          >
            Perfumes que dominan
          </p>
        </div>
      </div>

      {/* Tap hint */}
      <p
        style={{
          position: "absolute",
          bottom: 44,
          color: "rgba(245,240,232,0.18)",
          fontSize: "0.58rem",
          letterSpacing: "0.22em",
          fontFamily: "'Cinzel', serif",
          textTransform: "uppercase",
          opacity: phase === "text" ? 1 : 0,
          transition: "opacity 0.7s ease 0.6s",
        }}
      >
        Toca para continuar
      </p>
    </div>
  );
}
