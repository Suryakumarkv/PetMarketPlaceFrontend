import React from "react";

/**
 * PawsLogo — inline SVG recreation of the "Paws Next Door" brand image.
 * Yellow rounded-rectangle background, hand-drawn cat + dog, heart, cursive text.
 * Pass `height` to scale; width is calculated from the natural 3:2 aspect ratio.
 */
export default function PawsLogo({ height = 44 }) {
  const w = Math.round(height * 1.62);
  const h = height;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 162 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Paws Next Door"
      role="img"
    >
      {/* Background card */}
      <rect x="1" y="1" width="160" height="98" rx="14" ry="14"
        fill="#F2D86B" stroke="#C8A830" strokeWidth="2" />

      {/* ── CAT (left) ── */}
      {/* head */}
      <ellipse cx="42" cy="42" rx="18" ry="16" fill="#F2D86B" stroke="#5A3E1B" strokeWidth="2" />
      {/* left ear */}
      <polygon points="26,30 22,14 36,26" fill="#F2D86B" stroke="#5A3E1B" strokeWidth="1.8" strokeLinejoin="round" />
      {/* right ear */}
      <polygon points="52,28 58,13 48,26" fill="#F2D86B" stroke="#5A3E1B" strokeWidth="1.8" strokeLinejoin="round" />
      {/* inner left ear */}
      <polygon points="27,28 24,17 34,25" fill="#E8B4B8" />
      {/* inner right ear */}
      <polygon points="51,26 56,16 49,25" fill="#E8B4B8" />
      {/* eyes */}
      <ellipse cx="36" cy="40" rx="3" ry="3.5" fill="#5A3E1B" />
      <ellipse cx="48" cy="40" rx="3" ry="3.5" fill="#5A3E1B" />
      <circle cx="37" cy="39" r="1" fill="#fff" />
      <circle cx="49" cy="39" r="1" fill="#fff" />
      {/* nose */}
      <polygon points="42,46 40,44 44,44" fill="#E8607A" />
      {/* mouth */}
      <path d="M40,46 Q42,49 44,46" stroke="#5A3E1B" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* whiskers */}
      <line x1="24" y1="44" x2="38" y2="46" stroke="#5A3E1B" strokeWidth="1" />
      <line x1="24" y1="47" x2="38" y2="47" stroke="#5A3E1B" strokeWidth="1" />
      <line x1="60" y1="44" x2="46" y2="46" stroke="#5A3E1B" strokeWidth="1" />
      <line x1="60" y1="47" x2="46" y2="47" stroke="#5A3E1B" strokeWidth="1" />
      {/* body hint */}
      <path d="M28,56 Q42,68 56,56" stroke="#5A3E1B" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* ── DOG (right) ── */}
      {/* head */}
      <ellipse cx="112" cy="40" rx="20" ry="18" fill="#F2D86B" stroke="#5A3E1B" strokeWidth="2" />
      {/* floppy left ear */}
      <ellipse cx="92" cy="46" rx="7" ry="12" fill="#E8B87A" stroke="#5A3E1B" strokeWidth="1.8" transform="rotate(-15 92 46)" />
      {/* floppy right ear */}
      <ellipse cx="132" cy="46" rx="7" ry="12" fill="#E8B87A" stroke="#5A3E1B" strokeWidth="1.8" transform="rotate(15 132 46)" />
      {/* eyes */}
      <ellipse cx="105" cy="37" rx="3.2" ry="3.5" fill="#5A3E1B" />
      <ellipse cx="119" cy="37" rx="3.2" ry="3.5" fill="#5A3E1B" />
      <circle cx="106" cy="36" r="1" fill="#fff" />
      <circle cx="120" cy="36" r="1" fill="#fff" />
      {/* snout */}
      <ellipse cx="112" cy="47" rx="9" ry="6" fill="#E8C87A" stroke="#5A3E1B" strokeWidth="1.5" />
      {/* nose */}
      <ellipse cx="112" cy="44" rx="4" ry="2.5" fill="#5A3E1B" />
      {/* mouth */}
      <path d="M108,49 Q112,53 116,49" stroke="#5A3E1B" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* body hint */}
      <path d="M94,58 Q112,72 130,58" stroke="#5A3E1B" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* ── HEART between them ── */}
      <path d="M79,22 C79,18 74,15 71,18 C68,15 63,18 63,22 C63,26 71,32 71,32 C71,32 79,26 79,22Z"
        fill="#E8607A" />

      {/* ── "Paws Next Door" text ── */}
      <text
        x="81"
        y="88"
        textAnchor="middle"
        fontFamily="'Georgia', 'Palatino', serif"
        fontStyle="italic"
        fontSize="13"
        fontWeight="600"
        fill="#5A3E1B"
        letterSpacing="0.3"
      >
        Paws Next Door
      </text>
    </svg>
  );
}
