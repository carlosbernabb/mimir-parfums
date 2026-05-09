"use client";

import { useState, useEffect } from "react";
import { products as staticProducts, type Product } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [allProducts, setAllProducts] = useState<Product[]>(staticProducts);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.products?.length) setAllProducts(data.products);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="collection" style={{ padding: "34px 0 64px" }}>
      {/* Section header */}
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

      {/* Grid */}
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
        {allProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      {/* Bottom note */}
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
        Toca cualquier perfume para ver notas, descripción y agregarlo al carrito.
      </p>
    </section>
  );
}
