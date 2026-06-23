/**
 * Editorial silhouette characters — no face detail, posture does the work.
 * Style: documentary illustration. Think "This War of Mine", not Roblox.
 */

interface FigureProps {
  skinColor: string;
  clothColor: string;
  hairColor: string;
  isChild?: boolean;
}

// Slightly darken a hex for shadow areas
function shade(hex: string, amt: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) + amt);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) + amt);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) + amt);
  return `rgb(${r},${g},${b})`;
}

/* ─── Standing ───────────────────────────────────────────────────────────── */
function Standing({ skinColor, clothColor, hairColor, isChild }: FigureProps) {
  const s = isChild ? 0.82 : 1;
  const w = Math.round(64 * s), h = Math.round(150 * s);
  const cx = w / 2;
  const pant = '#232230';

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      {/* Shadow */}
      <ellipse cx={cx} cy={h - 3} rx={20 * s} ry={4 * s} fill="rgba(0,0,0,0.25)" />

      {/* Trousers */}
      <path
        d={`M${cx - 10 * s} ${h * 0.57} L${cx - 12 * s} ${h * 0.93} L${cx - 4 * s} ${h * 0.93}
           L${cx} ${h * 0.66} L${cx + 4 * s} ${h * 0.93} L${cx + 12 * s} ${h * 0.93}
           L${cx + 10 * s} ${h * 0.57} Z`}
        fill={pant}
      />
      {/* Shoe left */}
      <path d={`M${cx - 14 * s} ${h * 0.91} Q${cx - 12 * s} ${h * 0.97} ${cx - 2 * s} ${h * 0.97} L${cx - 4 * s} ${h * 0.93} L${cx - 12 * s} ${h * 0.93} Z`} fill="#111" />
      {/* Shoe right */}
      <path d={`M${cx + 14 * s} ${h * 0.91} Q${cx + 12 * s} ${h * 0.97} ${cx + 2 * s} ${h * 0.97} L${cx + 4 * s} ${h * 0.93} L${cx + 12 * s} ${h * 0.93} Z`} fill="#111" />

      {/* Torso — trapezoid, wider at shoulders */}
      <path
        d={`M${cx - 16 * s} ${h * 0.28} Q${cx - 18 * s} ${h * 0.44} ${cx - 13 * s} ${h * 0.59}
           L${cx + 13 * s} ${h * 0.59} Q${cx + 18 * s} ${h * 0.44} ${cx + 16 * s} ${h * 0.28}
           Q${cx + 10 * s} ${h * 0.24} ${cx} ${h * 0.24} Q${cx - 10 * s} ${h * 0.24} ${cx - 16 * s} ${h * 0.28} Z`}
        fill={clothColor}
      />
      {/* Subtle torso shading on sides */}
      <path
        d={`M${cx - 16 * s} ${h * 0.28} Q${cx - 18 * s} ${h * 0.44} ${cx - 13 * s} ${h * 0.59} L${cx - 9 * s} ${h * 0.59} Q${cx - 13 * s} ${h * 0.44} ${cx - 11 * s} ${h * 0.28} Z`}
        fill="rgba(0,0,0,0.12)"
      />
      <path
        d={`M${cx + 16 * s} ${h * 0.28} Q${cx + 18 * s} ${h * 0.44} ${cx + 13 * s} ${h * 0.59} L${cx + 9 * s} ${h * 0.59} Q${cx + 13 * s} ${h * 0.44} ${cx + 11 * s} ${h * 0.28} Z`}
        fill="rgba(0,0,0,0.12)"
      />

      {/* Neck */}
      <rect x={cx - 4 * s} y={h * 0.2} width={8 * s} height={h * 0.08} rx={3 * s} fill={skinColor} />

      {/* Head */}
      <ellipse cx={cx} cy={h * 0.13} rx={11 * s} ry={13 * s} fill={skinColor} />
      {/* Subtle jaw shadow */}
      <ellipse cx={cx} cy={h * 0.18} rx={8 * s} ry={5 * s} fill="rgba(0,0,0,0.07)" />

      {/* Hair — solid cap, no face features */}
      <path
        d={`M${cx - 11 * s} ${h * 0.11} Q${cx - 12 * s} ${h * 0.03} ${cx} ${h * 0.02}
           Q${cx + 12 * s} ${h * 0.03} ${cx + 11 * s} ${h * 0.11}
           Q${cx + 9 * s} ${h * 0.06} ${cx} ${h * 0.05} Q${cx - 9 * s} ${h * 0.06} ${cx - 11 * s} ${h * 0.11} Z`}
        fill={hairColor}
      />

      {/* Left arm */}
      <path d={`M${cx - 15 * s} ${h * 0.3} Q${cx - 21 * s} ${h * 0.41} ${cx - 20 * s} ${h * 0.53}`}
        stroke={clothColor} strokeWidth={8 * s} fill="none" strokeLinecap="round" />
      {/* Left hand */}
      <ellipse cx={cx - 20 * s} cy={h * 0.54} rx={4 * s} ry={4.5 * s} fill={skinColor} />

      {/* Right arm */}
      <path d={`M${cx + 15 * s} ${h * 0.3} Q${cx + 21 * s} ${h * 0.41} ${cx + 20 * s} ${h * 0.53}`}
        stroke={clothColor} strokeWidth={8 * s} fill="none" strokeLinecap="round" />
      {/* Right hand */}
      <ellipse cx={cx + 20 * s} cy={h * 0.54} rx={4 * s} ry={4.5 * s} fill={skinColor} />
    </svg>
  );
}

