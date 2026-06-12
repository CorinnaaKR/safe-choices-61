import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { playHoverTick, playSelect } from '@/lib/sfx';

/** Toggle the expanded crosshair cursor on the canvas wrapper. */
function useCrosshair() {
  const gl = useThree((s) => s.gl);
  return (active: boolean) => {
    const area = gl.domElement.closest('.crosshair-area');
    if (area) area.classList.toggle('crosshair-active', active);
  };
}

export interface NPCHotspot {
  id: string;
  label: string;
  /** Position relative to NPC group */
  offset: [number, number, number];
  /** What the user sees on hover */
  hint: string;
  collected?: boolean;
}

interface NPCCharacterProps {
  position: [number, number, number];
  rotation?: number;
  /** Shirt / body color */
  bodyColor?: string;
  skinColor?: string;
  /** idle | sitting | withdrawn */
  pose?: 'idle' | 'sitting' | 'withdrawn' | 'hunched';
  name: string;
  /** Behavior label shown briefly */
  behaviorHint?: string;
  hotspots?: NPCHotspot[];
  onHotspotClick?: (hotspotId: string) => void;
  /** Subtle idle animation intensity 0-1 */
  fidget?: number;
  /** Whether this NPC should show sleeve-pulling behavior */
  pullsSleeves?: boolean;
}

export function NPCCharacter({
  position,
  rotation = 0,
  bodyColor = '#4a90d9',
  skinColor = '#e8c4a0',
  pose = 'idle',
  name,
  behaviorHint,
  hotspots = [],
  onHotspotClick,
  fidget = 0.5,
  pullsSleeves = false,
}: NPCCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [nameVisible, setNameVisible] = useState(false);

  // Pose offsets
  const isSitting = pose === 'sitting' || pose === 'withdrawn' || pose === 'hunched';
  const bodyY = isSitting ? 0.35 : 0.55;
  const headY = isSitting ? 0.8 : 1.05;
  const headTilt = pose === 'withdrawn' || pose === 'hunched' ? -0.25 : 0;
  const shoulderDrop = pose === 'hunched' ? -0.08 : 0;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Idle head movement
    if (headRef.current) {
      headRef.current.rotation.x = headTilt + Math.sin(t * 0.8) * 0.02 * fidget;
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.05 * fidget;
      // Withdrawn NPCs look down more
      if (pose === 'withdrawn') {
        headRef.current.rotation.x = -0.3 + Math.sin(t * 1.2) * 0.02;
      }
    }

    // Sleeve-pulling / fidgeting arm animation
    if (leftArmRef.current) {
      if (pullsSleeves) {
        // Periodic sleeve-pulling motion
        const cycle = (t * 0.4) % (Math.PI * 2);
        const pullIntensity = Math.max(0, Math.sin(cycle)) * 0.4;
        leftArmRef.current.rotation.x = -0.1 - pullIntensity;
        leftArmRef.current.rotation.z = 0.15 + pullIntensity * 0.3;
      } else {
        leftArmRef.current.rotation.z = 0.15 + Math.sin(t * 0.7) * 0.03 * fidget;
      }
    }

    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -0.15 + Math.sin(t * 0.6 + 1) * 0.03 * fidget;
      if (pose === 'hunched') {
        rightArmRef.current.rotation.x = -0.3;
      }
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      {/* Body */}
      <mesh position={[0, bodyY, 0]} castShadow>
        <capsuleGeometry args={[0.16, 0.3, 10, 20]} />
        <meshStandardMaterial color={bodyColor} roughness={0.75} metalness={0.02} />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, headY, 0]} castShadow>
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} metalness={0} />
      </mesh>

      {/* Eyes */}
      <group position={[0, headY, 0]} rotation={[headTilt, 0, 0]}>
        <mesh position={[0.04, 0.02, 0.12]}>
          <sphereGeometry args={[0.02, 10, 10]} />
          <meshStandardMaterial color="#2A2A2A" roughness={0.3} />
        </mesh>
        <mesh position={[-0.04, 0.02, 0.12]}>
          <sphereGeometry args={[0.02, 10, 10]} />
          <meshStandardMaterial color="#2A2A2A" roughness={0.3} />
        </mesh>
        {/* Eye whites */}
        <mesh position={[0.04, 0.02, 0.115]}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <meshStandardMaterial color="#F0F0F0" roughness={0.2} />
        </mesh>
        <mesh position={[-0.04, 0.02, 0.115]}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <meshStandardMaterial color="#F0F0F0" roughness={0.2} />
        </mesh>
      </group>

      {/* Hair */}
      <mesh position={[0, headY + 0.1, -0.02]}>
        <sphereGeometry args={[0.145, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#4A2E14" roughness={0.9} metalness={0} />
      </mesh>

      {/* Left arm */}
      <group ref={leftArmRef} position={[0.22, bodyY + 0.1 + shoulderDrop, 0]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <capsuleGeometry args={[0.042, 0.2, 8, 10]} />
          <meshStandardMaterial color={bodyColor} roughness={0.75} metalness={0.02} />
        </mesh>
        {/* Forearm / wrist */}
        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.035, 0.12, 8, 10]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={rightArmRef} position={[-0.22, bodyY + 0.1 + shoulderDrop, 0]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <capsuleGeometry args={[0.042, 0.2, 8, 10]} />
          <meshStandardMaterial color={bodyColor} roughness={0.75} metalness={0.02} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.035, 0.12, 8, 10]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
      </group>

      {/* Legs */}
      {isSitting ? (
        <>
          <mesh position={[0.08, 0.18, 0.12]} rotation={[Math.PI / 4, 0, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.2, 8, 10]} />
            <meshStandardMaterial color="#2C2C3E" roughness={0.7} />
          </mesh>
          <mesh position={[-0.08, 0.18, 0.12]} rotation={[Math.PI / 4, 0, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.2, 8, 10]} />
            <meshStandardMaterial color="#2C2C3E" roughness={0.7} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[0.07, 0.2, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.25, 8, 10]} />
            <meshStandardMaterial color="#2C2C3E" roughness={0.7} />
          </mesh>
          <mesh position={[-0.07, 0.2, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.25, 8, 10]} />
            <meshStandardMaterial color="#2C2C3E" roughness={0.7} />
          </mesh>
        </>
      )}

      {/* Shoes */}
      <mesh position={[0.07, 0.04, isSitting ? 0.28 : 0]} castShadow>
        <boxGeometry args={[0.065, 0.035, 0.11]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[-0.07, 0.04, isSitting ? 0.28 : 0]} castShadow>
        <boxGeometry args={[0.065, 0.035, 0.11]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.2, 20]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.15} />
      </mesh>

      {/* Name label on hover over body */}
      <mesh
        position={[0, bodyY, 0]}
        visible={false}
        onPointerOver={(e) => { e.stopPropagation(); setNameVisible(true); }}
        onPointerOut={() => { setNameVisible(false); }}
      >
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {nameVisible && (
        <Html position={[0, headY + 0.25, 0]} center zIndexRange={[5, 0]}>
          <div className="bg-background/90 border border-foreground/60 px-3 py-1.5 whitespace-nowrap pointer-events-none">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">{name}</p>
            {behaviorHint && (
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground mt-0.5">{behaviorHint}</p>
            )}
          </div>
        </Html>
      )}

      {/* Hotspots — interactive evidence points on the NPC */}
      {hotspots.map((hs) => (
        <NPCHotspotMarker
          key={hs.id}
          hotspot={hs}
          isHovered={hoveredHotspot === hs.id}
          onHover={(h) => setHoveredHotspot(h ? hs.id : null)}
          onClick={() => onHotspotClick?.(hs.id)}
        />
      ))}
    </group>
  );
}

