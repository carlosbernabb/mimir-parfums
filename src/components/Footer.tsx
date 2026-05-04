import Image from "next/image";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(201,168,76,0.08)",
        padding: "40px 24px 48px",
        textAlign: "center",
        background: "linear-gradient(180deg, #0a0a0a 0%, #080808 100%)",
      }}
    >
      <Image
        src="/MIMIR_LOGO.png"
        alt="MIMIR Parfums"
        width={64}
        height={64}
        style={{
          margin: "0 auto 16px",
          display: "block",
          opacity: 0.7,
          filter: "drop-shadow(0 0 12px rgba(139,26,26,0.3))",
        }}
      />

      <p
        className="font-display"
        style={{
          fontSize: "1rem",
          letterSpacing: "0.2em",
          marginBottom: 4,
        }}
      >
        MIMIR
      </p>
      <p
        style={{
          fontSize: "0.55rem",
          letterSpacing: "0.3em",
          color: "var(--gold)",
          fontFamily: "'Cinzel', serif",
          textTransform: "uppercase",
          marginBottom: 24,
        }}
      >
        Parfums
      </p>

      <div className="gold-line" style={{ maxWidth: 200, margin: "0 auto 20px" }} />

      <p
        style={{
          fontSize: "0.7rem",
          color: "rgba(245,240,232,0.2)",
          fontStyle: "italic",
          lineHeight: 1.8,
          marginBottom: 20,
        }}
      >
        Fragancias de élite con esencia árabe.<br />
        Cada gota, una historia.
      </p>

      <a
        href="/rastreo"
        style={{
          display: "inline-block",
          fontSize: "0.55rem",
          letterSpacing: "0.18em",
          color: "rgba(201,168,76,0.45)",
          fontFamily: "'Cinzel', serif",
          textTransform: "uppercase",
          textDecoration: "none",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          paddingBottom: 2,
        }}
      >
        Rastrear mi Pedido
      </a>

      <p
        style={{
          fontSize: "0.55rem",
          color: "rgba(245,240,232,0.12)",
          marginTop: 24,
          letterSpacing: "0.1em",
          fontFamily: "'Cinzel', serif",
        }}
      >
        © {new Date().getFullYear()} MIMIR Parfums · Todos los derechos reservados
      </p>
    </footer>
  );
}
