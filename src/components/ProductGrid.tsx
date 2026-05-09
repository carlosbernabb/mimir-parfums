"use client";

import { useState, useEffect } from "react";
import { type Product } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [allProducts, setAllProducts] = useState<Product[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setAllProducts(data.products ?? []);
      })
      .catch(() => {
        setAllProducts([]);
        setLoadError(true);
      });
  }, []);

  return (
    <section id="collection" style={{ padding: "34px 0 64px" }}>
      <div style={{ textAlign: "center", marginBottom: 40, padding: "0 24px" }}>
        <p
          className="font-display"
          style={{
            fontSize: "0.55rem",
            letterSpacing: "0.4em",
            color: "var(--gold)",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Best sellers y ofertas
        </p>
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(1.6rem, 6vw, 2.4rem)",
            fontWeight: 400,
            letterSpacing: "0.06em",
            marginBottom: 16,
          }}
        >
          Elige tu perfume
        </h2>
        <div className="ornament-line" style={{ maxWidth: 280, margin: "0 auto" }}>
          <span style={{ color: "var(--gold)", fontSize: "0.7rem" }}>◆</span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1px",
          maxWidth: 600,
          margin: "0 auto",
          background: "rgba(201,168,76,0.08)",
          border: "1px solid rgba(201,168,76,0.08)",
        }}
      >
        {allProducts === null
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "0.72",
                  background: "linear-gradient(145deg, rgba(26,8,8,0.7) 0%, rgba(15,15,15,0.9) 100%)",
                  border: "1px solid rgba(201,168,76,0.06)",
                  opacity: 0.45,
                }}
              />
            ))
          : allProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: "0.75rem",
          color: "rgba(245,240,232,0.25)",
          fontStyle: "italic",
          marginTop: 32,
          padding: "0 24px",
        }}
      >
        {loadError
          ? "No pudimos cargar la coleccion. Recarga la pagina para intentar de nuevo."
          : "Toca cualquier perfume para ver notas, descripcion y agregarlo al carrito."}
      </p>
    </section>
  );
}
