"use client";

export default function SidePillars() {
  return (
    <>
      <div style={{
        position: "fixed", left: 0, top: 0, width: 110, height: "100vh",
        zIndex: 1, pointerEvents: "none", overflow: "hidden",
      }}>
        <ArabicPanel />
      </div>
      <div style={{
        position: "fixed", right: 0, top: 0, width: 110, height: "100vh",
        zIndex: 1, pointerEvents: "none", overflow: "hidden",
        transform: "scaleX(-1)",
      }}>
        <ArabicPanel />
      </div>
    </>
  );
}

function ArabicPanel() {
  const stroke = "rgba(210,200,185,0.09)";
  const strokeBright = "rgba(220,210,195,0.14)";
  const fill = "rgba(200,190,175,0.03)";

  // Horseshoe arch (arco de herradura árabe/morisco)
  // Width: 110, arch unit height: 300
  // Arch opening: x=25 to x=85, rises from y=240 up to peak y=90
  // Horseshoe = the arc goes past 180° inward at the bottom
  const archPath = (y: number) => {
    const cx = 55, base = y + 270, top = y + 88;
    const rx = 30, ry = 38;
    // horseshoe: starts at (25, base), curves up and over, ends at (85, base)
    // inward kick at the base (goes slightly inward before rising)
    return (
      <g key={y}>
        {/* Main arch outline */}
        <path
          d={`
            M ${cx - rx} ${base}
            L ${cx - rx} ${top + ry * 0.4}
            A ${rx} ${ry} 0 1 1 ${cx + rx} ${top + ry * 0.4}
            L ${cx + rx} ${base}
          `}
          fill={fill}
          stroke={strokeBright}
          strokeWidth="0.7"
        />
        {/* Inner arch border */}
        <path
          d={`
            M ${cx - rx + 5} ${base}
            L ${cx - rx + 5} ${top + ry * 0.4 + 3}
            A ${rx - 5} ${ry - 4} 0 1 1 ${cx + rx - 5} ${top + ry * 0.4 + 3}
            L ${cx + rx - 5} ${base}
          `}
          fill="none"
          stroke={stroke}
          strokeWidth="0.4"
        />

        {/* Arch keystone ornament at top */}
        <ellipse cx={cx} cy={top + 1} rx="5" ry="7" fill="none" stroke={strokeBright} strokeWidth="0.6" />
        <ellipse cx={cx} cy={top + 1} rx="2" ry="3" fill={fill} />

        {/* Geometric star inside arch — 8-pointed */}
        <StarShape cx={cx} cy={y + 175} r={16} stroke={stroke} />

        {/* Arch spandrel dots */}
        <circle cx={cx - 20} cy={top + 30} r="2.5" fill="none" stroke={stroke} strokeWidth="0.5" />
        <circle cx={cx + 20} cy={top + 30} r="2.5" fill="none" stroke={stroke} strokeWidth="0.5" />
        <circle cx={cx - 20} cy={top + 30} r="1" fill={stroke} />
        <circle cx={cx + 20} cy={top + 30} r="1" fill={stroke} />

        {/* Horizontal ornamental band above arch */}
        <line x1="12" y1={y + 78} x2="98" y2={y + 78} stroke={stroke} strokeWidth="0.6" />
        {/* geometric notches on band */}
        {[22, 34, 46, 55, 64, 76, 88].map((x) => (
          <rect key={x} x={x - 3} y={y + 73} width="6" height="5"
            fill={fill} stroke={stroke} strokeWidth="0.35" />
        ))}
        <line x1="12" y1={y + 74} x2="98" y2={y + 74} stroke={stroke} strokeWidth="0.35" />

        {/* Slender column shafts on sides */}
        <rect x="12" y={y} width="7" height="300" fill={fill} />
        <rect x="91" y={y} width="7" height="300" fill={fill} />
        <line x1="13" y1={y} x2="13" y2={y + 300} stroke={stroke} strokeWidth="0.5" />
        <line x1="97" y1={y} x2="97" y2={y + 300} stroke={stroke} strokeWidth="0.5" />
        {/* column inner stripe */}
        <line x1="16" y1={y} x2="16" y2={y + 300} stroke={stroke} strokeWidth="0.3" />
        <line x1="94" y1={y} x2="94" y2={y + 300} stroke={stroke} strokeWidth="0.3" />

        {/* Column capital */}
        <rect x="8" y={y + 280} width="15" height="5" rx="1"
          fill={fill} stroke={strokeBright} strokeWidth="0.5" />
        <rect x="87" y={y + 280} width="15" height="5" rx="1"
          fill={fill} stroke={strokeBright} strokeWidth="0.5" />

        {/* Column base */}
        <rect x="6" y={y + 294} width="19" height="6" rx="1"
          fill={fill} stroke={stroke} strokeWidth="0.4" />
        <rect x="85" y={y + 294} width="19" height="6" rx="1"
          fill={fill} stroke={stroke} strokeWidth="0.4" />

        {/* Outer thin border line */}
        <line x1="3" y1={y} x2="3" y2={y + 300} stroke={stroke} strokeWidth="0.4" strokeDasharray="3 10" />

        {/* Subtle Arabic zellige strip at bottom of each unit */}
        <ZelligeStrip y={y + 300} stroke={stroke} />
      </g>
    );
  };

  const units = [];
  for (let i = 0; i < 8; i++) units.push(archPath(i * 300));

  return (
    <svg width="110" height="100%" viewBox="0 0 110 2400" preserveAspectRatio="xMidYMin slice" style={{ display: "block" }}>
      <defs>
        <linearGradient id="vfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#080808" stopOpacity="1" />
          <stop offset="6%" stopColor="#080808" stopOpacity="0" />
          <stop offset="94%" stopColor="#080808" stopOpacity="0" />
          <stop offset="100%" stopColor="#080808" stopOpacity="1" />
        </linearGradient>
      </defs>
      {units}
      <rect x="0" y="0" width="110" height="2400" fill="url(#vfade)" />
    </svg>
  );
}

// 8-pointed Islamic star (octagram)
function StarShape({ cx, cy, r, stroke }: { cx: number; cy: number; r: number; stroke: string }) {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * Math.PI) / 8 - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.42;
    return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
  }).join(" ");
  return (
    <g>
      <polygon points={pts} fill="none" stroke={stroke} strokeWidth="0.5" />
      {/* center dot */}
      <circle cx={cx} cy={cy} r="2" fill="none" stroke={stroke} strokeWidth="0.4" />
    </g>
  );
}

// Zellige-inspired geometric strip
function ZelligeStrip({ y, stroke }: { y: number; stroke: string }) {
  return (
    <g>
      {Array.from({ length: 8 }).map((_, i) => {
        const x = 10 + i * 12;
        return (
          <g key={i}>
            <rect x={x} y={y + 2} width="8" height="8"
              fill="none" stroke={stroke} strokeWidth="0.4"
              transform={`rotate(45 ${x + 4} ${y + 6})`} />
          </g>
        );
      })}
      <line x1="8" y1={y} x2="102" y2={y} stroke={stroke} strokeWidth="0.5" />
      <line x1="8" y1={y + 14} x2="102" y2={y + 14} stroke={stroke} strokeWidth="0.5" />
    </g>
  );
}
