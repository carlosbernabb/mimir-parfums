"use client";

const moods = [
  {
    title: "Para citas",
    copy: "Dulces, cálidos y memorables.",
  },
  {
    title: "Para oficina",
    copy: "Limpios, elegantes y seguros.",
  },
  {
    title: "Para noche",
    copy: "Oscuros, intensos y dominantes.",
  },
  {
    title: "Para diario",
    copy: "Versátiles, frescos y fáciles.",
  },
];

export default function ScentGuide() {
  return (
    <section
      id="scent-guide"
      style={{
        padding: "26px 20px 14px",
        borderTop: "1px solid rgba(201,168,76,0.08)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <p
          className="font-display"
          style={{
            fontSize: "0.55rem",
            letterSpacing: "0.32em",
            color: "var(--gold)",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Encuentra tu aroma
        </p>
        <h2
          className="font-display"
          style={{
            fontSize: "1.45rem",
            fontWeight: 400,
            letterSpacing: "0.04em",
          }}
        >
          Compra por ocasión
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, background: "rgba(201,168,76,0.1)" }}>
        {moods.map((mood) => (
          <a
            key={mood.title}
            href="#collection"
            style={{
              minHeight: 100,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 6,
              padding: "16px 14px",
              background: "rgba(10,10,10,0.86)",
              textDecoration: "none",
            }}
          >
            <span
              className="font-display"
              style={{
                color: "var(--cream)",
                fontSize: "0.9rem",
                letterSpacing: "0.07em",
              }}
            >
              {mood.title}
            </span>
            <span style={{ color: "rgba(245,240,232,0.52)", fontSize: "0.82rem", lineHeight: 1.25 }}>
              {mood.copy}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