/* ─── Sitting ────────────────────────────────────────────────────────────── */
function Sitting({ skinColor, clothColor, hairColor, isChild }: FigureProps) {
  const s = isChild ? 0.88 : 1;
  const pant = '#232230';
  const cx = 46;

  return (
    <svg viewBox="0 0 92 115" width={Math.round(92 * s)} height={Math.round(115 * s)} style={{ display: 'block', overflow: 'visible' }}>
      {/* Lower legs */}
      <rect x={cx - 13} y={72} width={10} height={38} rx={4} fill={pant} />
      <rect x={cx + 3} y={72} width={10} height={38} rx={4} fill={pant} />
      {/* Shoes */}
      <path d={`M${cx - 15} 108 Q${cx - 11} 114 ${cx - 2} 114 L${cx - 3} 110 L${cx - 13} 110 Z`} fill="#111" />
      <path d={`M${cx + 15} 108 Q${cx + 11} 114 ${cx + 2} 114 L${cx + 3} 110 L${cx + 13} 110 Z`} fill="#111" />

      {/* Torso */}
      <path
        d={`M${cx - 14} 42 Q${cx - 16} 57 ${cx - 12} 74 L${cx + 12} 74 Q${cx + 16} 57 ${cx + 14} 42
           Q${cx + 9} 38 ${cx} 37 Q${cx - 9} 38 ${cx - 14} 42 Z`}
        fill={clothColor}
      />
      <path d={`M${cx - 14} 42 Q${cx - 16} 57 ${cx - 12} 74 L${cx - 8} 74 Q${cx - 11} 57 ${cx - 9} 42 Z`} fill="rgba(0,0,0,0.11)" />
      <path d={`M${cx + 14} 42 Q${cx + 16} 57 ${cx + 12} 74 L${cx + 8} 74 Q${cx + 11} 57 ${cx + 9} 42 Z`} fill="rgba(0,0,0,0.11)" />

      {/* Neck */}
      <rect x={cx - 4} y={32} width={8} height={8} rx={3} fill={skinColor} />

      {/* Head */}
      <ellipse cx={cx} cy={22} rx={isChild ? 13 : 11} ry={isChild ? 14 : 13} fill={skinColor} />
      <ellipse cx={cx} cy={28} rx={8} ry={4} fill="rgba(0,0,0,0.06)" />

      {/* Hair */}
      <path
        d={`M${cx - 11} 18 Q${cx - 12} 8 ${cx} 7 Q${cx + 12} 8 ${cx + 11} 18
           Q${cx + 9} 11 ${cx} 10 Q${cx - 9} 11 ${cx - 11} 18 Z`}
        fill={hairColor}
      />

      {/* Arms */}
      <path d={`M${cx - 13} 46 Q${cx - 20} 56 ${cx - 18} 67`} stroke={clothColor} strokeWidth="8" fill="none" strokeLinecap="round" />
      <ellipse cx={cx - 18} cy={68} rx={4} ry={4.5} fill={skinColor} />
      <path d={`M${cx + 13} 46 Q${cx + 20} 56 ${cx + 18} 67`} stroke={clothColor} strokeWidth="8" fill="none" strokeLinecap="round" />
      <ellipse cx={cx + 18} cy={68} rx={4} ry={4.5} fill={skinColor} />
    </svg>
  );
}

