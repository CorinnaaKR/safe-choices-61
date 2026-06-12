import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Select } from '@react-three/postprocessing';
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

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function InteractiveObject({
  position,
  geometry = 'box',
  size = [0.3, 0.3, 0.3],
  color,
  label,
  collected = false,
  focused = false,
  onClick,
}: InteractiveObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const gl = useThree((s) => s.gl);

  // Expanded crosshair while over an interactive (class on the canvas wrapper)
  const setCrosshairActive = (active: boolean) => {
    const area = gl.domElement.closest('.crosshair-area');
    if (area) area.classList.toggle('crosshair-active', active);
  };

  useFrame((state) => {
    if (meshRef.current && !collected && !prefersReducedMotion) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.04;
    }
  });

  const GeometryComponent = () => {
    switch (geometry) {
      case 'sphere':
        return <sphereGeometry args={[size[0], 16, 16]} />;
      case 'cylinder':
        return <cylinderGeometry args={[size[0], size[0], size[1], 16]} />;
      default:
        return <boxGeometry args={size} />;
    }
  };

  return (
    <group position={position}>
      {/* Thin ground ring marks uncollected evidence (discoverability, pillar 4) */}
      {!collected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -position[1] + 0.02, 0]}>
          <ringGeometry args={[0.34, 0.36, 48]} />
          <meshBasicMaterial
            color="#e9e7e3"
            transparent
            opacity={focused ? 0.7 : hovered ? 0.6 : 0.3}
          />
        </mesh>
      )}

      {/* Main object — outlined via the postprocessing Selection on hover/focus */}
      <Select enabled={!collected && (hovered || focused)}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            if (e.delta > 5) return; // pointer travelled: this was an orbit drag, not a click
            if (!collected) {
              playSelect();
              setCrosshairActive(false);
              onClick();
            }
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            if (!collected) {
              playHoverTick();
              setCrosshairActive(true);
            }
          }}
          onPointerOut={() => {
            setHovered(false);
            setCrosshairActive(false);
          }}
        >
          <GeometryComponent />
          <meshStandardMaterial
            color={collected ? '#4a4a4a' : color}
            emissive={hovered && !collected ? '#ffffff' : '#000000'}
            emissiveIntensity={hovered && !collected ? 0.08 : 0}
            transparent={collected}
            opacity={collected ? 0.35 : 1}
          />
        </mesh>
      </Select>

      {/* Floating mono label with leader line */}
      {hovered && !collected && (
        <Html position={[0, size[1] / 2 + 0.15, 0]} center zIndexRange={[5, 0]}>
          <div className="flex flex-col items-center pointer-events-none -translate-y-full">
            <div className="bg-background/90 border border-foreground/60 px-3 py-1.5 whitespace-nowrap">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
                {label}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary mt-0.5">
                [Click] Examine
              </p>
            </div>
            {/* Leader line */}
            <div className="w-px h-6 bg-foreground/60" />
          </div>
        </Html>
      )}

      {collected && (
        <Html position={[0, 0.5, 0]} center zIndexRange={[5, 0]}>
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
