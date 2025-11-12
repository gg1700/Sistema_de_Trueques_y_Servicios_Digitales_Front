// src/Components/Icons/PixerBolt.tsx
"use client";

type Props = {
  size?: number;       
  className?: string;   
};

export default function PixerBolt({ size = 64, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      role="img"
      aria-label="Pixer logo"
      className={className}
      style={{ display: "block" }}
    >
      <defs>

        <linearGradient id="pb-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#49E0B9" />
          <stop offset="55%" stopColor="#19C19F" />
          <stop offset="100%" stopColor="#07966F" />
        </linearGradient>

    
        <linearGradient id="pb-fold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#56E2BF" />
          <stop offset="65%" stopColor="#1DB896" />
          <stop offset="100%" stopColor="#0C9673" />
        </linearGradient>

 
        <radialGradient id="pb-gloss" cx="55%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,.55)" />
          <stop offset="55%" stopColor="rgba(255,255,255,.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        <filter id="pb-shadow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity=".20" />
        </filter>
        <filter id="pb-inner" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="b" />
          <feOffset dy="0.4" />
          <feComposite in2="b" operator="arithmetic" k2="-1" k3="1" result="inner" />
          <feColorMatrix in="inner" type="matrix"
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 .35 0" />
          <feBlend in="SourceGraphic" mode="normal" />
        </filter>
      </defs>

      <path
        d="
          M66 10
          C73 10, 77 17, 74 24
          L60 52
          H86
          C93 52, 97 60, 93 66
          L67 116
          C65 120, 59 121, 56 117
          C49 108, 42 99, 36 91
          C33 87, 33 83, 35 78
          L45 58
          H30
          C23 58, 19 50, 24 45
          L56 14
          C59 11, 62 10, 66 10Z
        "
        fill="url(#pb-top)"
        filter="url(#pb-shadow)"
        shapeRendering="geometricPrecision"
      />

      <path
        d="
          M72 63
          C84 77, 102 98, 111 108
          C114 111, 113 116, 109 118
          C96 123, 74 131, 61 136
          C56 138, 51 134, 52 129
          L55 101
          C55.5 97, 57 94, 60 90
          L72 63Z
        "
        fill="url(#pb-fold)"
        filter="url(#pb-shadow)"
        shapeRendering="geometricPrecision"
      />

      <path
        d="M71.5 63.5 C83.5 77.5, 101.5 98.5, 110.5 108.5"
        stroke="url(#pb-gloss)"
        strokeWidth="3.2"
        fill="none"
        filter="url(#pb-inner)"
      />
    </svg>
  );
}
