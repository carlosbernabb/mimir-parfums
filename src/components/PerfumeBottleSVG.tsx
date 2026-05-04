interface PerfumeBottleSVGProps {
  color: string;
  name: string;
  size?: number;
}

export default function PerfumeBottleSVG({ color, name, size = 100 }: PerfumeBottleSVGProps) {
  return (
    <svg
      viewBox="0 0 120 160"
      style={{
        width: size,
        height: size * (160 / 120),
        filter: `drop-shadow(0 12px 32px ${color}70)`,
      }}
      aria-label={name}
    >
      {/* Cap */}
      <rect x="45" y="10" width="30" height="20" rx="4" fill={color} opacity="0.95" />
      <rect x="50" y="6" width="20" height="8" rx="3" fill={color} opacity="0.8" />
      {/* Spray nozzle */}
      <rect x="60" y="2" width="10" height="7" rx="2" fill={color} opacity="0.6" />
      {/* Neck */}
      <rect x="51" y="30" width="18" height="16" rx="2" fill={`${color}95`} />
      {/* Collar detail */}
      <rect x="46" y="44" width="28" height="4" rx="1" fill={color} opacity="0.6" />
      {/* Body */}
      <rect x="24" y="48" width="72" height="94" rx="10" fill={`${color}18`} stroke={color} strokeWidth="0.8" strokeOpacity="0.6" />
      {/* Liquid fill */}
      <rect x="28" y="82" width="64" height="56" rx="7" fill={`${color}35`} />
      {/* Shine left */}
      <rect x="34" y="54" width="7" height="44" rx="3.5" fill="rgba(255,255,255,0.07)" />
      {/* Shine small top */}
      <ellipse cx="48" cy="58" rx="5" ry="3" fill="rgba(255,255,255,0.05)" />
      {/* Label frame */}
      <rect x="30" y="60" width="60" height="36" rx="3" fill="rgba(0,0,0,0.35)" stroke={`${color}`} strokeWidth="0.4" strokeOpacity="0.5" />
      {/* Label inner border */}
      <rect x="33" y="63" width="54" height="30" rx="2" fill="none" stroke={`${color}`} strokeWidth="0.3" strokeOpacity="0.3" />
      {/* Label lines */}
      <rect x="40" y="68" width="40" height="1" rx="0.5" fill={`${color}`} opacity="0.7" />
      <rect x="44" y="73" width="32" height="0.8" rx="0.4" fill={`${color}`} opacity="0.4" />
      <rect x="42" y="78" width="36" height="0.8" rx="0.4" fill={`${color}`} opacity="0.3" />
      {/* Bottom plate */}
      <rect x="24" y="134" width="72" height="8" rx="5" fill={`${color}55`} />
    </svg>
  );
}
