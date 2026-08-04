
// ─────────────────────────────────────────────────────────────────────────────
//  Inline SVG Illustration — 2D flat scene
//  Shows: modern building, syndic manager, keys, documents, green accents
// ─────────────────────────────────────────────────────────────────────────────
export  function SyndicIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-xs"
      aria-label="Syndic manager with modern building illustration"
    >
      {/* ── Ground shadow ── */}
      <ellipse cx="160" cy="265" rx="130" ry="10" fill="#0F172A" opacity="0.4" />

      {/* ── Background buildings ── */}
      <rect x="230" y="100" width="50" height="150" rx="4" fill="#1E293B" />
      <rect x="235" y="110" width="8" height="8" rx="1" fill="#334155" />
      <rect x="248" y="110" width="8" height="8" rx="1" fill="#F97316" opacity="0.6" />
      <rect x="261" y="110" width="8" height="8" rx="1" fill="#334155" />
      <rect x="235" y="125" width="8" height="8" rx="1" fill="#F97316" opacity="0.6" />
      <rect x="248" y="125" width="8" height="8" rx="1" fill="#334155" />
      <rect x="261" y="125" width="8" height="8" rx="1" fill="#334155" />
      <rect x="235" y="140" width="8" height="8" rx="1" fill="#334155" />
      <rect x="248" y="140" width="8" height="8" rx="1" fill="#F97316" opacity="0.6" />
      <rect x="261" y="140" width="8" height="8" rx="1" fill="#334155" />
      <rect x="248" y="195" width="24" height="55" rx="2" fill="#0F172A" />

      <rect x="40" y="130" width="40" height="120" rx="4" fill="#1E293B" />
      <rect x="45" y="140" width="7" height="7" rx="1" fill="#334155" />
      <rect x="56" y="140" width="7" height="7" rx="1" fill="#F97316" opacity="0.5" />
      <rect x="67" y="140" width="7" height="7" rx="1" fill="#334155" />
      <rect x="45" y="153" width="7" height="7" rx="1" fill="#F97316" opacity="0.5" />
      <rect x="56" y="153" width="7" height="7" rx="1" fill="#334155" />
      <rect x="67" y="153" width="7" height="7" rx="1" fill="#334155" />
      <rect x="53" y="210" width="14" height="40" rx="2" fill="#0F172A" />

      {/* ── Main building (center) ── */}
      <rect x="100" y="60" width="120" height="195" rx="6" fill="#1E3A5F" />
      {/* Building top accent */}
      <rect x="100" y="60" width="120" height="12" rx="6" fill="#1E4D8C" />
      <rect x="112" y="60" width="96" height="6" rx="0" fill="#1E4D8C" />

      {/* Windows — row 1 */}
      <rect x="116" y="82" width="14" height="14" rx="2" fill="#60A5FA" opacity="0.7" />
      <rect x="136" y="82" width="14" height="14" rx="2" fill="#F97316" opacity="0.8" />
      <rect x="156" y="82" width="14" height="14" rx="2" fill="#60A5FA" opacity="0.7" />
      <rect x="176" y="82" width="14" height="14" rx="2" fill="#60A5FA" opacity="0.5" />
      <rect x="196" y="82" width="14" height="14" rx="2" fill="#F97316" opacity="0.6" />

      {/* Windows — row 2 */}
      <rect x="116" y="106" width="14" height="14" rx="2" fill="#60A5FA" opacity="0.5" />
      <rect x="136" y="106" width="14" height="14" rx="2" fill="#60A5FA" opacity="0.7" />
      <rect x="156" y="106" width="14" height="14" rx="2" fill="#F97316" opacity="0.8" />
      <rect x="176" y="106" width="14" height="14" rx="2" fill="#60A5FA" opacity="0.5" />
      <rect x="196" y="106" width="14" height="14" rx="2" fill="#60A5FA" opacity="0.7" />

      {/* Windows — row 3 */}
      <rect x="116" y="130" width="14" height="14" rx="2" fill="#F97316" opacity="0.6" />
      <rect x="136" y="130" width="14" height="14" rx="2" fill="#60A5FA" opacity="0.5" />
      <rect x="156" y="130" width="14" height="14" rx="2" fill="#60A5FA" opacity="0.7" />
      <rect x="176" y="130" width="14" height="14" rx="2" fill="#F97316" opacity="0.8" />
      <rect x="196" y="130" width="14" height="14" rx="2" fill="#60A5FA" opacity="0.5" />

      {/* Windows — row 4 */}
      <rect x="116" y="154" width="14" height="14" rx="2" fill="#60A5FA" opacity="0.7" />
      <rect x="136" y="154" width="14" height="14" rx="2" fill="#F97316" opacity="0.5" />
      <rect x="156" y="154" width="14" height="14" rx="2" fill="#60A5FA" opacity="0.5" />
      <rect x="176" y="154" width="14" height="14" rx="2" fill="#60A5FA" opacity="0.7" />
      <rect x="196" y="154" width="14" height="14" rx="2" fill="#F97316" opacity="0.8" />

      {/* Main door */}
      <rect x="145" y="210" width="30" height="45" rx="3" fill="#0F172A" />
      <circle cx="171" cy="235" r="2" fill="#F97316" />

      {/* ── Syndic manager character ── */}
      {/* Body */}
      <rect x="62" y="165" width="28" height="40" rx="4" fill="#F97316" />
      {/* Suit collar */}
      <path d="M62 168 L76 180 L90 168" stroke="#EA6C0A" strokeWidth="1.5" fill="none" />
      {/* Neck */}
      <rect x="71" y="155" width="10" height="12" rx="2" fill="#FBBF8A" />
      {/* Head */}
      <circle cx="76" cy="148" r="14" fill="#FBBF8A" />
      {/* Hair */}
      <path d="M62 143 Q76 130 90 143 Q88 138 76 136 Q64 138 62 143Z" fill="#1E293B" />
      {/* Face features */}
      <circle cx="71" cy="146" r="1.5" fill="#0F172A" />
      <circle cx="81" cy="146" r="1.5" fill="#0F172A" />
      <path d="M71 153 Q76 157 81 153" stroke="#D97706" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Legs */}
      <rect x="64" y="202" width="11" height="25" rx="3" fill="#1E3A5F" />
      <rect x="78" y="202" width="11" height="25" rx="3" fill="#1E3A5F" />
      {/* Shoes */}
      <rect x="62" y="224" width="14" height="6" rx="3" fill="#0F172A" />
      <rect x="76" y="224" width="14" height="6" rx="3" fill="#0F172A" />

      {/* ── Tablet in manager's right hand ── */}
      <rect x="88" y="175" width="26" height="36" rx="4" fill="#334155" />
      <rect x="90" y="178" width="22" height="27" rx="2" fill="#60A5FA" opacity="0.3" />
      {/* Tablet screen content */}
      <rect x="92" y="180" width="14" height="3" rx="1" fill="#60A5FA" opacity="0.7" />
      <rect x="92" y="185" width="10" height="2" rx="1" fill="#F97316" opacity="0.8" />
      <rect x="92" y="189" width="12" height="2" rx="1" fill="#60A5FA" opacity="0.5" />
      <rect x="92" y="193" width="8"  height="2" rx="1" fill="#60A5FA" opacity="0.5" />
       
      {/* Arm holding tablet */}
      <rect x="86" y="175" width="6" height="22" rx="3" fill="#F97316" />

      {/* Left arm */}
      <rect x="56" y="168" width="8" height="24" rx="3" fill="#F97316" />
      {/* Left hand holding clipboard */}
      <rect x="42" y="185" width="20" height="26" rx="3" fill="#E2E8F0" />
      <rect x="44" y="189" width="14" height="2" rx="1" fill="#94A3B8" />
      <rect x="44" y="193" width="10" height="2" rx="1" fill="#94A3B8" />
      <rect x="44" y="197" width="12" height="2" rx="1" fill="#F97316" opacity="0.7" />
      <rect x="44" y="201" width="8"  height="2" rx="1" fill="#94A3B8" />
      {/* Clipboard clip */}
      <rect x="49" y="183" width="8" height="5" rx="2" fill="#94A3B8" />

      {/* ── Floating badge — notification ── */}
      <rect x="198" y="50" width="55" height="28" rx="14" fill="#22C55E" />
      <text x="213" y="68" fontSize="10" fill="white" fontFamily="sans-serif" fontWeight="600">✓ Paid</text>
      <line x1="220" y1="77" x2="210" y2="90" stroke="#22C55E" strokeWidth="1.5" />

      {/* ── Floating badge — residents ── */}
      <rect x="60" y="48" width="65" height="28" rx="14" fill="#F97316" />
      <text x="70" y="66" fontSize="9" fill="white" fontFamily="sans-serif" fontWeight="600">Apartment</text>
      <line x1="90" y1="75" x2="100" y2="88" stroke="#F97316" strokeWidth="1.5" />


      {/* ── Key floating ── */}
      <g transform="translate(192, 155) rotate(-30)">
        <circle cx="0" cy="0" r="7" stroke="#EAB308" strokeWidth="2" fill="none" />
        <rect x="6" y="-1.5" width="16" height="3" rx="1.5" fill="#EAB308" />
        <rect x="18" y="1" width="4" height="3" rx="1" fill="#EAB308" />
        <rect x="14" y="1" width="4" height="3" rx="1" fill="#EAB308" />
      </g>

      {/* ── Plants ── */}
      <rect x="92" y="245" width="8" height="12" rx="2" fill="#854D0E" />
      <ellipse cx="96" cy="240" rx="10" ry="12" fill="#16A34A" />
      <ellipse cx="90" cy="244" rx="7" ry="9" fill="#22C55E" />
      <ellipse cx="102" cy="244" rx="7" ry="9" fill="#15803D" />

      <rect x="210" y="248" width="7" height="10" rx="2" fill="#854D0E" />
      <ellipse cx="213" cy="243" rx="8" ry="10" fill="#16A34A" />
      <ellipse cx="208" cy="247" rx="6" ry="7" fill="#22C55E" />

      {/* ── Stars decoration ── */}
      <circle cx="30" cy="80"  r="2" fill="#F97316" opacity="0.6" />
      <circle cx="285" cy="95" r="1.5" fill="#60A5FA" opacity="0.7" />
      <circle cx="310" cy="60" r="2.5" fill="#EAB308" opacity="0.5" />
      <circle cx="18"  cy="150" r="1.5" fill="#22C55E" opacity="0.6" />
    </svg>
  );
}