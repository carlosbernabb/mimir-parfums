"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";

function ExitoContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId") ?? "";
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    // Verify payment with Stripe directly (fallback for when webhook hasn't fired yet)
    fetch(`/api/orders/${orderId}/verify`, { method: "POST" })
      .then((r) => r.json())
      .then((d) => { if (d.status === "paid") setVerified(true); })
      .catch(() => {});
  }, [orderId]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "1px solid rgba(201,168,76,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: "1.5rem",
              color: "var(--gold)",
            }}
          >
            ✓
          </div>
          <p
            className="font-display"
            style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 12 }}
          >
            Pago Confirmado
          </p>
          <h1
            className="font-display"
            style={{ fontSize: "2rem", fontWeight: 400, lineHeight: 1.2, marginBottom: 8 }}
          >
            ¡Gracias por tu pedido!
          </h1>
          <p style={{ color: "rgba(245,240,232,0.55)", fontSize: "0.9rem", fontStyle: "italic" }}>
            Tu fragancia está siendo preparada con cuidado.
          </p>
        </div>

        {orderId && (
          <div
            style={{
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.25)",
              padding: "24px",
              marginBottom: 28,
            }}
          >
            <p style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: "var(--gold)", fontFamily: "'Cinzel', serif", textTransform: "uppercase", marginBottom: 8 }}>
              Tu número de pedido
            </p>
            <p
              className="font-display"
              style={{ fontSize: "2.2rem", letterSpacing: "0.2em", marginBottom: 8 }}
            >
              {orderId}
            </p>
            <p style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.4)", fontStyle: "italic" }}>
              Guarda este número para rastrear tu envío
            </p>
          </div>
        )}

        <p style={{ fontSize: "0.82rem", color: "rgba(245,240,232,0.5)", fontStyle: "italic", marginBottom: 28, lineHeight: 1.7 }}>
          {verified
            ? "Recibirás un correo de confirmación en breve.\nTe avisaremos cuando tu pedido sea enviado."
            : "Recibirás un correo de confirmación en breve.\nTe avisaremos cuando tu pedido sea enviado."}
        </p>

        <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
          {orderId && (
            <Link href={`/rastreo?orderId=${orderId}`}>
              <button className="btn-primary" style={{ width: "100%", padding: 14 }}>
                Rastrear mi Pedido →
              </button>
            </Link>
          )}
          <Link href="/">
            <button
              style={{
                width: "100%",
                padding: 14,
                background: "transparent",
                border: "1px solid rgba(201,168,76,0.2)",
                color: "rgba(245,240,232,0.6)",
                cursor: "pointer",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                fontFamily: "'Cinzel', serif",
              }}
            >
              Volver a la Tienda
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ExitoPage() {
  return (
    <Suspense>
      <ExitoContent />
    </Suspense>
  );
}
