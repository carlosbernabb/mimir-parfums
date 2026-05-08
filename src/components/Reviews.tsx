"use client";

const reviews = [
  {
    name: "Carlos M.",
    city: "Monterrey",
    perfume: "Afnan 9PM Night Out",
    text: "Me paran en la calle a preguntar qué perfume traigo. Literalmente cada vez que salgo. Vale cada peso, no lo cambio por nada.",
    stars: 5,
  },
  {
    name: "Fernanda R.",
    city: "CDMX",
    perfume: "Lattafa Haya for Women",
    text: "Llegó súper bien empacado y el aroma dura todo el día sin retoques. Ya pedí el segundo frasco, esta vez para regalar.",
    stars: 5,
  },
  {
    name: "Diego S.",
    city: "Guadalajara",
    perfume: "Lattafa Al Qiam Gold",
    text: "Pensé que era exagerado pagar esto por un perfume árabe pero con la primera aplicación entendí todo. Proyecta brutal.",
    stars: 5,
  },
  {
    name: "Paola V.",
    city: "Puebla",
    perfume: "Armaf Eter Arabian Sky",
    text: "Es el perfume más elegante que he tenido. Lo uso para trabajar y me han preguntado si es de diseñador europeo.",
    stars: 5,
  },
  {
    name: "Andrés T.",
    city: "Querétaro",
    perfume: "Afnan Zimaya Mazaaj",
    text: "El envío fue rapidísimo, en 3 días llegó. El perfume es exactamente como lo describen, muy intenso y de larga duración.",
    stars: 5,
  },
];

const gold = "#C9A84C";

export default function Reviews() {
  return (
    <section style={{ padding: "48px 0 32px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <p
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            color: gold,
            fontFamily: "'Cinzel', serif",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Lo que dicen nuestros clientes
        </p>
        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: 400,
            color: "#f5f0e8",
            letterSpacing: "0.05em",
            margin: 0,
          }}
        >
          Reseñas reales
        </h2>
        <div
          style={{
            width: 40,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
            margin: "12px auto 0",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {reviews.map((r, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(201,168,76,0.12)",
              borderLeft: `2px solid ${gold}`,
              borderRadius: 2,
              padding: "18px 20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#f5f0e8", fontWeight: 500 }}>
                  {r.name}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: "0.65rem", color: "rgba(245,240,232,0.35)", fontStyle: "italic" }}>
                  {r.city} · {r.perfume}
                </p>
              </div>
              <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                {Array.from({ length: r.stars }).map((_, s) => (
                  <span key={s} style={{ color: gold, fontSize: "0.7rem" }}>★</span>
                ))}
              </div>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "0.82rem",
                color: "rgba(245,240,232,0.72)",
                lineHeight: 1.7,
                fontStyle: "italic",
              }}
            >
              &ldquo;{r.text}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
