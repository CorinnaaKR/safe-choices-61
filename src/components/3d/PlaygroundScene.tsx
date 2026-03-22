import { InteractiveObject } from './InteractiveObject';
import { NPCCharacter, NPCHotspot } from './NPCCharacter';
import { Evidence } from '@/types/simulation';
import { useGrassTexture, useNoiseTexture, useWoodTexture } from './TexturedMaterials';

interface PlaygroundSceneProps {
  evidence: Evidence[];
  collectedIds: string[];
  focusedEvidenceId: string | null;
  onCollectEvidence: (evidence: Evidence) => void;
  onFocusEvidence: (evidence: Evidence) => void;
}

function Bench({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.2, 0.06, 0.35]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
      <mesh position={[0, 0.7, -0.15]}>
        <boxGeometry args={[1.2, 0.5, 0.04]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
      {[[-0.5, 0.22, 0], [0.5, 0.22, 0]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.06, 0.45, 0.35]} />
          <meshStandardMaterial color="#5C4033" />
        </mesh>
      ))}
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 2, 8]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#2D5016" />
      </mesh>
      <mesh position={[0.5, 2, 0.3]}>
        <sphereGeometry args={[0.7, 8, 8]} />
        <meshStandardMaterial color="#3A6B1E" />
      </mesh>
    </group>
  );
}

export const PLAYGROUND_EVIDENCE_POSITIONS: [number, number, number][] = [
  [-3.6, 0.5, 3.4],  // Near Jamie on bench — wrist mark
  [-2.5, 0.7, 1.5],  // Marcus area
  [0, 0.7, 3],
  [-2, 0.7, 3],
];

export function PlaygroundScene({ evidence, collectedIds, focusedEvidenceId, onCollectEvidence, onFocusEvidence }: PlaygroundSceneProps) {
  const grassTex = useGrassTexture();
  const tarmacTex = useNoiseTexture('#6B6B6B', 0.08);
  const buildingTex = useNoiseTexture('#C4A882', 0.04);
  // Attach evidence to NPC hotspots
  const jamieHotspots: NPCHotspot[] = [];
  const freeEvidence: { ev: Evidence; idx: number }[] = [];

  evidence.forEach((ev, i) => {
    if (ev.id === 'vis-1') {
      // Bruise on wrist — hotspot on Jamie's left arm
      jamieHotspots.push({
        id: ev.id,
        label: 'Mark on Wrist',
        offset: [0.22, 0.15, 0.05],
        hint: 'Click to examine wrist',
        collected: collectedIds.includes(ev.id),
      });
    } else if (ev.id === 'obs-2') {
      // Playground behavior — hotspot on Jamie's posture
      jamieHotspots.push({
        id: ev.id,
        label: ev.title,
        offset: [0, 0.65, 0.15],
        hint: 'Click to observe behavior',
        collected: collectedIds.includes(ev.id),
      });
    } else {
      freeEvidence.push({ ev, idx: i });
    }
  });

  const handleJamieHotspot = (hotspotId: string) => {
    const ev = evidence.find(e => e.id === hotspotId);
    if (ev) onFocusEvidence(ev);
  };

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial map={grassTex} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial map={tarmacTex} />
      </mesh>

      {/* Football pitch lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3, 0.02, -1]}>
        <planeGeometry args={[4, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3, 0.02, 1]}>
        <planeGeometry args={[4, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Fence */}
      {Array.from({ length: 15 }).map((_, i) => (
        <group key={i}>
          <mesh position={[-7 + i, 0.6, -5]}>
            <boxGeometry args={[0.04, 1.2, 0.04]} />
            <meshStandardMaterial color="#808080" />
          </mesh>
          {[0.3, 0.6, 0.9].map((y, j) => (
            <mesh key={j} position={[-6.5 + i, y, -5]}>
              <boxGeometry args={[1, 0.03, 0.03]} />
              <meshStandardMaterial color="#909090" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Benches */}
      <Bench position={[-4, 0, -3.5]} />
      <Bench position={[4.5, 0, -3.5]} />

      {/* Jamie's bench — isolated, with glow */}
      <group>
        <Bench position={[-4, 0, 3]} rotation={Math.PI} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, 0.01, 3]}>
          <circleGeometry args={[1, 32]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.06} />
        </mesh>
      </group>

      {/* Trees */}
      <Tree position={[-7, 0, 4]} />
      <Tree position={[7, 0, 3]} />
      <Tree position={[-8, 0, -2]} />
      <Tree position={[8, 0, -3]} />

      {/* School building backdrop */}
      <mesh position={[0, 2, -7]}>
        <boxGeometry args={[14, 4, 0.5]} />
        <meshStandardMaterial color="#C4A882" />
      </mesh>
      {[-4, -2, 0, 2, 4].map((x, i) => (
        <mesh key={i} position={[x, 2.5, -6.7]}>
          <boxGeometry args={[0.8, 0.8, 0.1]} />
          <meshStandardMaterial color="#6BAED6" emissive="#6BAED6" emissiveIntensity={0.1} />
        </mesh>
      ))}
      <mesh position={[0, 1.2, -6.7]}>
        <boxGeometry args={[1, 2.2, 0.1]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>

      {/* ===== NPC Characters ===== */}

      {/* Jamie — sitting alone on the bench, withdrawn */}
      <NPCCharacter
        position={[-4, 0.45, 2.8]}
        rotation={0}
        bodyColor="#6B8CA8"
        skinColor="#e8c4a0"
        pose="withdrawn"
        name="Jamie"
        behaviorHint="Sitting alone, picking at sleeve..."
        pullsSleeves={true}
        fidget={0.7}
        hotspots={jamieHotspots}
        onHotspotClick={handleJamieHotspot}
      />

      {/* Marcus — running over near Jamie, then backing off */}
      <NPCCharacter
        position={[-2.5, 0, 2]}
        rotation={-Math.PI / 4}
        bodyColor="#e74c3c"
        skinColor="#c68642"
        pose="idle"
        name="Marcus"
        behaviorHint="Looks confused, shrugging at friends"
        fidget={0.9}
      />

      {/* Background kids playing football */}
      <NPCCharacter
        position={[2, 0, -1]}
        rotation={Math.PI / 3}
        bodyColor="#2ecc71"
        pose="idle"
        name="Student"
        fidget={1}
      />
      <NPCCharacter
        position={[4, 0, 0]}
        rotation={-Math.PI / 6}
        bodyColor="#9b59b6"
        pose="idle"
        name="Student"
        fidget={0.8}
      />
      <NPCCharacter
        position={[3, 0, -2]}
        rotation={Math.PI / 2}
        bodyColor="#e67e22"
        pose="idle"
        name="Student"
        fidget={0.6}
      />

      {/* Free-standing evidence */}
      {freeEvidence.map(({ ev, idx }) => {
        const pos = PLAYGROUND_EVIDENCE_POSITIONS[idx] || [idx * 2, 0.7, 0];
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
            size={[0.25, 0.25, 0.25]}
          />
        );
      })}

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 3]} intensity={0.8} color="#FFF5E0" castShadow />
      <hemisphereLight args={['#87CEEB', '#4A7C2E', 0.3]} />
    </group>
  );
}
