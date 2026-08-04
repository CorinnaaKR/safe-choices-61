import { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
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

function PulsRing() {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  const { camera } = useThree();
  useFrame((_, delta) => {
    t.current += delta;
    if (!ref.current) return;
    const s = 1 + Math.sin(t.current * 2.2) * 0.18;
    ref.current.scale.set(s, s, s);
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.28 + Math.sin(t.current * 2.2) * 0.18;
    ref.current.quaternion.copy(camera.quaternion);
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <ringGeometry args={[0.28, 0.38, 32]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.3} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
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
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  const setCrosshairActive = (active: boolean) => {
    const area = gl.domElement.closest('.crosshair-area');
    if (area) area.classList.toggle('crosshair-active', active);
  };

  return (
    <group position={position}>
      {/* Pulsing floor ring on touch devices — signals "tap me" without hover */}
      {isTouchDevice && !collected && <PulsRing />}

      {/* Invisible hit area covering an NPC's upper body — easy to find by
          exploring, no persistent UI marker. Prompt appears on hover only. */}
      {!collected && (
        <mesh
          ref={meshRef}
          position={[0, 0.4, 0]}
          onClick={(e) => {
            e.stopPropagation();
            // Touch taps can register a small delta — use a looser threshold
            if (e.delta > (isTouchDevice ? 20 : 5)) return;
            playSelect();
            setCrosshairActive(false);
            setHovered(false);
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
          // Show tooltip on touch tap-hold (pointerdown) so mobile users get the affordance
          onPointerDown={(e) => {
            if (e.pointerType === 'touch') setHovered(true);
          }}
        >
          <boxGeometry args={[0.9, 1.2, 0.6]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
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
                {isTouchDevice ? '[Tap] Look closer' : '[Click] Look closer'}
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
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
              Logged ✓
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}
