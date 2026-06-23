import { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { playHoverTick, playSelect } from '@/lib/sfx';

interface InteractiveObjectProps {
  position: [number, number, number];
  geometry?: 'box' | 'sphere' | 'cylinder';
  size?: [number, number, number];
  color: string;
  glowColor?: string;
  label: string;
  collected?: boolean;
  focused?: boolean;
  onClick: () => void;
}

export function InteractiveObject({
  position,
  label,
  collected = false,
  onClick,
}: InteractiveObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const gl = useThree((s) => s.gl);

  const setCrosshairActive = (active: boolean) => {
    const area = gl.domElement.closest('.crosshair-area');
    if (area) area.classList.toggle('crosshair-active', active);
  };

  return (
    <group position={position}>
      {/* Invisible hit area covering an NPC's upper body — easy to find by
          exploring, no persistent UI marker. Prompt appears on hover only. */}
      {!collected && (
        <mesh
          ref={meshRef}
          position={[0, 0.4, 0]}
          onClick={(e) => {
            e.stopPropagation();
            if (e.delta > 5) return;
            playSelect();
            setCrosshairActive(false);
            onClick();
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
          <boxGeometry args={[0.9, 1.2, 0.6]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}

      {/* Hover prompt — fades in when cursor is over the character */}
      {hovered && !collected && (
        <Html position={[0, 1.25, 0]} center zIndexRange={[10, 0]}>
          <div className="pointer-events-none flex flex-col items-center">
            <div className="bg-background/95 border border-foreground/50 px-3 py-1.5 whitespace-nowrap shadow-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
                {label}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary mt-0.5">
                [Click] Look closer
              </p>
            </div>
            <div className="w-px h-4 bg-foreground/50" />
          </div>
        </Html>
      )}

      {/* Collected badge */}
      {collected && (
        <Html position={[0, 1.1, 0]} center zIndexRange={[5, 0]}>
          <div className="bg-background/80 border border-border px-2 py-0.5 pointer-events-none whitespace-nowrap">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Logged ✓
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}
