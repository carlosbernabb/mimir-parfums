"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { STATUS_LABELS, STATUS_ORDER, canCancel, type OrderStatus } from "@/lib/orders";

interface OrderData {
  order_id: string;
  status: OrderStatus;
  items: { id: string; name: string; price: number; quantity: number }[];
  shipping: {
    nombre: string; telefono: string; calle: string; numero: string;
    colonia: string; ciudad: string; estado: string; codigoPostal: string;
  };
  total_mxn: number;
  customer_email: string;
  tracking_number: string | null;
  carrier: string | null;
  tracking_url: string | null;
  created_at: string;
}

const gold = "var(--gold)";

function StatusStep({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: `1px solid ${done || active ? "rgba(201,168,76,0.7)" : "rgba(245,240,232,0.12)"}`,
          background: active ? "rgba(201,168,76,0.15)" : done ? "rgba(201,168,76,0.08)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.65rem",
          color: done || active ? gold : "rgba(245,240,232,0.25)",
          transition: "all 0.3s",
        }}
      >
        {done ? "✓" : "·"}
      </div>
      <p
        style={{
          fontSize: "0.5rem",
          letterSpacing: "0.08em",
          color: active ? gold : done ? "rgba(201,168,76,0.6)" : "rgba(245,240,232,0.2)",
          fontFamily: "'Cinzel', serif",
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {label}
      </p>
    </div>
  );
}