function NPCHotspotMarker({
  hotspot,
  isHovered,
  onHover,
  onClick,
}: {
  hotspot: NPCHotspot;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current && !hotspot.collected) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      glowRef.current.scale.set(s, s, s);
    }
  });

  const setCrosshairActive = useCrosshair();

  if (hotspot.collected) {
    return (
      <group position={hotspot.offset}>
        <Html center zIndexRange={[5, 0]}>
          <div className="bg-background/80 border border-border px-1.5 py-0.5 pointer-events-none">
            <p className="font-mono text-[8px] text-muted-foreground">✓</p>
          </div>
        </Html>
      </group>
    );
  }

  return (
    <group position={hotspot.offset}>
      {/* Pulsing marker */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial
          color="#e9e7e3"
          transparent
          opacity={isHovered ? 0.9 : 0.45}
        />
      </mesh>

      {/* Clickable area */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          if (e.delta > 5) return; // orbit drag, not a click
          playSelect();
          setCrosshairActive(false);
          onClick();
        }}
        onPointerOver={(e) => { e.stopPropagation(); onHover(true); playHoverTick(); setCrosshairActive(true); }}
        onPointerOut={() => { onHover(false); setCrosshairActive(false); }}
      >
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Hover label with leader line */}
      {isHovered && (
        <Html center position={[0, 0.2, 0]} zIndexRange={[5, 0]}>
          <div className="flex flex-col items-center pointer-events-none -translate-y-full">
            <div className="bg-background/90 border border-foreground/60 px-3 py-1.5 whitespace-nowrap">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">{hotspot.label}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary mt-0.5">{hotspot.hint}</p>
            </div>
            <div className="w-px h-5 bg-foreground/60" />
          </div>
        </Html>
      )}
    </group>
  );
}
