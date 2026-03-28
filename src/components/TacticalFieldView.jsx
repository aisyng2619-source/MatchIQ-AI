import React, { useState } from 'react'

export default function TacticalFieldView({ fieldSetup = [], pitchType = '', tacticalMode = '' }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="relative w-full aspect-square max-w-[420px] mx-auto select-none">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer boundary */}
        <ellipse cx="50" cy="50" rx="48" ry="48" fill="#0a1a10" stroke="#1a3a22" strokeWidth="0.5" />

        {/* Outfield ring */}
        <ellipse cx="50" cy="50" rx="44" ry="44" fill="none" stroke="#1e4428" strokeWidth="0.3" strokeDasharray="2 2" />

        {/* 30-yard circle */}
        <ellipse cx="50" cy="50" rx="28" ry="28" fill="#0c1f14" stroke="#1e4428" strokeWidth="0.5" strokeDasharray="1.5 1.5" />

        {/* Inner circle */}
        <ellipse cx="50" cy="50" rx="14" ry="14" fill="#0f2818" stroke="#2a6040" strokeWidth="0.4" />

        {/* Pitch strip */}
        <rect x="47" y="34" width="6" height="32" rx="1" fill="#1a3020" stroke="#2a5038" strokeWidth="0.3" />
        {/* Crease lines */}
        <line x1="45" y1="39" x2="55" y2="39" stroke="#3a7050" strokeWidth="0.4" />
        <line x1="45" y1="61" x2="55" y2="61" stroke="#3a7050" strokeWidth="0.4" />
        {/* Stumps top */}
        <rect x="48.5" y="37" width="3" height="0.8" rx="0.2" fill="#00e5a0" opacity="0.8" />
        {/* Stumps bottom */}
        <rect x="48.5" y="62.2" width="3" height="0.8" rx="0.2" fill="#00e5a0" opacity="0.5" />

        {/* Field players */}
        {fieldSetup.map((p, i) => {
          const isHovered = hovered === i
          const cx = p.x
          const cy = p.y
          const col = p.color || '#38bdf8'

          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Glow ring when hovered */}
              {isHovered && (
                <circle cx={cx} cy={cy} r="4" fill="none" stroke={col} strokeWidth="0.6" opacity="0.5" />
              )}
              {/* Dot */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 2.4 : 1.8}
                fill={col}
                opacity={isHovered ? 1 : 0.85}
                style={{ transition: 'r 0.15s ease' }}
              />
              {/* Tooltip background */}
              {isHovered && (
                <g>
                  <rect
                    x={Math.min(cx - 12, 76)}
                    y={cy - 7}
                    width="24"
                    height="6"
                    rx="1.5"
                    fill="#0d1117"
                    stroke={col}
                    strokeWidth="0.3"
                    opacity="0.95"
                  />
                  <text
                    x={Math.min(cx, 88)}
                    y={cy - 3.2}
                    textAnchor="middle"
                    fontSize="2.4"
                    fill={col}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {p.role}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* Batter marker */}
        <circle cx="50" cy="50" r="1.4" fill="#fbbf24" opacity="0.9" />
        <circle cx="50" cy="50" r="2.2" fill="none" stroke="#fbbf24" strokeWidth="0.3" opacity="0.5" />

        {/* Bowler approach */}
        <line x1="50" y1="29" x2="50" y2="37" stroke="#00e5a0" strokeWidth="0.4" strokeDasharray="1 0.8" opacity="0.6" />
        <polygon points="50,27 48.5,30.5 51.5,30.5" fill="#00e5a0" opacity="0.7" />

        {/* Tactical mode label */}
        {tacticalMode && (
          <text
            x="50"
            y="97"
            textAnchor="middle"
            fontSize="2.6"
            fill="#00e5a0"
            fontFamily="Barlow Condensed, sans-serif"
            fontWeight="600"
            opacity="0.8"
          >
            {tacticalMode.toUpperCase()}
          </text>
        )}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 pb-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] opacity-90" />
          <span className="text-[10px] text-slate-500 font-mono">Batter</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00e5a0]" />
          <span className="text-[10px] text-slate-500 font-mono">Keeper / Slip</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
          <span className="text-[10px] text-slate-500 font-mono">Fielder</span>
        </div>
      </div>
    </div>
  )
}
