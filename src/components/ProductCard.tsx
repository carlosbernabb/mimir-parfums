"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import ProductModal from "./ProductModal";
import PerfumeBottleSVG from "./PerfumeBottleSVG";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const perfumeColors = [
    { bg: "#1a0808", accent: "#8B1A1A" },
    { bg: "#0a0a14", accent: "#2a1a5e" },
    { bg: "#0d0a04", accent: "#5c3d0a" },
    { bg: "#080d0a", accent: "#0a3d1a" },
    { bg: "#0a0a0a", accent: "#2d2d2d" },
    { bg: "#0d080d", accent: "#3d0a3d" },
  ];
  const colors = perfumeColors[index % perfumeColors.length];
  const hasOffer = product.originalPrice && product.originalPrice > product.price;
  const savings = hasOffer ? product.originalPrice! - product.price : 0;

  return (
    <>
      <div
        className="product-card"
        style={{
          background: `linear-gradient(145deg, ${colors.bg} 0%, #0f0f0f 100%)`,
          border: "1px solid rgba(201,168,76,0.1)",
          cursor: "pointer",
          animationDelay: `${index * 0.1}s`,
          opacity: 0,
          animation: `fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) ${index * 0.1}s forwards`,
        }}
        onClick={() => setModalOpen(true)}
      >
        {/* Product image area */}
        <div
          style={{
            aspectRatio: "1",
            background: `radial-gradient(ellipse at 50% 80%, ${colors.accent}20 0%, transparent 70%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            padding: "24px",
          }}
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={200}
              height={200}
              style={{ objectFit: "contain", maxHeight: 200 }}
            />
          ) : (
            <PerfumeBottleSVG color={colors.accent} name={product.name} size={80} />
          )}

          {/* Ver Detalles overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: 12,
              opacity: 0,
              transition: "opacity 0.2s",
            }}
            className="card-details-overlay"
          >
            <span
              style={{
                fontSize: "0.55rem",
                fontFamily: "'Cinzel', serif",
                letterSpacing: "0.18em",
                color: "var(--gold)",
                border: "1px solid rgba(201,168,76,0.5)",
                padding: "5px 12px",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
              }}
            >
              VER DETALLES
            </span>
          </div>

          {/* Volume badge */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(201,168,76,0.2)",
              padding: "3px 8px",
              fontSize: "0.55rem",
              fontFamily: "'Cinzel', serif",
              letterSpacing: "0.15em",
              color: "var(--gold)",
            }}
          >
            {product.volume}
          </div>

          {hasOffer && (
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                background: "linear-gradient(135deg, #c91538 0%, #f1d778 100%)",
                color: "#fff7dc",
                padding: "8px 12px",
                fontSize: "0.68rem",
                fontFamily: "'Cinzel', serif",
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                boxShadow: "0 12px 30px rgba(201,21,56,0.35)",
                border: "1px solid rgba(255,247,220,0.22)",
              }}
            >
              Ahorra ${savings.toLocaleString()}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "16px", borderTop: "1px solid rgba(201,168,76,0.08)" }}>
          <p
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              color: "var(--gold)",
              fontFamily: "'Cinzel', serif",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            {product.subtitle}
          </p>
          <h3
            className="font-display"
            style={{
              fontSize: "1.1rem",
              fontWeight: 500,
              letterSpacing: "0.05em",
              marginBottom: 12,
            }}
          >
            {product.name}
          </h3>

          <div className="gold-line" style={{ marginBottom: 12 }} />

          <div className="flex items-center justify-between" style={{ gap: 12 }}>
            <div>
              {hasOffer && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.82rem",
                      color: "#d21f3c",
                      textDecoration: "line-through",
                      textDecorationThickness: 2,
                      textDecorationColor: "#d21f3c",
                    }}
                  >
                    ${product.originalPrice?.toLocaleString()}
                  </span>
                  <span
                    style={{
                      fontSize: "0.48rem",
                      color: "var(--gold)",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {product.saleEnds}
                  </span>
                </div>
              )}
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: hasOffer ? "1.12rem" : "1rem",
                  color: "var(--cream)",
                  letterSpacing: "0.02em",
                }}
              >
                ${product.price.toLocaleString()} <span style={{ fontSize: "0.6rem", color: "var(--cream-dim)" }}>MXN</span>
              </span>
            </div>
            <button
              className="btn-primary"
              style={{ padding: "8px 16px", fontSize: "0.58rem" }}
              onClick={handleAdd}
            >
              {added ? "✓ Agregado" : "+ Carrito"}
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <ProductModal
          product={product}
          onClose={() => setModalOpen(false)}
          color={colors.accent}
        />
      )}
    </>
  );
}
