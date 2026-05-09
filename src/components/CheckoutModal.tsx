"use client";

import { useState } from "react";
import { useCart, SHIPPING_COST } from "@/lib/cart-store";
import { discountDisplay } from "@/lib/discounts";

interface CheckoutModalProps {
  onClose: () => void;
  onBack: () => void;
}

interface ShippingData {
  nombre: string;
  email: string;
  telefono: string;
  calle: string;
  numero: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
}

const ESTADOS = [
  "Aguascalientes","Baja California","Baja California Sur","Campeche","Chiapas","Chihuahua",
  "Ciudad de México","Coahuila","Colima","Durango","Estado de México","Guanajuato","Guerrero",
  "Hidalgo","Jalisco","Michoacán","Morelos","Nayarit","Nuevo León","Oaxaca","Puebla","Querétaro",
  "Quintana Roo","San Luis Potosí","Sinaloa","Sonora","Tabasco","Tamaulipas","Tlaxcala","Veracruz",
  "Yucatán","Zacatecas",
];

export default function CheckoutModal({ onClose, onBack }: CheckoutModalProps) {
  const { items, subtotal, shipping: shippingCost, total, discountApplied, discountPercent, discountAmount, discountCode, discount } = useCart();
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shipping, setShipping] = useState<ShippingData>({
    nombre: "", email: "", telefono: "", calle: "", numero: "", colonia: "",
    ciudad: "", estado: "", codigoPostal: "",
  });

  const updateField = (field: keyof ShippingData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setShipping((s) => ({ ...s, [field]: e.target.value }));

  const validateShipping = () => {
    const required: (keyof ShippingData)[] = ["nombre","email","telefono","calle","numero","colonia","ciudad","estado","codigoPostal"];
    return required.every((f) => shipping[f].trim().length > 0);
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.product.id, quantity: i.quantity })),
          shipping,
          discountCode: discountApplied ? discountCode : "",
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Error al procesar el pago. Intenta de nuevo.");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="animate-scale-in"
        style={{
          background: "linear-gradient(180deg, #111111 0%, #0c0c0c 100%)",
          border: "1px solid rgba(201,168,76,0.15)",
          width: "100%",
          maxWidth: 500,
          maxHeight: "95vh",
          overflowY: "auto",
          borderRadius: "16px 16px 0 0",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid rgba(201,168,76,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            background: "#111111",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {step === "shipping" && (
              <button
                onClick={onBack}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--cream-dim)",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  padding: 4,
                }}
              >
                ←
              </button>
            )}
            <div>
              <h2 className="font-display" style={{ fontSize: "0.95rem", letterSpacing: "0.1em" }}>
                {step === "shipping" ? "Datos de Envío" : step === "payment" ? "Confirmar Pedido" : "¡Pedido Enviado!"}
              </h2>
              {step !== "success" && (
                <p style={{ fontSize: "0.6rem", color: "var(--gold)", marginTop: 2, fontFamily: "'Cinzel', serif", letterSpacing: "0.1em" }}>
                  Paso {step === "shipping" ? "1" : "2"} de 2
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(201,168,76,0.2)",
              color: "var(--cream)",
              width: 34,
              height: 34,
              cursor: "pointer",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "24px" }}>
          {step === "shipping" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (validateShipping()) setStep("payment");
              }}
            >
              <div style={{ display: "grid", gap: 12 }}>
                <Field label="Nombre completo" value={shipping.nombre} onChange={updateField("nombre")} placeholder="Ej. Carlos Ramírez López" required />
                <Field label="Correo electrónico" value={shipping.email} onChange={updateField("email")} placeholder="tu@correo.com" type="email" required />
                <Field label="Número de teléfono" value={shipping.telefono} onChange={updateField("telefono")} placeholder="Ej. 55 1234 5678" type="tel" required />
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
                  <Field label="Calle" value={shipping.calle} onChange={updateField("calle")} placeholder="Ej. Av. Insurgentes Sur" required />
                  <Field label="Número" value={shipping.numero} onChange={updateField("numero")} placeholder="123 Int. A" required />
                </div>
                <Field label="Colonia" value={shipping.colonia} onChange={updateField("colonia")} placeholder="Ej. Del Valle" required />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Ciudad" value={shipping.ciudad} onChange={updateField("ciudad")} placeholder="Ej. Ciudad de México" required />
                  <SelectField label="Estado" value={shipping.estado} onChange={updateField("estado")} options={ESTADOS} required />
                </div>
                <Field label="Código Postal" value={shipping.codigoPostal} onChange={updateField("codigoPostal")} placeholder="Ej. 03100" type="number" required />
              </div>

              <button
                className="btn-primary"
                style={{ width: "100%", marginTop: 24, padding: 15 }}
                type="submit"
              >
                Continuar al Pago →
              </button>
            </form>
          )}

          {step === "payment" && (
            <div>
              {/* Order summary */}
              <div style={{ marginBottom: 20 }}>
                <p className="font-display" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 12 }}>
                  Resumen del Pedido
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {items.map((item) => (
                    <div key={item.product.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <span style={{ color: "var(--cream-dim)" }}>
                        {item.product.name} × {item.quantity}
                      </span>
                      <span style={{ fontFamily: "'Cinzel', serif" }}>
                        ${(item.product.price * item.quantity).toLocaleString()} MXN
                      </span>
                    </div>
                  ))}
                </div>
                <div className="gold-line" style={{ marginBottom: 12 }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontStyle: "italic", color: "rgba(245,240,232,0.45)", fontSize: "0.78rem" }}>Subtotal</span>
                  <span style={{ fontSize: "0.78rem", color: "var(--cream-dim)", fontFamily: "'Cinzel', serif" }}>
                    ${subtotal().toLocaleString()} MXN
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: discountApplied ? 6 : 12 }}>
                  <span style={{ fontStyle: "italic", color: "rgba(245,240,232,0.45)", fontSize: "0.78rem" }}>Envío a México</span>
                  {shippingCost() === 0 ? (
                    <span style={{ fontSize: "0.78rem", color: "rgba(120,220,120,0.85)", fontFamily: "'Cinzel', serif" }}>GRATIS</span>
                  ) : (
                    <span style={{ fontSize: "0.78rem", color: "var(--cream-dim)", fontFamily: "'Cinzel', serif" }}>${SHIPPING_COST.toLocaleString()} MXN</span>
                  )}
                </div>
                {discountApplied && discountAmount() > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: "0.7rem", color: "rgba(120,220,120,0.8)", fontStyle: "italic" }}>✓ {discountPercent > 0 ? `Descuento ${discountPercent}%` : discountDisplay(discount)}</span>
                    <span style={{ fontSize: "0.7rem", color: "rgba(120,220,120,0.8)", fontFamily: "'Cinzel', serif" }}>−${discountAmount().toLocaleString()} MXN</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontStyle: "italic", color: "var(--cream-dim)", fontSize: "0.8rem" }}>Total</span>
                  <span className="font-display" style={{ fontSize: "1.3rem" }}>
                    ${total().toLocaleString()} MXN
                  </span>
                </div>
              </div>

              {/* Shipping address summary */}
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(201,168,76,0.1)",
                  padding: "14px 16px",
                  marginBottom: 20,
                }}
              >
                <p style={{ fontSize: "0.55rem", letterSpacing: "0.15em", color: "var(--gold)", fontFamily: "'Cinzel', serif", textTransform: "uppercase", marginBottom: 8 }}>
                  Dirección de Envío
                </p>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "var(--cream-dim)", fontStyle: "italic" }}>
                  {shipping.nombre}<br />
                  {shipping.calle} {shipping.numero}, {shipping.colonia}<br />
                  {shipping.ciudad}, {shipping.estado} {shipping.codigoPostal}<br />
                  Tel: {shipping.telefono}
                </p>
                <button
                  onClick={() => setStep("shipping")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--gold)",
                    fontSize: "0.65rem",
                    cursor: "pointer",
                    marginTop: 8,
                    textDecoration: "underline",
                    fontStyle: "italic",
                    padding: 0,
                  }}
                >
                  Cambiar dirección
                </button>
              </div>

              {error && (
                <p style={{ color: "#e74c3c", fontSize: "0.8rem", marginBottom: 12, textAlign: "center" }}>
                  {error}
                </p>
              )}

              <button
                className="btn-primary"
                style={{ width: "100%", padding: 16 }}
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? "Procesando..." : "Proceder al Pago →"}
              </button>

              {/* Trust badges */}
              <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 14 }}>
                {["🔒 Pago Seguro", "📦 Envío a México", "✓ Stripe Protegido"].map((badge) => (
                  <p key={badge} style={{ fontSize: "0.55rem", color: "rgba(245,240,232,0.25)", fontStyle: "italic" }}>
                    {badge}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", required,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.6rem",
          letterSpacing: "0.15em",
          color: "var(--gold)",
          fontFamily: "'Cinzel', serif",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <input
        className="input-luxury"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function SelectField({
  label, value, onChange, options, required,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.6rem",
          letterSpacing: "0.15em",
          color: "var(--gold)",
          fontFamily: "'Cinzel', serif",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <select
        className="input-luxury"
        value={value}
        onChange={onChange}
        required={required}
        style={{ appearance: "none", cursor: "pointer" }}
      >
        <option value="" disabled>Seleccionar...</option>
        {options.map((o) => (
          <option key={o} value={o} style={{ background: "#111" }}>{o}</option>
        ))}
      </select>
    </div>
  );
}