function TrackingContent() {
  const params = useSearchParams();
  const [input, setInput] = useState(params.get("orderId") ?? "");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelDone, setCancelDone] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const fetchOrder = useCallback(async (id: string) => {
    setLoading(true);
    setError("");
    setOrder(null);
    setCancelDone(false);
    try {
      const res = await fetch(`/api/orders/${id.trim().toUpperCase()}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Pedido no encontrado"); return; }
      setOrder(data);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = params.get("orderId");
    if (id) queueMicrotask(() => fetchOrder(id));
  }, [fetchOrder, params]);

  async function handleCancel() {
    if (!order) return;
    if (!confirm("¿Estás seguro de que deseas cancelar tu pedido?")) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${order.order_id}/cancel`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { alert(data.error); return; }
      setCancelDone(true);
      setOrder({ ...order, status: "cancelled" });
    } catch {
      alert("Error al cancelar. Intenta de nuevo.");
    } finally {
      setCancelling(false);
    }
  }

  async function handleContact(e: React.FormEvent) {
    e.preventDefault();
    setContactLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order?.order_id ?? input, email: contactEmail, message: contactMsg }),
      });
      setContactSent(true);
    } catch {
      alert("Error al enviar. Intenta de nuevo.");
    } finally {
      setContactLoading(false);
    }
  }

  const statusIndex = order ? STATUS_ORDER.indexOf(order.status) : -1;

  return (
    <div style={{ minHeight: "100vh", background: "#080808", padding: "40px 20px" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/">
            <p className="font-display" style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: gold, textTransform: "uppercase", marginBottom: 8, cursor: "pointer" }}>
              MIMIR PARFUMS
            </p>
          </Link>
          <h1 className="font-display" style={{ fontSize: "1.6rem", fontWeight: 400, marginBottom: 6 }}>
            Rastreo de Pedido
          </h1>
          <p style={{ fontSize: "0.82rem", color: "rgba(245,240,232,0.45)", fontStyle: "italic" }}>
            Ingresa tu número de pedido para ver su estado
          </p>
        </div>

        {/* Search */}
        <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
          <input
            className="input-luxury"
            placeholder="Ej. MIM-4K7Q"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) fetchOrder(input); }}
            style={{ flex: 1, letterSpacing: "0.12em", textTransform: "uppercase" }}
          />
          <button
            className="btn-primary"
            onClick={() => input.trim() && fetchOrder(input)}
            disabled={loading}
            style={{ padding: "0 20px", whiteSpace: "nowrap" }}
          >
            {loading ? "..." : "Buscar"}
          </button>
        </div>

        {error && (
          <div style={{ textAlign: "center", padding: "24px", border: "1px solid rgba(231,76,60,0.2)", background: "rgba(231,76,60,0.05)", marginBottom: 24 }}>
            <p style={{ color: "#e74c3c", fontSize: "0.85rem" }}>{error}</p>
          </div>
        )}

        {order && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Status badge */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.15)", padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: gold, fontFamily: "'Cinzel', serif", textTransform: "uppercase", marginBottom: 4 }}>
                    Pedido
                  </p>
                  <p className="font-display" style={{ fontSize: "1.3rem", letterSpacing: "0.15em" }}>{order.order_id}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: gold, fontFamily: "'Cinzel', serif", textTransform: "uppercase", marginBottom: 4 }}>
                    Estado
                  </p>
                  <p style={{ fontSize: "0.82rem", color: order.status === "cancelled" ? "#e74c3c" : "rgba(245,240,232,0.85)", fontStyle: "italic" }}>
                    {STATUS_LABELS[order.status]}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              {order.status !== "cancelled" && order.status !== "pending_payment" && (
                <div style={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      left: "12.5%",
                      right: "12.5%",
                      height: "1px",
                      background: "rgba(201,168,76,0.15)",
                    }}
                  />
                  {STATUS_ORDER.map((s, i) => (
                    <StatusStep
                      key={s}
                      label={STATUS_LABELS[s]}
                      done={statusIndex > i}
                      active={statusIndex === i}
                    />
                  ))}
                </div>
              )}

              {order.status === "pending_payment" && (
                <p style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.45)", fontStyle: "italic", textAlign: "center" }}>
                  Esperando confirmación de pago...
                </p>
              )}
            </div>

            {/* Order items */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.1)", padding: "20px 24px" }}>
              <p style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: gold, fontFamily: "'Cinzel', serif", textTransform: "uppercase", marginBottom: 14 }}>
                Productos
              </p>
              {order.items.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.85rem" }}>
                  <span style={{ color: "rgba(245,240,232,0.7)", fontStyle: "italic" }}>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-display" style={{ fontSize: "0.85rem" }}>
                    ${(item.price * item.quantity).toLocaleString()} MXN
                  </span>
                </div>
              ))}
              <div className="gold-line" style={{ margin: "12px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(245,240,232,0.5)", fontStyle: "italic", fontSize: "0.8rem" }}>Total</span>
                <span className="font-display" style={{ color: gold }}>${order.total_mxn.toLocaleString()} MXN</span>
              </div>
            </div>

            {/* Shipping address */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.1)", padding: "20px 24px" }}>
              <p style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: gold, fontFamily: "'Cinzel', serif", textTransform: "uppercase", marginBottom: 12 }}>
                Dirección de Envío
              </p>
              <p style={{ fontSize: "0.82rem", color: "rgba(245,240,232,0.65)", fontStyle: "italic", lineHeight: 1.8 }}>
                {order.shipping.nombre}<br />
                {order.shipping.calle} {order.shipping.numero}, {order.shipping.colonia}<br />
                {order.shipping.ciudad}, {order.shipping.estado} CP {order.shipping.codigoPostal}<br />
                Tel: {order.shipping.telefono}<br />
                <span style={{ fontSize: "0.75rem", color: "rgba(245,240,232,0.35)" }}>{order.customer_email}</span>
              </p>
            </div>

            {/* Tracking info from carrier */}
            {order.status === "shipped" && order.tracking_number && (
              <div style={{ background: "rgba(200,120,255,0.05)", border: "1px solid rgba(200,120,255,0.2)", padding: "20px 24px" }}>
                <p style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: "rgba(200,120,255,0.8)", fontFamily: "'Cinzel', serif", textTransform: "uppercase", marginBottom: 12 }}>
                  Información de Envío
                </p>
                <p style={{ fontSize: "0.82rem", color: "rgba(245,240,232,0.6)", fontStyle: "italic", marginBottom: 4 }}>
                  Paquetería: <span style={{ color: "#f5f0e8" }}>{order.carrier}</span>
                </p>
                <p style={{ fontSize: "0.82rem", color: "rgba(245,240,232,0.6)", fontStyle: "italic", marginBottom: order.tracking_url ? 12 : 0 }}>
                  Número de guía: <span style={{ color: "#f5f0e8", letterSpacing: "0.08em", fontFamily: "'Cinzel', serif" }}>{order.tracking_number}</span>
                </p>
                {order.tracking_url && (
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "inline-block", marginTop: 4, fontSize: "0.78rem", color: gold, fontStyle: "italic", textDecoration: "underline" }}
                  >
                    Rastrear con {order.carrier} ↗
                  </a>
                )}
                <p style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.3)", marginTop: 10, fontStyle: "italic" }}>
                  Tiempo estimado de entrega: 1-3 días hábiles
                </p>
              </div>
            )}

            {/* Cancel button */}
            {canCancel(order.status) && !cancelDone && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(231,76,60,0.3)",
                  color: "rgba(231,76,60,0.7)",
                  padding: "12px",
                  cursor: "pointer",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  fontFamily: "'Cinzel', serif",
                  width: "100%",
                }}
              >
                {cancelling ? "Cancelando..." : "Solicitar Cancelación del Pedido"}
              </button>
            )}

            {cancelDone && (
              <p style={{ textAlign: "center", fontSize: "0.82rem", color: "rgba(245,240,232,0.5)", fontStyle: "italic" }}>
                Tu pedido ha sido cancelado. Recibirás un correo de confirmación.
              </p>
            )}
          </div>
        )}

        {/* Contact section */}
        <div
          style={{
            marginTop: 40,
            paddingTop: 32,
            borderTop: "1px solid rgba(201,168,76,0.08)",
          }}
        >
          <h2 className="font-display" style={{ fontSize: "1rem", fontWeight: 400, marginBottom: 6, textAlign: "center" }}>
            ¿Necesitas Ayuda?
          </h2>
          <p style={{ fontSize: "0.8rem", color: "rgba(245,240,232,0.45)", fontStyle: "italic", textAlign: "center", marginBottom: 24 }}>
            Escríbenos y te respondemos a la brevedad
          </p>

          {contactSent ? (
            <div style={{ textAlign: "center", padding: "24px", border: "1px solid rgba(201,168,76,0.15)", background: "rgba(201,168,76,0.04)" }}>
              <p style={{ color: gold, fontSize: "0.85rem", fontStyle: "italic" }}>
                ¡Mensaje enviado! Te responderemos pronto.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContact} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.55rem", letterSpacing: "0.15em", color: gold, fontFamily: "'Cinzel', serif", textTransform: "uppercase", marginBottom: 6 }}>
                  Número de Pedido
                </label>
                <input
                  className="input-luxury"
                  value={order?.order_id ?? input}
                  readOnly={!!order}
                  onChange={(e) => !order && setInput(e.target.value)}
                  placeholder="MIM-XXXX"
                  style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.55rem", letterSpacing: "0.15em", color: gold, fontFamily: "'Cinzel', serif", textTransform: "uppercase", marginBottom: 6 }}>
                  Tu Correo Electrónico *
                </label>
                <input
                  className="input-luxury"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.55rem", letterSpacing: "0.15em", color: gold, fontFamily: "'Cinzel', serif", textTransform: "uppercase", marginBottom: 6 }}>
                  Mensaje *
                </label>
                <textarea
                  className="input-luxury"
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="¿En qué podemos ayudarte?"
                  required
                  rows={4}
                  style={{ resize: "vertical", minHeight: 100 }}
                />
              </div>
              <button
                className="btn-primary"
                type="submit"
                disabled={contactLoading}
                style={{ padding: 14 }}
              >
                {contactLoading ? "Enviando..." : "Enviar Mensaje →"}
              </button>
            </form>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link href="/">
            <p style={{ fontSize: "0.65rem", color: "rgba(245,240,232,0.3)", letterSpacing: "0.15em", fontFamily: "'Cinzel', serif", cursor: "pointer" }}>
              ← VOLVER A LA TIENDA
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RastreoPage() {
  return (
    <Suspense>
      <TrackingContent />
    </Suspense>
  );
}
