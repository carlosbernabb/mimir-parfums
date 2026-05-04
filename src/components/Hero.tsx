"use client";

export default function Hero() {
  return (
    <section
      className="relative arabic-pattern-bg overflow-hidden"
      style={{
        minHeight: "72vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        padding: "60px 24px",
      }}
    >
      {/* Decorative top line */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(139,26,26,0.35), transparent)" }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        {/* Logo PNG en lugar del rombo */}
        <div className="animate-float" style={{ filter: "drop-shadow(0 0 40px rgba(196,30,58,0.45))" }}>
          <img
            src="/MIMIR_LOGO-Photoroom.png"
            alt="MIMIR Parfums"
            style={{ width: 140, display: "block" }}
          />
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
          <p
            className="font-display"
            style={{
              fontSize: "0.58rem",
              letterSpacing: "0.42em",
              color: "var(--gold)",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Colección Exclusiva
          </p>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2.2rem, 8vw, 3.5rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "0.05em",
              marginBottom: 20,
              textShadow: "0 0 60px rgba(0,0,0,0.8)",
            }}
          >
            El Arte del
            <br />
            <span style={{ color: "var(--crimson-bright)", fontStyle: "italic" }}>Perfume Árabe</span>
          </h1>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
          <p
            style={{
              fontSize: "1.05rem",
              color: "rgba(245,240,232,0.58)",
              fontStyle: "italic",
              marginTop: 16,
              lineHeight: 1.7,
              maxWidth: 340,
              textShadow: "0 2px 20px rgba(0,0,0,0.9)",
            }}
          >
            Fragancias nacidas del misterio oriental,<br />
            diseñadas para quienes no pasan desapercibidos.
          </p>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "0.5s", opacity: 0 }}>
          <a href="#collection">
            <button className="btn-primary" style={{ marginTop: 8 }}>
              Explorar Colección
            </button>
          </a>
        </div>
      </div>

      {/* Bottom fade into rest of page — transparent so bg shows through */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: 70, background: "linear-gradient(to bottom, transparent, rgba(8,8,8,0.4))" }}
      />
    </section>
  );
}
