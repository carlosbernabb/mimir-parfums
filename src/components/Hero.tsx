"use client";

import { useState, useEffect } from "react";

interface HeroProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  sale_label: string | null;
  sale_ends: string | null;
}

const trustBadges = ["Originales", "Envíos a México", "Pago seguro", "Fragancias virales"];

export default function Hero() {
  const [hero, setHero] = useState<HeroProduct | null>(null);

  useEffect(() => {
    fetch("/api/hero").then((r) => r.json()).then((d) => setHero(d.hero));
  }, []);

  return (
    <section
      className="relative arabic-pattern-bg overflow-hidden"
      style={{
        minHeight: "calc(100vh - 68px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "transparent",
        padding: "28px 20px 34px",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(139,26,26,0.35), transparent)" }}
      />

      <div
        className="absolute"
        style={{
          inset: "7% 8% auto",
          height: 360,
          background: "radial-gradient(ellipse at center, rgba(196,30,58,0.16), transparent 68%)",
          filter: "blur(10px)",
          animation: "scentPulse 6s ease-in-out infinite",
        }}
      />

      <div className="relative z-10">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 0.82fr", gap: 10, alignItems: "center" }}>
          <div className="animate-fade-up" style={{ opacity: 0 }}>
            <p
              className="font-display"
              style={{
                fontSize: "0.56rem",
                letterSpacing: "0.32em",
                color: "var(--gold)",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Perfumes árabes originales
            </p>
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(2rem, 9vw, 3.3rem)",
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: "0.03em",
                marginBottom: 14,
                textShadow: "0 0 60px rgba(0,0,0,0.9)",
              }}
            >
              Lujo que se nota antes de hablar
            </h1>
            {hero && (
              <p
                style={{
                  fontSize: "1rem",
                  color: "rgba(245,240,232,0.72)",
                  lineHeight: 1.55,
                  maxWidth: 320,
                  marginBottom: 14,
                }}
              >
                Fragancias intensas, elegantes y de larga duración. Desde{" "}
                <span style={{ color: "var(--gold-light)", fontWeight: 700 }}>${hero.price.toLocaleString("es-MX")} MXN</span>.
              </p>
            )}
          </div>

          <div
            className="animate-float"
            style={{
              position: "relative",
              minHeight: 270,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 210,
                height: 210,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(201,168,76,0.18), transparent 66%)",
              }}
            />
            {hero && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hero.image}
                alt={hero.name}
                style={{
                  width: 230,
                  objectFit: "contain",
                  maxWidth: "100%",
                  height: "auto",
                  filter: "drop-shadow(0 28px 34px rgba(0,0,0,0.55))",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            )}
            {hero?.sale_ends && (
              <div
                className="font-display"
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  whiteSpace: "nowrap",
                  background: "rgba(8,8,8,0.72)",
                  border: "1px solid rgba(201,168,76,0.28)",
                  color: "var(--gold)",
                  padding: "7px 10px",
                  fontSize: "0.54rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  backdropFilter: "blur(10px)",
                  zIndex: 2,
                }}
              >
                {hero.sale_ends}
              </div>
            )}
          </div>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "0.15s", opacity: 0 }}>
          <div style={{ display: "flex", gap: 10, margin: "10px 0 18px" }}>
            <a href="#collection" style={{ flex: 1 }}>
              <button className="btn-primary" style={{ width: "100%", padding: "14px 12px" }}>
                Comprar ahora
              </button>
            </a>
            <a href="#scent-guide" style={{ flex: 1 }}>
              <button className="btn-gold" style={{ width: "100%", padding: "13px 10px" }}>
                Elegir aroma
              </button>
            </a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {trustBadges.map((badge) => (
              <div
                key={badge}
                className="font-display"
                style={{
                  border: "1px solid rgba(201,168,76,0.14)",
                  background: "rgba(255,255,255,0.025)",
                  color: "rgba(245,240,232,0.78)",
                  padding: "9px 8px",
                  textAlign: "center",
                  fontSize: "0.55rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: 70, background: "linear-gradient(to bottom, transparent, rgba(8,8,8,0.5))" }}
      />
    </section>
  );
}
