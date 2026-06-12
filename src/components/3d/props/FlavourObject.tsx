import { useRef, useState, useEffect, ReactNode } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
import { playHoverTick, playUiTick } from '@/lib/sfx';

interface FlavourObjectProps {
  position: [number, number, number];
  /** Short mono label shown on hover, e.g. "Lost property box" */
  label: string;
  /** One-line observation shown on click — flavour, NOT evidence.
      Signal-vs-noise: examining things and ruling them out is good detective work. */
  note: string;
  /** Radius of the invisible click target around the prop */
  hitRadius?: number;
  /** Vertical centre of the click target */
  hitY?: number;
  children: ReactNode;
}

/**
 * An inspectable scene object that is NOT evidence. Same hover/click
 * affordance as evidence (so the player can't tell signal from noise
 * before examining), but the payoff is a one-line observation that
 * rules it out — no camera focus, no journal entry.
 */
export function FlavourObject({
  position,
  label,
  note,
  hitRadius = 0.35,
  hitY = 0.4,
  children,
}: FlavourObjectProps) {
  const [hovered, setHovered] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const gl = useThree((s) => s.gl);

  const setCrosshairActive = (active: boolean) => {
    const area = gl.domElement.closest('.crosshair-area');
    if (area) area.classList.toggle('crosshair-active', active);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <group position={position}>
      <Select enabled={hovered && !noteOpen}>{children}</Select>

      {/* Invisible click target */}
      <mesh
        visible={false}
        position={[0, hitY, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (e.delta > 5) return; // orbit drag, not a click
          playUiTick();
          setNoteOpen(true);
          clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setNoteOpen(false), 4000);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          playHoverTick();
          setCrosshairActive(true);
        }}
        onPointerOut={() => {
          setHovered(false);
          setCrosshairActive(false);
        }}
      >
        <sphereGeometry args={[hitRadius, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Hover label — same affordance as evidence */}
      {hovered && !noteOpen && (
        <Html position={[0, hitY + hitRadius + 0.1, 0]} center zIndexRange={[5, 0]}>
          <div className="flex flex-col items-center pointer-events-none -translate-y-full">
            <div className="bg-background/90 border border-foreground/60 px-3 py-1.5 whitespace-nowrap">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
                {label}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary mt-0.5">
                [Click] Examine
              </p>
            </div>
            <div className="w-px h-6 bg-foreground/60" />
          </div>
        </Html>
      )}

      {/* One-line observation — ruled out, move on */}
      {noteOpen && (
        <Html position={[0, hitY + hitRadius + 0.1, 0]} center zIndexRange={[5, 0]}>
          <div className="flex flex-col items-center pointer-events-none -translate-y-full">
            <div className="bg-background/95 border border-border px-4 py-2.5 w-56">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                Observed — not evidence
              </p>
              <p className="text-xs text-foreground/85 leading-relaxed normal-case">
                {note}
              </p>
            </div>
            <div className="w-px h-6 bg-foreground/40" />
          </div>
        </Html>
      )}
    </group>
  );
}
