"use client";

import { useState } from "react";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import PerfumeBottleSVG from "./PerfumeBottleSVG";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  color: string;
}

export default function ProductModal({ product, onClose, color }: ProductModalProps) {
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCart();

  const handleAddAndOpen = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => {
      onClose();
      openCart();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="animate-scale-in"
        style={{
          background: "linear-gradient(180deg, #111111 0%, #0d0d0d 100%)",
          border: "1px solid rgba(201,168,76,0.15)",
          borderBottom: "none",
          width: "100%",
          maxWidth: 600,
          maxHeight: "88vh",
          overflowY: "auto",
          borderRadius: "16px 16px 0 0",
          padding: "0 0 env(safe-area-inset-bottom,0)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
          <div style={{ width: 40, height: 3, background: "rgba(201,168,76,0.2)", borderRadius: 2 }} />
        </div>

        {/* Image area */}
        <div
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${color}20 0%, transparent 70%)`,
            display: "flex",
            justifyContent: "center",
            padding: "20px 0 24px",
          }}
        >
          <PerfumeBottleSVG color={color} name={product.name} size={160} />
        </div>

        <div style={{ padding: "0 24px 32px" }}>
          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <p
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.25em",
                color: "var(--gold)",
                fontFamily: "'Cinzel', serif",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {product.subtitle}
            </p>
            <h2
              className="font-display"
              style={{ fontSize: "1.8rem", fontWeight: 400, letterSpacing: "0.06em", marginBottom: 4 }}
            >
              {product.name}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--cream-dim)", fontStyle: "italic" }}>
              {product.volume} · Eau de Parfum
            </p>
          </div>

          <div className="gold-line" style={{ marginBottom: 16 }} />

          {/* Description */}
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(245,240,232,0.75)",
              lineHeight: 1.7,
              fontStyle: "italic",
              marginBottom: 20,
            }}
          >
            {product.description}
          </p>

          {/* Notes pyramid */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(201,168,76,0.1)",
              padding: "16px",
              marginBottom: 24,
            }}
          >
            <p
              className="font-display"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                color: "var(--gold)",
                textTransform: "uppercase",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Pirámide Olfativa
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {(["top", "heart", "base"] as const).map((tier) => (
                <div key={tier} style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: "0.55rem",
                      letterSpacing: "0.15em",
                      color: "var(--cream-dim)",
                      textTransform: "uppercase",
                      fontFamily: "'Cinzel', serif",
                      marginBottom: 6,
                    }}
                  >
                    {tier === "top" ? "Salida" : tier === "heart" ? "Corazón" : "Base"}
                  </p>
                  {product.notes[tier].map((note) => (
                    <p
                      key={note}
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--cream)",
                        marginBottom: 2,
                        fontStyle: "italic",
                      }}
                    >
                      {note}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Price + CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: "0.55rem", color: "var(--cream-dim)", letterSpacing: "0.1em" }}>Precio</p>
              <p
                className="font-display"
                style={{ fontSize: "1.5rem", letterSpacing: "0.02em" }}
              >
                ${product.price.toLocaleString()}
                <span style={{ fontSize: "0.7rem", color: "var(--cream-dim)", marginLeft: 4 }}>MXN</span>
              </p>
            </div>
            <button
              className="btn-primary"
              style={{ padding: "14px 28px" }}
              onClick={handleAddAndOpen}
            >
              {added ? "✓ Agregado" : "Agregar al carrito"}
            </button>
          </div>

          <p
            style={{
              fontSize: "0.65rem",
              color: "rgba(245,240,232,0.25)",
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            Envío a toda la República Mexicana
          </p>
        </div>
      </div>
    </div>
  );
}