/* ─── Withdrawn — head bowed, one arm crosses to hold opposite sleeve ─────── */
function Withdrawn({ skinColor, clothColor, hairColor, isChild }: FigureProps) {
  const s = isChild ? 0.88 : 1;
  const pant = '#232230';
  const cx = 46;

  return (
    <svg viewBox="0 0 96 120" width={Math.round(96 * s)} height={Math.round(120 * s)} style={{ display: 'block', overflow: 'visible' }}>
      {/* Lower legs */}
      <rect x={cx - 13} y={76} width={10} height={38} rx={4} fill={pant} />
      <rect x={cx + 3} y={76} width={10} height={38} rx={4} fill={pant} />
      <path d={`M${cx - 15} 111 Q${cx - 11} 117 ${cx - 2} 117 L${cx - 3} 113 L${cx - 13} 113 Z`} fill="#111" />
      <path d={`M${cx + 15} 111 Q${cx + 11} 117 ${cx + 2} 117 L${cx + 3} 113 L${cx + 13} 113 Z`} fill="#111" />

      {/* Torso — slightly forward lean */}
      <path
        d={`M${cx - 13} 46 Q${cx - 16} 61 ${cx - 12} 77 L${cx + 12} 77 Q${cx + 16} 61 ${cx + 13} 46
           Q${cx + 8} 42 ${cx} 41 Q${cx - 8} 42 ${cx - 13} 46 Z`}
        fill={clothColor}
      />
      <path d={`M${cx - 13} 46 Q${cx - 16} 61 ${cx - 12} 77 L${cx - 8} 77 Q${cx - 11} 61 ${cx - 9} 46 Z`} fill="rgba(0,0,0,0.13)" />
      <path d={`M${cx + 13} 46 Q${cx + 16} 61 ${cx + 12} 77 L${cx + 8} 77 Q${cx + 11} 61 ${cx + 9} 46 Z`} fill="rgba(0,0,0,0.13)" />

      {/* Neck */}
      <rect x={cx - 4} y={36} width={8} height={8} rx={3} fill={skinColor} />

      {/* Head bowed forward ~25° */}
      <g transform={`translate(${cx},24) rotate(20) translate(-${cx},-24)`}>
        <ellipse cx={cx} cy={24} rx={isChild ? 13 : 11} ry={isChild ? 14 : 13} fill={skinColor} />
        <ellipse cx={cx} cy={30} rx={9} ry={4} fill="rgba(0,0,0,0.07)" />
        {/* Hair — top of head visible when bowing */}
        <path
          d={`M${cx - 11} 20 Q${cx - 12} 9 ${cx} 8 Q${cx + 12} 9 ${cx + 11} 20
             Q${cx + 9} 13 ${cx} 12 Q${cx - 9} 13 ${cx - 11} 20 Z`}
          fill={hairColor}
        />
        {/* Side hair falls forward when head bows */}
        <path d={`M${cx - 11} 20 Q${cx - 15} 28 ${cx - 12} 34`} stroke={hairColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </g>

      {/* Right arm crossing body toward left sleeve */}
      <path
        d={`M${cx + 12} 50 Q${cx + 17} 59 ${cx + 10} 66 Q${cx + 2} 72 ${cx - 10} 70`}
        stroke={clothColor} strokeWidth="8" fill="none" strokeLinecap="round"
      />
      {/* Right hand gripping left sleeve */}
      <ellipse cx={cx - 11} cy={70} rx={4.5} ry={4} fill={skinColor} />

      {/* Left arm — pulled in, sleeve held */}
      <path d={`M${cx - 12} 50 Q${cx - 19} 59 ${cx - 17} 68`} stroke={clothColor} strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* Left wrist/hand below the grip */}
      <path d={`M${cx - 17} 68 Q${cx - 16} 74 ${cx - 14} 76`} stroke={skinColor} strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Hunched — arms wrapped, deep bow ───────────────────────────────────── */
function Hunched({ skinColor, clothColor, hairColor, isChild }: FigureProps) {
  const s = isChild ? 0.88 : 1;
  const pant = '#232230';
  const cx = 46;

  return (
    <svg viewBox="0 0 96 116" width={Math.round(96 * s)} height={Math.round(116 * s)} style={{ display: 'block', overflow: 'visible' }}>
      {/* Lower legs */}
      <rect x={cx - 13} y={76} width={10} height={34} rx={4} fill={pant} />
      <rect x={cx + 3} y={76} width={10} height={34} rx={4} fill={pant} />
      <path d={`M${cx - 15} 107 Q${cx - 11} 114 ${cx - 2} 114 L${cx - 3} 110 L${cx - 13} 110 Z`} fill="#111" />
      <path d={`M${cx + 15} 107 Q${cx + 11} 114 ${cx + 2} 114 L${cx + 3} 110 L${cx + 13} 110 Z`} fill="#111" />

      {/* Torso — pronounced forward curve */}
      <path
        d={`M${cx - 12} 50 Q${cx - 16} 64 ${cx - 12} 77 L${cx + 12} 77 Q${cx + 16} 64 ${cx + 12} 50
           Q${cx + 8} 46 ${cx} 45 Q${cx - 8} 46 ${cx - 12} 50 Z`}
        fill={clothColor}
      />
      <path d={`M${cx - 12} 50 Q${cx - 16} 64 ${cx - 12} 77 L${cx - 8} 77 Q${cx - 11} 64 ${cx - 8} 50 Z`} fill="rgba(0,0,0,0.15)" />
      <path d={`M${cx + 12} 50 Q${cx + 16} 64 ${cx + 12} 77 L${cx + 8} 77 Q${cx + 11} 64 ${cx + 8} 50 Z`} fill="rgba(0,0,0,0.15)" />
      {/* Spine curve */}
      <path d={`M${cx + 2} 46 Q${cx + 5} 61 ${cx + 2} 77`} stroke="rgba(0,0,0,0.07)" strokeWidth="1.5" fill="none" />

      {/* Neck very short — head sunk */}
      <rect x={cx - 3} y={41} width={7} height={7} rx={3} fill={skinColor} />

      {/* Head — severely bowed ~38° */}
      <g transform={`translate(${cx},28) rotate(35) translate(-${cx},-28)`}>
        <ellipse cx={cx} cy={28} rx={isChild ? 12 : 10} ry={isChild ? 14 : 12} fill={skinColor} />
        <ellipse cx={cx} cy={34} rx={8} ry={4} fill="rgba(0,0,0,0.07)" />
        <path
          d={`M${cx - 10} 24 Q${cx - 11} 13 ${cx} 12 Q${cx + 11} 13 ${cx + 10} 24
             Q${cx + 8} 16 ${cx} 15 Q${cx - 8} 16 ${cx - 10} 24 Z`}
          fill={hairColor}
        />
        <path d={`M${cx - 10} 24 Q${cx - 14} 32 ${cx - 11} 38`} stroke={hairColor} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </g>

      {/* Both arms wrapped around front */}
      <path d={`M${cx + 11} 54 Q${cx + 16} 62 ${cx + 8} 69 Q${cx} 73 ${cx - 10} 72`} stroke={clothColor} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d={`M${cx - 11} 54 Q${cx - 17} 62 ${cx - 15} 70`} stroke={clothColor} strokeWidth="8" fill="none" strokeLinecap="round" />
      <ellipse cx={cx - 10.5} cy={72} rx={4.5} ry={4} fill={skinColor} />
      <ellipse cx={cx - 15.5} cy={70} rx={4} ry={4} fill={skinColor} />
    </svg>
  );
}

/* ─── Public ──────────────────────────────────────────────────────────────── */
export interface CharacterIllustrationProps {
  pose: 'idle' | 'sitting' | 'withdrawn' | 'hunched';
  skinColor: string;
  bodyColor: string;
  hairColor?: string;
  isChild?: boolean;
}

// Desaturate a hex color toward gray
function desaturate(hex: string, amount = 0.6): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const gray = 0.299 * r + 0.587 * g + 0.114 * b;
  return `rgb(${Math.round(r + (gray - r) * amount)},${Math.round(g + (gray - g) * amount)},${Math.round(b + (gray - b) * amount)})`;
}

export function CharacterIllustration({
  pose,
  skinColor,
  bodyColor,
  hairColor = '#2a1a0a',
  isChild = false,
}: CharacterIllustrationProps) {
  // Desaturate the clothing color — no more bright cartoon primaries
  const clothColor = desaturate(bodyColor, 0.5);
  const props = { skinColor, clothColor, hairColor, isChild };

  if (pose === 'idle') return <Standing {...props} />;
  if (pose === 'withdrawn') return <Withdrawn {...props} />;
  if (pose === 'hunched') return <Hunched {...props} />;
  return <Sitting {...props} />;
}
