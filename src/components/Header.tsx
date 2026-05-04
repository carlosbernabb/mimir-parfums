"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";

export default function Header() {
  const { count, openCart } = useCart();
  const itemCount = count();

  return (
    <header
      className="glass sticky top-0 z-40"
      style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}
    >
      <div
        className="flex items-center justify-between"
        style={{ padding: "10px 20px", maxWidth: 600, margin: "0 auto" }}
      >
        <div className="flex items-center">
          <div>
            <p
              className="font-display"
              style={{ fontSize: "1.15rem", letterSpacing: "0.2em", lineHeight: 1 }}
            >
              MIMIR
            </p>
            <p
              style={{
                fontSize: "0.48rem",
                letterSpacing: "0.32em",
                color: "var(--gold)",
                fontFamily: "'Cinzel', serif",
                textTransform: "uppercase",
              }}
            >
              Parfums
            </p>
          </div>
        </div>

        {/* Tracking link */}
        <Link href="/rastreo" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontSize: "0.52rem",
              letterSpacing: "0.18em",
              color: "rgba(201,168,76,0.5)",
              fontFamily: "'Cinzel', serif",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(201,168,76,0.9)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(201,168,76,0.5)")}
          >
            Rastrear Pedido
          </span>
        </Link>

        {/* Cart button */}
        <button
          onClick={openCart}
          className="relative flex items-center gap-2"
          style={{
            background: "transparent",
            border: "1px solid rgba(201,168,76,0.25)",
            color: "var(--cream)",
            padding: "8px 16px",
            cursor: "pointer",
            fontFamily: "'Cinzel', serif",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,168,76,0.6)";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,168,76,0.25)";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <CartIcon />
          <span>Carrito</span>
          {itemCount > 0 && (
            <span
              style={{
                background: "var(--crimson-bright)",
                color: "#fff",
                borderRadius: "50%",
                width: 18,
                height: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.6rem",
                fontFamily: "sans-serif",
                fontWeight: 700,
                marginLeft: 2,
              }}
            >
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
