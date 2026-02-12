import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

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
        <capsuleGeometry args={[0.16, 0.3, 8, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.7} />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, headY, 0]} castShadow>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>

      {/* Eyes */}
      <group position={[0, headY, 0]} rotation={[headTilt, 0, 0]}>
        <mesh position={[0.04, 0.02, 0.12]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#333" />
        </mesh>
        <mesh position={[-0.04, 0.02, 0.12]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#333" />
        </mesh>
      </group>

      {/* Hair */}
      <mesh position={[0, headY + 0.1, -0.02]}>
        <sphereGeometry args={[0.145, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#5C3A1E" roughness={0.8} />
      </mesh>

      {/* Left arm */}
      <group ref={leftArmRef} position={[0.22, bodyY + 0.1 + shoulderDrop, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.045, 0.2, 8, 8]} />
          <meshStandardMaterial color={bodyColor} roughness={0.7} />
        </mesh>
        {/* Forearm / wrist area — visible when sleeve rides up */}
        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.04, 0.12, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={rightArmRef} position={[-0.22, bodyY + 0.1 + shoulderDrop, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.045, 0.2, 8, 8]} />
          <meshStandardMaterial color={bodyColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.04, 0.12, 8, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </mesh>
      </group>

      {/* Legs (sitting vs standing) */}
      {isSitting ? (
        <>
          <mesh position={[0.08, 0.18, 0.12]} rotation={[Math.PI / 4, 0, 0]}>
            <capsuleGeometry args={[0.055, 0.2, 8, 8]} />
            <meshStandardMaterial color="#3a3a5c" roughness={0.7} />
          </mesh>
          <mesh position={[-0.08, 0.18, 0.12]} rotation={[Math.PI / 4, 0, 0]}>
            <capsuleGeometry args={[0.055, 0.2, 8, 8]} />
            <meshStandardMaterial color="#3a3a5c" roughness={0.7} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[0.07, 0.2, 0]}>
            <capsuleGeometry args={[0.055, 0.25, 8, 8]} />
            <meshStandardMaterial color="#3a3a5c" roughness={0.7} />
          </mesh>
          <mesh position={[-0.07, 0.2, 0]}>
            <capsuleGeometry args={[0.055, 0.25, 8, 8]} />
            <meshStandardMaterial color="#3a3a5c" roughness={0.7} />
          </mesh>
        </>
      )}

      {/* Shoes */}
      <mesh position={[0.07, 0.04, isSitting ? 0.28 : 0]}>
        <boxGeometry args={[0.07, 0.04, 0.12]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <mesh position={[-0.07, 0.04, isSitting ? 0.28 : 0]}>
        <boxGeometry args={[0.07, 0.04, 0.12]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.22, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.15} />
      </mesh>

      {/* Name label on hover over body */}
      <mesh
        position={[0, bodyY, 0]}
        visible={false}
        onPointerOver={(e) => { e.stopPropagation(); setNameVisible(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setNameVisible(false); document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {nameVisible && (
        <Html position={[0, headY + 0.25, 0]} center>
          <div className="bg-black/80 backdrop-blur px-3 py-1 rounded-lg border border-white/20 whitespace-nowrap pointer-events-none">
            <p className="text-xs font-semibold text-white">{name}</p>
            {behaviorHint && (
              <p className="text-[10px] text-white/50 italic">{behaviorHint}</p>
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

  if (hotspot.collected) {
    return (
      <group position={hotspot.offset}>
        <Html center>
          <div className="bg-feedback-positive/80 px-1.5 py-0.5 rounded-full pointer-events-none">
            <p className="text-[8px] font-bold text-white">✓</p>
          </div>
        </Html>
      </group>
    );
  }

  return (
    <group position={hotspot.offset}>
      {/* Pulsing glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={isHovered ? 0.5 : 0.2}
        />
      </mesh>

      {/* Clickable area */}
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { onHover(false); document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Attention indicator - small diamond */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.04, 0.04, 0.04]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.8} />
      </mesh>

      {/* Hover tooltip */}
      {isHovered && (
        <Html center position={[0, 0.2, 0]}>
          <div className="bg-card/95 backdrop-blur border-2 border-decision-highlight px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
            <p className="text-xs font-semibold text-foreground">{hotspot.label}</p>
            <p className="text-[10px] text-decision-highlight">{hotspot.hint}</p>
          </div>
        </Html>
      )}
    </group>
  );
}
