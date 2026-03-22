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
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#7A6652" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2, -3]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#E8E0D4" />
      </mesh>
      <mesh position={[-4, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#DDD5C8" />
      </mesh>
      <mesh position={[4, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#DDD5C8" />
      </mesh>

      {/* Desk */}
      <mesh position={[0, 0.75, -1.5]}>
        <boxGeometry args={[2, 0.06, 1]} />
        <meshStandardMaterial color="#3D2B1F" />
      </mesh>
      {[[-0.9, 0.37, -1.9], [0.9, 0.37, -1.9], [-0.9, 0.37, -1.1], [0.9, 0.37, -1.1]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.06, 0.75, 0.06]} />
          <meshStandardMaterial color="#2D1F14" />
        </mesh>
      ))}

      {/* Monitor */}
      <mesh position={[-0.4, 1.15, -1.8]}>
        <boxGeometry args={[0.6, 0.4, 0.04]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-0.4, 1.15, -1.78]}>
        <boxGeometry args={[0.55, 0.35, 0.01]} />
        <meshStandardMaterial color="#4488AA" emissive="#4488AA" emissiveIntensity={0.2} />
      </mesh>

      {/* Office chair */}
      <mesh position={[0, 0.5, -0.5]}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial color="#2D2D2D" />
      </mesh>
      <mesh position={[0, 0.85, -0.75]}>
        <boxGeometry args={[0.5, 0.6, 0.06]} />
        <meshStandardMaterial color="#2D2D2D" />
      </mesh>

      {/* Bookshelf */}
      <mesh position={[-3.8, 1.5, 0]}>
        <boxGeometry args={[0.3, 3, 1.2]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>
      {[0.5, 1.2, 1.9].map((y, i) => (
        <group key={i}>
          {[-0.3, 0, 0.3].map((z, j) => (
            <mesh key={j} position={[-3.6, y, z]}>
              <boxGeometry args={[0.15, 0.3, 0.18]} />
              <meshStandardMaterial color={['#8B4513', '#2E4057', '#6B2E2E'][j]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Visitor chairs */}
      {[-0.8, 0.8].map((x, i) => (
        <group key={i} position={[x, 0, 1]}>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.4, 0.04, 0.4]} />
            <meshStandardMaterial color="#6B4226" />
          </mesh>
          <mesh position={[0, 0.65, 0.18]}>
            <boxGeometry args={[0.4, 0.45, 0.04]} />
            <meshStandardMaterial color="#6B4226" />
          </mesh>
        </group>
      ))}

      {/* Window */}
      <mesh position={[3.95, 2.2, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.5, 1.8]} />
        <meshStandardMaterial color="#B0D4F1" emissive="#B0D4F1" emissiveIntensity={0.2} transparent opacity={0.5} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 1.1, 3]}>
        <boxGeometry args={[0.9, 2.2, 0.08]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>
      <mesh position={[0.3, 1.1, 2.95]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
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

      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 4, 2]} intensity={0.5} color="#FFF8E7" />
      <pointLight position={[0, 3, -1]} intensity={0.4} color="#FFFAF0" />
      <pointLight position={[4, 2, -0.5]} intensity={0.3} color="#B0D4F1" distance={5} />
    </group>
  );
}
