import { InteractiveObject } from './InteractiveObject';
import { Evidence } from '@/types/simulation';

interface ClassroomSceneProps {
  evidence: Evidence[];
  collectedIds: string[];
  focusedEvidenceId: string | null;
  onCollectEvidence: (evidence: Evidence) => void;
  onFocusEvidence: (evidence: Evidence) => void;
}

function Desk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.5]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      {[[-0.35, 0.35, -0.2], [0.35, 0.35, -0.2], [-0.35, 0.35, 0.2], [0.35, 0.35, 0.2]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.04, 0.7, 0.04]} />
          <meshStandardMaterial color="#6B5B45" />
        </mesh>
      ))}
    </group>
  );
}

function Chair({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.35, 0.04, 0.35]} />
        <meshStandardMaterial color="#4A90D9" />
      </mesh>
      <mesh position={[0, 0.7, -0.15]}>
        <boxGeometry args={[0.35, 0.5, 0.04]} />
        <meshStandardMaterial color="#4A90D9" />
      </mesh>
      {[[-0.15, 0.22, -0.15], [0.15, 0.22, -0.15], [-0.15, 0.22, 0.15], [0.15, 0.22, 0.15]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.03, 0.45, 0.03]} />
          <meshStandardMaterial color="#3A3A3A" />
        </mesh>
      ))}
    </group>
  );
}

export const CLASSROOM_EVIDENCE_POSITIONS: [number, number, number][] = [
  [-2, 0.9, -1],
  [2.5, 0.9, 0.5],
  [0, 0.9, 2],
  [-1.5, 0.9, 2.5],
];

export function ClassroomScene({ evidence, collectedIds, focusedEvidenceId, onCollectEvidence, onFocusEvidence }: ClassroomSceneProps) {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#C4A882" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2, -5]}>
        <planeGeometry args={[12, 4]} />
        <meshStandardMaterial color="#F5F0E8" />
      </mesh>
      <mesh position={[-6, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial color="#EDE8DC" />
      </mesh>
      <mesh position={[6, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial color="#EDE8DC" />
      </mesh>

      {/* Whiteboard */}
      <mesh position={[0, 2.2, -4.95]}>
        <boxGeometry args={[3, 1.5, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, 2.2, -4.93]}>
        <boxGeometry args={[3.1, 1.6, 0.02]} />
        <meshStandardMaterial color="#808080" />
      </mesh>

      {/* Windows */}
      {[-2, 0, 2].map((z, i) => (
        <group key={i} position={[-5.95, 2.5, z]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.2, 1.5]} />
            <meshStandardMaterial color="#B0D4F1" emissive="#B0D4F1" emissiveIntensity={0.3} transparent opacity={0.6} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[1.3, 1.6, 0.02]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}

      {/* Teacher's desk */}
      <mesh position={[0, 0.75, -3.5]}>
        <boxGeometry args={[1.8, 0.06, 0.8]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>
      {[[-0.8, 0.37, -3.8], [0.8, 0.37, -3.8], [-0.8, 0.37, -3.2], [0.8, 0.37, -3.2]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.06, 0.75, 0.06]} />
          <meshStandardMaterial color="#4A3428" />
        </mesh>
      ))}

      {/* Student desks */}
      {[-2, 0, 2].map((x) =>
        [-1, 0.5, 2].map((z, i) => (
          <group key={`${x}-${i}`}>
            <Desk position={[x, 0, z]} />
            <Chair position={[x, 0, z + 0.45]} />
          </group>
        ))
      )}

      {/* Jamie's desk */}
      <group>
        <Desk position={[3.5, 0, 2.5]} />
        <Chair position={[3.5, 0, 2.95]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.5, 0.01, 2.5]}>
          <circleGeometry args={[0.8, 32]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.08} />
        </mesh>
      </group>

      {/* Evidence */}
      {evidence.map((ev, i) => {
        const pos = CLASSROOM_EVIDENCE_POSITIONS[i] || [i * 1.5, 0.9, 0];
        return (
          <InteractiveObject
            key={ev.id}
            position={pos}
            geometry={ev.type === 'observation' ? 'sphere' : ev.type === 'visual' ? 'cylinder' : 'box'}
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
      <ambientLight intensity={0.4} />
      <directionalLight position={[-5, 5, 3]} intensity={0.6} color="#FFF8E7" castShadow />
      <pointLight position={[0, 3.5, -3]} intensity={0.3} color="#FFFFFF" />
      <pointLight position={[-5, 2.5, 0]} intensity={0.4} color="#B0D4F1" distance={8} />
    </group>
  );
}
