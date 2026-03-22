import { InteractiveObject } from './InteractiveObject';
import { NPCCharacter } from './NPCCharacter';
import { Evidence } from '@/types/simulation';
import { useWoodTexture, useWallTexture, useTileTexture } from './TexturedMaterials';

interface OfficeSceneProps {
  evidence: Evidence[];
  collectedIds: string[];
  focusedEvidenceId: string | null;
  onCollectEvidence: (evidence: Evidence) => void;
  onFocusEvidence: (evidence: Evidence) => void;
}

export const OFFICE_EVIDENCE_POSITIONS: [number, number, number][] = [
  [-1.5, 1, -1],
  [1.5, 1, 0],
  [0, 1, 1.5],
  [-1, 1, 2],
];

export function OfficeScene({ evidence, collectedIds, focusedEvidenceId, onCollectEvidence, onFocusEvidence }: OfficeSceneProps) {
  const floorTex = useTileTexture('#7A6652', '#6B5B45', 32, [2, 2]);
  const wallTex = useWallTexture('#E8E0D4');
  const sideWallTex = useWallTexture('#DDD5C8');
  const deskTex = useWoodTexture('#3D2B1F');
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial map={floorTex} roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2, -3]} receiveShadow>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial map={wallTex} roughness={0.92} />
      </mesh>
      <mesh position={[-4, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial map={sideWallTex} roughness={0.92} />
      </mesh>
      <mesh position={[4, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial map={sideWallTex} roughness={0.92} />
      </mesh>

      {/* Desk */}
      <mesh position={[0, 0.75, -1.5]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.06, 1]} />
        <meshStandardMaterial map={deskTex} roughness={0.55} metalness={0.08} />
      </mesh>
      {[[-0.9, 0.37, -1.9], [0.9, 0.37, -1.9], [-0.9, 0.37, -1.1], [0.9, 0.37, -1.1]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.75, 8]} />
          <meshStandardMaterial color="#2D1F14" roughness={0.5} metalness={0.3} />
        </mesh>
      ))}

      {/* Monitor */}
      <mesh position={[-0.4, 1.15, -1.8]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.03]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[-0.4, 1.15, -1.78]}>
        <boxGeometry args={[0.55, 0.35, 0.01]} />
        <meshStandardMaterial color="#3A7AA8" emissive="#3A7AA8" emissiveIntensity={0.4} roughness={0.1} />
      </mesh>
      {/* Monitor stand */}
      <mesh position={[-0.4, 0.95, -1.8]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.35, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Office chair — more realistic */}
      <mesh position={[0, 0.5, -0.5]} castShadow>
        <boxGeometry args={[0.48, 0.05, 0.48]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.85, -0.75]} castShadow>
        <boxGeometry args={[0.48, 0.55, 0.05]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Chair base */}
      <mesh position={[0, 0.25, -0.5]}>
        <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
        <meshStandardMaterial color="#444" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Chair wheels */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(angle) * 0.2, 0.05, -0.5 + Math.cos(angle) * 0.2]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#333" roughness={0.3} metalness={0.7} />
          </mesh>
        );
      })}

      {/* Bookshelf */}
      <mesh position={[-3.8, 1.5, 0]} castShadow>
        <boxGeometry args={[0.3, 3, 1.2]} />
        <meshStandardMaterial color="#5C4033" roughness={0.7} metalness={0.05} />
      </mesh>
      {[0.5, 1.2, 1.9].map((y, i) => (
        <group key={i}>
          {[-0.3, 0, 0.3].map((z, j) => (
            <mesh key={j} position={[-3.6, y, z]} castShadow>
              <boxGeometry args={[0.12, 0.28, 0.16]} />
              <meshStandardMaterial
                color={['#7A3D10', '#263848', '#5A2525'][j]}
                roughness={0.75}
                metalness={0.02}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Visitor chairs — more detailed */}
      {[-0.8, 0.8].map((x, i) => (
        <group key={i} position={[x, 0, 1]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.4, 0.035, 0.4]} />
            <meshStandardMaterial color="#6B4226" roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.65, 0.18]} castShadow>
            <boxGeometry args={[0.4, 0.42, 0.035]} />
            <meshStandardMaterial color="#6B4226" roughness={0.65} />
          </mesh>
          {[[-0.17, 0.2, -0.17], [0.17, 0.2, -0.17], [-0.17, 0.2, 0.17], [0.17, 0.2, 0.17]].map((pos, j) => (
            <mesh key={j} position={pos as [number, number, number]}>
              <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
              <meshStandardMaterial color="#4A4A4A" roughness={0.3} metalness={0.6} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Window — frosted glass */}
      <mesh position={[3.95, 2.2, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.5, 1.8]} />
        <meshPhysicalMaterial
          color="#D4E8F5"
          transmission={0.5}
          roughness={0.2}
          transparent
          opacity={0.65}
        />
      </mesh>
      {/* Window frame */}
      <mesh position={[3.97, 2.2, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[1.6, 1.9, 0.03]} />
        <meshStandardMaterial color="#D8D0C4" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Door — wood grain */}
      <mesh position={[0, 1.1, 3]} castShadow>
        <boxGeometry args={[0.9, 2.2, 0.06]} />
        <meshStandardMaterial color="#5C4033" roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Door handle */}
      <mesh position={[0.3, 1.1, 2.95]}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[0.3, 1.1, 2.92]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* ===== NPC: Ms. Patterson (DSL) sitting behind desk ===== */}
      <NPCCharacter
        position={[0, 0.5, -1]}
        rotation={Math.PI}
        bodyColor="#4a4a6a"
        skinColor="#d4a574"
        pose="sitting"
        name="Ms. Patterson"
        behaviorHint="DSL — listening carefully, taking notes"
        fidget={0.2}
      />

      {/* Evidence items */}
      {evidence.map((ev, i) => {
        const pos = OFFICE_EVIDENCE_POSITIONS[i] || [i * 1.2, 1, 0];
        return (
          <InteractiveObject
            key={ev.id}
            position={pos}
            geometry={ev.type === 'message' ? 'box' : ev.type === 'visual' ? 'cylinder' : 'sphere'}
            color={ev.type === 'observation' ? '#3B82F6' : ev.type === 'visual' ? '#EF4444' : '#10B981'}
            glowColor="#f59e0b"
            label={ev.title}
            collected={collectedIds.includes(ev.id)}
            focused={focusedEvidenceId === ev.id}
            onClick={() => onFocusEvidence(ev)}
            size={[0.2, 0.2, 0.2]}
          />
        );
      })}

      {/* Realistic office lighting */}
      <ambientLight intensity={0.2} color="#E0D8D0" />
      <directionalLight
        position={[4, 5, 2]}
        intensity={0.6}
        color="#FFF5E0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={15}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.001}
      />
      {/* Desk lamp feel */}
      <pointLight position={[-0.4, 1.5, -1.5]} intensity={0.4} color="#FFFAF0" distance={4} decay={2} />
      {/* Window light */}
      <pointLight position={[3.5, 2.5, -0.5]} intensity={0.4} color="#D4E8F5" distance={6} decay={2} />
      {/* Overhead */}
      <rectAreaLight position={[0, 3.5, 0]} width={4} height={3} intensity={0.5} color="#F5F0E8" rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  );
}
