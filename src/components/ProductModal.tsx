"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/products";
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
  const hasOffer = product.originalPrice && product.originalPrice > product.price;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            display: "flex",
            justifyContent: "center",
            padding: "14px 56px 10px",
            background: "linear-gradient(180deg, #111111 0%, rgba(17,17,17,0.92) 100%)",
          }}
        >
          <button
            type="button"
            aria-label="Cerrar detalles"
            onClick={onClose}
            style={{
              position: "absolute",
              inset: 0,
              border: "none",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
            }}
          />
          <div style={{ width: 58, height: 4, background: "rgba(201,168,76,0.36)", borderRadius: 2, zIndex: 1 }} />
          <button
            type="button"
            aria-label="Cerrar detalles"
            onClick={onClose}
            style={{
              position: "absolute",
              top: 7,
              right: 12,
              zIndex: 2,
              width: 34,
              height: 34,
              border: "1px solid rgba(201,168,76,0.22)",
              borderRadius: "50%",
              background: "rgba(0,0,0,0.36)",
              color: "var(--cream)",
              fontSize: "1.2rem",
              lineHeight: 1,
              cursor: "pointer",
            }}
          >
            ×
          </button>
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
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={260}
              height={260}
              style={{ objectFit: "contain", maxHeight: 260 }}
            />
          ) : (
            <PerfumeBottleSVG color={color} name={product.name} size={160} />
          )}
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
            {hasOffer && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 12,
                  padding: "6px 10px",
                  background: "rgba(201,168,76,0.12)",
                  border: "1px solid rgba(201,168,76,0.28)",
                  color: "var(--gold)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontFamily: "'Cinzel', serif",
                }}
              >
                <span>{product.saleLabel}</span>
                <span style={{ color: "rgba(245,240,232,0.5)" }}>
                  Ahorra ${((product.originalPrice ?? 0) - product.price).toLocaleString()}
                </span>
                <span>{product.saleEnds}</span>
              </div>
            )}
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
              {hasOffer && (
                <p
                  className="font-display"
                  style={{
                    fontSize: "0.9rem",
                    color: "#d21f3c",
                    letterSpacing: "0.02em",
                    textDecoration: "line-through",
                    textDecorationThickness: 2,
                    textDecorationColor: "#d21f3c",
                    marginBottom: 2,
                  }}
                >
                  ${product.originalPrice?.toLocaleString()} MXN
                </p>
              )}
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
