"use client";

import { useState, useEffect } from "react";
import { STATUS_LABELS, type OrderStatus, type Order } from "@/lib/orders";

const gold = "var(--gold)";

const STATUS_COLORS: Record<string, string> = {
  pending_payment: "rgba(245,200,80,0.7)",
  paid: "rgba(100,220,120,0.8)",
  processing: "rgba(100,160,255,0.8)",
  shipped: "rgba(200,120,255,0.8)",
  delivered: "rgba(100,220,120,0.6)",
  cancelled: "rgba(231,76,60,0.7)",
};

const CARRIERS = ["Fedex", "DHL", "Estafeta", "Sendex", "Paquetexpress", "J&T Express", "Otra"];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [loginError, setLoginError] = useState("");

  // Per-order ship form state
  const [shipForm, setShipForm] = useState<Record<string, { carrier: string; tracking: string; url: string }>>({});
  // Per-order general status change
  const [newStatus, setNewStatus] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem("mimir_admin_token");
    if (saved) { setToken(saved); loadOrders(saved, "all"); }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (!res.ok) { setLoginError("Contraseña incorrecta"); return; }
      localStorage.setItem("mimir_admin_token", password);
      setToken(password);
      const data = await res.json();
      setOrders(data.orders ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function loadOrders(t: string, f: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?status=${f}`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) { setToken(null); localStorage.removeItem("mimir_admin_token"); return; }
      const data = await res.json();
      setOrders(data.orders ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function handleShip(orderId: string) {
    if (!token) return;
    const form = shipForm[orderId] ?? { carrier: "", tracking: "", url: "" };
    if (!form.carrier || !form.tracking) return alert("Ingresa la paquetería y el número de guía");
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "shipped",
          carrier: form.carrier,
          tracking_number: form.tracking,
          tracking_url: form.url || null,
        }),
      });
      if (res.ok) { await loadOrders(token, filter); setExpanded(null); }
    } finally {
      setUpdating(null);
    }
  }

  async function handleStatusChange(orderId: string) {
    if (!token || !newStatus[orderId]) return;
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus[orderId], notes: notes[orderId] }),
      });
      if (res.ok) await loadOrders(token, filter);
    } finally {
      setUpdating(null);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short", timeZone: "America/Mexico_City" });
  }

  function getShip(orderId: string) {
    return shipForm[orderId] ?? { carrier: "", tracking: "", url: "" };
  }

  function setShipField(orderId: string, field: string, val: string) {
    setShipForm((p) => ({ ...p, [orderId]: { ...getShip(orderId), [field]: val } }));
  }

  // ── Login ──
  if (!token) {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 360, width: "100%", textAlign: "center" }}>
          <p className="font-display" style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: gold, textTransform: "uppercase", marginBottom: 8 }}>MIMIR PARFUMS</p>
          <h1 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: 32 }}>Panel de Admin</h1>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input className="input-luxury" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
            {loginError && <p style={{ color: "#e74c3c", fontSize: "0.8rem" }}>{loginError}</p>}
            <button className="btn-primary" type="submit" disabled={loading} style={{ padding: 14 }}>{loading ? "..." : "Entrar →"}</button>
          </form>
        </div>
      </div>
    );
  }

  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => { acc[o.status] = (acc[o.status] ?? 0) + 1; return acc; }, {});

  return (
    <div style={{ minHeight: "100vh", background: "#080808", padding: "20px 14px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
          <div>
            <p className="font-display" style={{ fontSize: "0.5rem", letterSpacing: "0.3em", color: gold, textTransform: "uppercase", marginBottom: 2 }}>MIMIR PARFUMS</p>
            <h1 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 400 }}>Panel de Pedidos</h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => loadOrders(token, filter)} style={{ background: "transparent", border: "1px solid rgba(201,168,76,0.2)", color: gold, padding: "8px 14px", cursor: "pointer", fontSize: "0.65rem", fontFamily: "'Cinzel', serif" }}>
              ↻ Actualizar
            </button>
            <button onClick={() => { localStorage.removeItem("mimir_admin_token"); setToken(null); }} style={{ background: "transparent", border: "1px solid rgba(245,240,232,0.08)", color: "rgba(245,240,232,0.3)", padding: "8px 14px", cursor: "pointer", fontSize: "0.65rem", fontFamily: "'Cinzel', serif" }}>
              Salir
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {["all", "paid", "processing", "shipped", "delivered", "cancelled"].map((s) => {
            const count = s === "all" ? orders.length : (statusCounts[s] ?? 0);
            const label = s === "all" ? "Todos" : STATUS_LABELS[s as OrderStatus];
            return (
              <button
                key={s}
                onClick={() => { setFilter(s); loadOrders(token, s); }}
                style={{
                  background: filter === s ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${filter === s ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.06)"}`,
                  color: filter === s ? gold : "rgba(245,240,232,0.4)",
                  padding: "7px 12px",
                  cursor: "pointer",
                  fontSize: "0.58rem",
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {label} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {loading && <p style={{ textAlign: "center", color: "rgba(245,240,232,0.3)", fontStyle: "italic", padding: 24 }}>Cargando...</p>}

        {/* Orders */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {orders.length === 0 && !loading && (
            <p style={{ textAlign: "center", color: "rgba(245,240,232,0.2)", fontStyle: "italic", padding: 32 }}>No hay pedidos.</p>
          )}

          {orders.map((order) => {
            const s = order.shipping as { nombre: string; telefono: string; calle: string; numero: string; colonia: string; ciudad: string; estado: string; codigoPostal: string };
            const isExpanded = expanded === order.order_id;
            const isShippable = order.status === "paid" || order.status === "processing";

            return (
              <div key={order.order_id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.1)" }}>

                {/* Row */}
                <div
                  onClick={() => setExpanded(isExpanded ? null : order.order_id)}
                  style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", flexWrap: "wrap" }}
                >
                  <span className="font-display" style={{ fontSize: "0.9rem", letterSpacing: "0.1em", minWidth: 90 }}>{order.order_id}</span>
                  <span style={{ fontSize: "0.55rem", padding: "3px 8px", border: `1px solid ${STATUS_COLORS[order.status]}`, color: STATUS_COLORS[order.status], fontFamily: "'Cinzel', serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {STATUS_LABELS[order.status]}
                  </span>
                  <span style={{ flex: 1, fontSize: "0.8rem", color: "rgba(245,240,232,0.6)" }}>{s.nombre}</span>
                  <span className="font-display" style={{ fontSize: "0.85rem", color: gold }}>${order.total_mxn.toLocaleString()} MXN</span>
                  <span style={{ fontSize: "0.6rem", color: "rgba(245,240,232,0.25)" }}>{formatDate(order.created_at)}</span>
                  <span style={{ fontSize: "0.6rem", color: "rgba(245,240,232,0.25)" }}>{isExpanded ? "▲" : "▼"}</span>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div style={{ padding: "0 16px 18px", borderTop: "1px solid rgba(201,168,76,0.07)" }}>

                    {/* Info grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, margin: "16px 0" }}>
                      <div>
                        <p style={{ fontSize: "0.48rem", letterSpacing: "0.2em", color: gold, fontFamily: "'Cinzel', serif", textTransform: "uppercase", marginBottom: 7 }}>Cliente</p>
                        <p style={{ fontSize: "0.8rem", color: "rgba(245,240,232,0.7)", lineHeight: 1.9, fontStyle: "italic" }}>
                          {s.nombre}<br />{s.telefono}<br />{order.customer_email}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: "0.48rem", letterSpacing: "0.2em", color: gold, fontFamily: "'Cinzel', serif", textTransform: "uppercase", marginBottom: 7 }}>Dirección</p>
                        <p style={{ fontSize: "0.8rem", color: "rgba(245,240,232,0.7)", lineHeight: 1.9, fontStyle: "italic" }}>
                          {s.calle} {s.numero}, {s.colonia}<br />{s.ciudad}, {s.estado}<br />CP {s.codigoPostal}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: "0.48rem", letterSpacing: "0.2em", color: gold, fontFamily: "'Cinzel', serif", textTransform: "uppercase", marginBottom: 7 }}>Productos</p>
                      {(order.items as { id: string; name: string; price: number; quantity: number }[]).map((item) => (
                        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 4 }}>
                          <span style={{ color: "rgba(245,240,232,0.6)", fontStyle: "italic" }}>{item.name} × {item.quantity}</span>
                          <span style={{ color: "#f5f0e8" }}>${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <p className="font-display" style={{ textAlign: "right", color: gold, marginTop: 6, fontSize: "0.85rem" }}>
                        Total: ${order.total_mxn.toLocaleString()} MXN
                      </p>
                    </div>

                    {/* Existing tracking info */}
                    {order.tracking_number && (
                      <div style={{ background: "rgba(200,120,255,0.05)", border: "1px solid rgba(200,120,255,0.15)", padding: "12px 14px", marginBottom: 14 }}>
                        <p style={{ fontSize: "0.48rem", letterSpacing: "0.2em", color: "rgba(200,120,255,0.8)", fontFamily: "'Cinzel', serif", textTransform: "uppercase", marginBottom: 6 }}>Guía de Envío</p>
                        <p style={{ fontSize: "0.8rem", color: "rgba(245,240,232,0.7)", fontStyle: "italic" }}>
                          {order.carrier} · <strong style={{ color: "#f5f0e8", letterSpacing: "0.06em" }}>{order.tracking_number}</strong>
                        </p>
                        {order.tracking_url && (
                          <a href={order.tracking_url} target="_blank" rel="noreferrer" style={{ fontSize: "0.7rem", color: gold, fontStyle: "italic" }}>
                            Ver rastreo ↗
                          </a>
                        )}
                      </div>
                    )}

                    {/* ── SHIP FORM (main action) ── */}
                    {isShippable && (
                      <div style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.2)", padding: "16px", marginBottom: 14 }}>
                        <p style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: gold, fontFamily: "'Cinzel', serif", textTransform: "uppercase", marginBottom: 12 }}>
                          📦 Marcar como Enviado
                        </p>
                        <div style={{ display: "grid", gap: 10 }}>
                          <div>
                            <label style={{ fontSize: "0.48rem", letterSpacing: "0.15em", color: "rgba(245,240,232,0.4)", fontFamily: "'Cinzel', serif", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                              Paquetería *
                            </label>
                            <select
                              className="input-luxury"
                              value={getShip(order.order_id).carrier}
                              onChange={(e) => setShipField(order.order_id, "carrier", e.target.value)}
                              style={{ appearance: "none", cursor: "pointer", fontSize: "0.85rem" }}
                            >
                              <option value="">Seleccionar...</option>
                              {CARRIERS.map((c) => <option key={c} value={c} style={{ background: "#111" }}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ fontSize: "0.48rem", letterSpacing: "0.15em", color: "rgba(245,240,232,0.4)", fontFamily: "'Cinzel', serif", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                              Número de Guía *
                            </label>
                            <input
                              className="input-luxury"
                              value={getShip(order.order_id).tracking}
                              onChange={(e) => setShipField(order.order_id, "tracking", e.target.value)}
                              placeholder="Ej. 123456789012"
                              style={{ fontSize: "0.85rem", letterSpacing: "0.06em" }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: "0.48rem", letterSpacing: "0.15em", color: "rgba(245,240,232,0.4)", fontFamily: "'Cinzel', serif", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                              Link de Rastreo (opcional)
                            </label>
                            <input
                              className="input-luxury"
                              value={getShip(order.order_id).url}
                              onChange={(e) => setShipField(order.order_id, "url", e.target.value)}
                              placeholder="https://www.fedex.com/..."
                              style={{ fontSize: "0.82rem" }}
                            />
                          </div>
                          <button
                            className="btn-primary"
                            onClick={() => handleShip(order.order_id)}
                            disabled={updating === order.order_id}
                            style={{ padding: "13px", marginTop: 2 }}
                          >
                            {updating === order.order_id ? "Enviando..." : "✓ Confirmar Envío — Notificar al Cliente →"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: "0.48rem", letterSpacing: "0.15em", color: "rgba(245,240,232,0.3)", fontFamily: "'Cinzel', serif", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                        Notas internas
                      </label>
                      <textarea
                        className="input-luxury"
                        value={notes[order.order_id] ?? order.notes ?? ""}
                        onChange={(e) => setNotes({ ...notes, [order.order_id]: e.target.value })}
                        placeholder="Observaciones internas..."
                        rows={2}
                        style={{ resize: "vertical", fontSize: "0.82rem" }}
                      />
                    </div>

                    {/* Other status changes */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <select
                        className="input-luxury"
                        value={newStatus[order.order_id] ?? order.status}
                        onChange={(e) => setNewStatus({ ...newStatus, [order.order_id]: e.target.value })}
                        style={{ flex: 1, appearance: "none", cursor: "pointer", fontSize: "0.8rem" }}
                      >
                        {Object.entries(STATUS_LABELS).filter(([k]) => k !== "pending_payment").map(([k, v]) => (
                          <option key={k} value={k} style={{ background: "#111" }}>{v}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleStatusChange(order.order_id)}
                        disabled={updating === order.order_id}
                        style={{ padding: "0 16px", background: "transparent", border: "1px solid rgba(201,168,76,0.2)", color: gold, cursor: "pointer", fontSize: "0.65rem", fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}
                      >
                        {updating === order.order_id ? "..." : "Cambiar estado"}
                      </button>
                      <a href={`/rastreo?orderId=${order.order_id}`} target="_blank" rel="noreferrer">
                        <button style={{ padding: "0 12px", height: "100%", background: "transparent", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(245,240,232,0.3)", cursor: "pointer", fontSize: "0.65rem", fontFamily: "'Cinzel', serif" }}>
                          Ver ↗
                        </button>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
