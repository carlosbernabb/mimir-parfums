"use client";

const reviews = [
  {
    name: "Carlos M.",
    city: "Monterrey",
    perfume: "Afnan 9PM Night Out",
    text: "me paran en la calle a preguntar que perfume traigo jajaja, vale lo que cuesta",
    stars: 5,
  },
  {
    name: "Fernanda R.",
    city: "CDMX",
    perfume: "Lattafa Haya for Women",
    text: "llegó bien empacado, el olor dura bastante sin reaplicar, ya lo compré 2 veces la verdad",
    stars: 4,
  },
  {
    name: "Diego S.",
    city: "Guadalajara",
    perfume: "Lattafa Al Qiam Gold",
    text: "honestamente pensé que no iba a durar tanto pero me sorprendió, la proyección es real. solo le quito una estrella porque tardó un poco el envío pero el perfume esta muy bueno",
    stars: 3.5,
  },
  {
    name: "Paola V.",
    city: "Puebla",
    perfume: "Armaf Eter Arabian Sky",
    text: "me lo regalaron y desde la primera vez que lo use no lo he soltado!! todos me preguntan cual es, lo recomiendo mucho",
    stars: 5,
  },
  {
    name: "Andrés T.",
    city: "Querétaro",
    perfume: "Afnan Zimaya Mazaaj",
    text: "de esos perfumes que se quedan contigo todo el dia sin reaplicar, lo compré para mi cumpleaños y no me arrepiento",
    stars: 4.5,
  },
];

const gold = "#C9A84C";

function StarRating({ stars }: { stars: number }) {
  const full = Math.floor(stars);
  const half = stars % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f${i}`} style={{ color: gold, fontSize: "0.7rem" }}>★</span>
      ))}
      {half && (
        <span style={{ color: gold, fontSize: "0.7rem", opacity: 0.7 }}>★</span>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e${i}`} style={{ color: "rgba(201,168,76,0.25)", fontSize: "0.7rem" }}>★</span>
      ))}
    </div>
  );
}

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
          Reseñas
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
              <StarRating stars={r.stars} />
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
