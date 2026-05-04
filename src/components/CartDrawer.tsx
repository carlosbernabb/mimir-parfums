"use client";

"use client";

import { useState } from "react";
import { useCart, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/cart-store";
import CheckoutModal from "./CheckoutModal";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, shipping, total, count, discountApplied, applyDiscount, removeDiscount } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [discountError, setDiscountError] = useState(false);

  if (!isOpen && !checkoutOpen) return null;

  return (
    <>
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <div
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
            style={{
              width: "min(400px, 100vw)",
              background: "#0f0f0f",
              borderLeft: "1px solid rgba(201,168,76,0.15)",
              animation: "slideInRight 0.35s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid rgba(201,168,76,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2
                  className="font-display"
                  style={{ fontSize: "1rem", letterSpacing: "0.1em" }}
                >
                  Tu Carrito
                </h2>
                <p style={{ fontSize: "0.7rem", color: "var(--cream-dim)", marginTop: 2 }}>
                  {count()} {count() === 1 ? "artículo" : "artículos"}
                </p>
              </div>
              <button
                onClick={closeCart}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(201,168,76,0.2)",
                  color: "var(--cream)",
                  width: 36,
                  height: 36,
                  cursor: "pointer",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
              {items.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 24px",
                    color: "rgba(245,240,232,0.3)",
                  }}
                >
                  <p style={{ fontSize: "2rem", marginBottom: 12 }}>◈</p>
                  <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>Tu carrito está vacío</p>
                  <p style={{ fontSize: "0.75rem", marginTop: 8 }}>Descubre nuestra colección</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.product.id}
                    style={{
                      padding: "16px 24px",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      display: "flex",
                      gap: 16,
                      alignItems: "center",
                    }}
                  >
                    {/* Mini bottle icon */}
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        background: "rgba(139,26,26,0.1)",
                        border: "1px solid rgba(201,168,76,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: "1.3rem",
                      }}
                    >
                      🫧
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        className="font-display"
                        style={{
                          fontSize: "0.85rem",
                          letterSpacing: "0.04em",
                          marginBottom: 2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.product.name}
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "var(--cream-dim)" }}>
                        {item.product.volume}
                      </p>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--gold)",
                          fontFamily: "'Cinzel', serif",
                          marginTop: 4,
                        }}
                      >
                        ${(item.product.price * item.quantity).toLocaleString()} MXN
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        style={{
                          width: 28,
                          height: 28,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(201,168,76,0.15)",
                          color: "var(--cream)",
                          cursor: "pointer",
                          fontSize: "1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: "0.85rem",
                          minWidth: 16,
                          textAlign: "center",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        style={{
                          width: 28,
                          height: 28,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(201,168,76,0.15)",
                          color: "var(--cream)",
                          cursor: "pointer",
                          fontSize: "1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                style={{
                  padding: "20px 24px",
                  borderTop: "1px solid rgba(201,168,76,0.1)",
                  paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
                }}
              >
                {/* Discount code */}
                {!discountApplied ? (
                  <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                    <input
                      className="input-luxury"
                      placeholder="Código de descuento"
                      value={discountInput}
                      onChange={(e) => { setDiscountInput(e.target.value.toUpperCase()); setDiscountError(false); }}
                      style={{ flex: 1, fontSize: "0.8rem", padding: "10px 12px", letterSpacing: "0.08em" }}
                    />
                    <button
                      onClick={() => {
                        const ok = applyDiscount(discountInput);
                        if (!ok) setDiscountError(true);
                        else setDiscountInput("");
                      }}
                      style={{
                        padding: "0 14px",
                        background: "transparent",
                        border: "1px solid rgba(201,168,76,0.35)",
                        color: "var(--gold)",
                        cursor: "pointer",
                        fontSize: "0.65rem",
                        fontFamily: "'Cinzel', serif",
                        letterSpacing: "0.08em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Aplicar
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, padding: "8px 12px", background: "rgba(100,200,100,0.06)", border: "1px solid rgba(100,200,100,0.2)" }}>
                    <p style={{ fontSize: "0.7rem", color: "rgba(120,220,120,0.9)", fontFamily: "'Cinzel', serif", letterSpacing: "0.06em" }}>
                      ✓ Código aplicado
                    </p>
                    <button
                      onClick={removeDiscount}
                      style={{ background: "transparent", border: "none", color: "rgba(245,240,232,0.3)", cursor: "pointer", fontSize: "0.7rem", padding: 0 }}
                    >
                      ✕
                    </button>
                  </div>
                )}
                {discountError && (
                  <p style={{ fontSize: "0.65rem", color: "#e74c3c", marginTop: -10, marginBottom: 10, fontStyle: "italic" }}>
                    Código no válido
                  </p>
                )}

                {/* Free shipping banner */}
                {subtotal() < FREE_SHIPPING_THRESHOLD && subtotal() > 0 && !discountApplied && (
                  <div
                    style={{
                      background: "rgba(201,168,76,0.07)",
                      border: "1px solid rgba(201,168,76,0.2)",
                      padding: "10px 14px",
                      marginBottom: 14,
                      textAlign: "center",
                    }}
                  >
                    <p style={{ fontSize: "0.65rem", color: "var(--gold)", fontFamily: "'Cinzel', serif", letterSpacing: "0.06em" }}>
                      ¡Envío GRATIS en compras de ${FREE_SHIPPING_THRESHOLD.toLocaleString()} MXN o más!
                    </p>
                    <p style={{ fontSize: "0.58rem", color: "rgba(245,240,232,0.4)", marginTop: 3, fontStyle: "italic" }}>
                      Te faltan ${(FREE_SHIPPING_THRESHOLD - subtotal()).toLocaleString()} MXN para envío gratis
                    </p>
                  </div>
                )}

                {(subtotal() >= FREE_SHIPPING_THRESHOLD) && !discountApplied && (
                  <div
                    style={{
                      background: "rgba(100,200,100,0.06)",
                      border: "1px solid rgba(100,200,100,0.2)",
                      padding: "10px 14px",
                      marginBottom: 14,
                      textAlign: "center",
                    }}
                  >
                    <p style={{ fontSize: "0.65rem", color: "rgba(120,220,120,0.9)", fontFamily: "'Cinzel', serif", letterSpacing: "0.06em" }}>
                      ✓ ¡Envío GRATIS aplicado!
                    </p>
                  </div>
                )}

                {/* Subtotal */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.45)", fontStyle: "italic" }}>
                    Subtotal
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--cream-dim)", fontFamily: "'Cinzel', serif" }}>
                    ${subtotal().toLocaleString()} MXN
                  </span>
                </div>

                {/* Shipping */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.45)", fontStyle: "italic" }}>
                    Envío a México
                  </span>
                  {shipping() === 0 ? (
                    <span style={{ fontSize: "0.78rem", color: "rgba(120,220,120,0.85)", fontFamily: "'Cinzel', serif" }}>
                      GRATIS
                    </span>
                  ) : (
                    <span style={{ fontSize: "0.78rem", color: "var(--cream-dim)", fontFamily: "'Cinzel', serif" }}>
                      ${SHIPPING_COST.toLocaleString()} MXN
                    </span>
                  )}
                </div>

                <div className="gold-line" style={{ marginBottom: 14 }} />

                {/* Total */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 16,
                    alignItems: "flex-end",
                  }}
                >
                  <span style={{ fontSize: "0.8rem", color: "var(--cream-dim)", fontStyle: "italic" }}>
                    Total del pedido
                  </span>
                  <span
                    className="font-display"
                    style={{ fontSize: "1.3rem", letterSpacing: "0.02em" }}
                  >
                    ${total().toLocaleString()}
                    <span style={{ fontSize: "0.65rem", color: "var(--cream-dim)", marginLeft: 4 }}>MXN</span>
                  </span>
                </div>

                <button
                  className="btn-primary"
                  style={{ width: "100%", padding: "16px" }}
                  onClick={() => {
                    closeCart();
                    setCheckoutOpen(true);
                  }}
                >
                  Proceder al Pago
                </button>
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "0.6rem",
                    color: "rgba(245,240,232,0.2)",
                    marginTop: 8,
                    fontStyle: "italic",
                  }}
                >
                  Pago seguro con Stripe · Envío a toda México
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {checkoutOpen && (
        <CheckoutModal
          onClose={() => setCheckoutOpen(false)}
          onBack={() => {
            setCheckoutOpen(false);
          }}
        />
      )}
    </>
  );
}
