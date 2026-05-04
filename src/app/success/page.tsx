import Image from "next/image";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at center, #140a0a 0%, #080808 70%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <Image
        src="/MIMIR_LOGO.png"
        alt="MIMIR Parfums"
        width={120}
        height={120}
        style={{
          marginBottom: 32,
          filter: "drop-shadow(0 0 30px rgba(196,30,58,0.4))",
          animation: "float 4s ease-in-out infinite",
        }}
      />

      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(139,26,26,0.2)",
          border: "2px solid rgba(196,30,58,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.8rem",
          marginBottom: 24,
        }}
      >
        ✓
      </div>

      <h1
        className="font-display"
        style={{
          fontSize: "clamp(1.5rem, 6vw, 2.2rem)",
          fontWeight: 400,
          letterSpacing: "0.06em",
          marginBottom: 12,
        }}
      >
        ¡Pedido Confirmado!
      </h1>

      <div className="ornament-line" style={{ maxWidth: 240, margin: "0 auto 20px" }}>
        <span style={{ color: "var(--gold)", fontSize: "0.7rem" }}>◆</span>
      </div>

      <p
        style={{
          fontSize: "1rem",
          color: "rgba(245,240,232,0.65)",
          fontStyle: "italic",
          lineHeight: 1.7,
          maxWidth: 340,
          marginBottom: 32,
        }}
      >
        Tu fragancia está en camino. Recibirás los detalles de tu pedido
        a través de los datos proporcionados.
      </p>

      <p
        style={{
          fontSize: "0.75rem",
          color: "rgba(245,240,232,0.3)",
          marginBottom: 32,
          fontStyle: "italic",
        }}
      >
        Tiempo de entrega estimado: 3–7 días hábiles
      </p>

      <Link href="/">
        <button className="btn-gold">
          Volver a la tienda
        </button>
      </Link>
    </div>
  );
}
