import { InteractiveObject } from './InteractiveObject';
import { NPCCharacter, NPCHotspot } from './NPCCharacter';
import { Evidence } from '@/types/simulation';
import { useWoodTexture, useWallTexture, useTileTexture } from './TexturedMaterials';

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

// NPC child sitting at a desk
function StudentNPC({ position, color, name }: { position: [number, number, number]; color: string; name: string }) {
  return (
    <NPCCharacter
      position={position}
      bodyColor={color}
      pose="sitting"
      name={name}
      fidget={0.3}
    />
  );
}

export const CLASSROOM_EVIDENCE_POSITIONS: [number, number, number][] = [
  [3.7, 0.9, 2.3],   // Near Jamie — crumpled uniform observation
  [3.2, 0.75, 2.8],  // Dropped note on floor near Jamie's desk
  [0, 0.9, 2],
  [-1.5, 0.9, 2.5],
];

export function ClassroomScene({ evidence, collectedIds, focusedEvidenceId, onCollectEvidence, onFocusEvidence }: ClassroomSceneProps) {
  const floorTex = useTileTexture('#C4A882', '#B09A72', 32, [3, 2]);
  const wallTex = useWallTexture('#F5F0E8', [2, 1]);
  const sideWallTex = useWallTexture('#EDE8DC', [2, 1]);
  const deskTex = useWoodTexture('#8B7355');
  const teacherDeskTex = useWoodTexture('#5C4033', [2, 1]);
  // Build hotspots from evidence that are character-attached
  const jamieHotspots: NPCHotspot[] = [];
  const freeEvidence: { ev: Evidence; idx: number }[] = [];

  evidence.forEach((ev, i) => {
    if (ev.id === 'obs-1') {
      // Crumpled uniform — hotspot on Jamie's body
      jamieHotspots.push({
        id: ev.id,
        label: ev.title,
        offset: [0.0, 0.45, 0.18],
        hint: 'Click to observe appearance',
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
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial map={floorTex} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2, -5]} receiveShadow>
        <planeGeometry args={[12, 4]} />
        <meshStandardMaterial map={wallTex} roughness={0.92} metalness={0} />
      </mesh>
      <mesh position={[-6, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial map={sideWallTex} roughness={0.92} metalness={0} />
      </mesh>
      <mesh position={[6, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial map={sideWallTex} roughness={0.92} metalness={0} />
      </mesh>

      {/* Whiteboard */}
      <mesh position={[0, 2.2, -4.95]} castShadow>
        <boxGeometry args={[3, 1.5, 0.05]} />
        <meshStandardMaterial color="#F8F8F0" roughness={0.1} metalness={0.05} />
      </mesh>
      <mesh position={[0, 2.2, -4.93]}>
        <boxGeometry args={[3.1, 1.6, 0.02]} />
        <meshStandardMaterial color="#6B6B6B" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Windows — frosted glass look */}
      {[-2, 0, 2].map((z, i) => (
        <group key={i} position={[-5.95, 2.5, z]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.2, 1.5]} />
            <meshPhysicalMaterial
              color="#D4E8F5"
              transmission={0.6}
              roughness={0.2}
              metalness={0}
              transparent
              opacity={0.7}
            />
          </mesh>
          {/* Window frame */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[1.3, 1.6, 0.03]} />
            <meshStandardMaterial color="#E8E0D4" roughness={0.6} metalness={0.1} />
          </mesh>
          {/* Window sill */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[0, -0.8, 0.04]}>
            <boxGeometry args={[1.3, 0.06, 0.12]} />
            <meshStandardMaterial color="#D8D0C4" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Teacher's desk */}
      <mesh position={[0, 0.75, -3.5]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.06, 0.8]} />
        <meshStandardMaterial map={teacherDeskTex} roughness={0.6} metalness={0.05} />
      </mesh>
      {[[-0.8, 0.37, -3.8], [0.8, 0.37, -3.8], [-0.8, 0.37, -3.2], [0.8, 0.37, -3.2]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.06, 0.75, 0.06]} />
          <meshStandardMaterial color="#4A3428" roughness={0.7} metalness={0.05} />
        </mesh>
      ))}

      {/* Student desks with NPC students */}
      {[-2, 0, 2].map((x) =>
        [-1, 0.5, 2].map((z, i) => (
          <group key={`${x}-${i}`}>
            <Desk position={[x, 0, z]} />
            <Chair position={[x, 0, z + 0.45]} />
          </group>
        ))
      )}

      {/* Background student NPCs for atmosphere */}
      <StudentNPC position={[-2, 0.45, -0.55]} color="#e74c3c" name="Student" />
      <StudentNPC position={[0, 0.45, -0.55]} color="#2ecc71" name="Student" />
      <StudentNPC position={[2, 0.45, -0.55]} color="#9b59b6" name="Student" />
      <StudentNPC position={[-2, 0.45, 0.95]} color="#e67e22" name="Student" />
      <StudentNPC position={[0, 0.45, 0.95]} color="#1abc9c" name="Student" />

      {/* Jamie's desk — back corner, isolated */}
      <group>
        <Desk position={[3.5, 0, 2.5]} />
        <Chair position={[3.5, 0, 2.95]} />
        {/* Subtle highlight ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.5, 0.01, 2.5]}>
          <circleGeometry args={[0.8, 32]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.08} />
        </mesh>
      </group>

      {/* Jamie NPC — sitting withdrawn at their desk */}
      <NPCCharacter
        position={[3.5, 0.45, 2.5]}
        rotation={Math.PI}
        bodyColor="#6B8CA8"
        skinColor="#e8c4a0"
        pose="withdrawn"
        name="Jamie"
        behaviorHint="Hunched over, pulling at sleeves..."
        pullsSleeves={true}
        fidget={0.8}
        hotspots={jamieHotspots}
        onHotspotClick={handleJamieHotspot}
      />

      {/* Free-standing evidence items (not on NPCs) */}
      {freeEvidence.map(({ ev, idx }) => {
        const pos = CLASSROOM_EVIDENCE_POSITIONS[idx] || [idx * 1.5, 0.9, 0];
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

      {/* Realistic lighting */}
      <ambientLight intensity={0.25} color="#E8E0D8" />
      <directionalLight
        position={[-5, 6, 3]}
        intensity={0.8}
        color="#FFF5E0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.001}
      />
      {/* Warm fill from windows */}
      <pointLight position={[-5, 2.5, 0]} intensity={0.5} color="#D4E8F5" distance={10} decay={2} />
      {/* Overhead fluorescent feel */}
      <rectAreaLight position={[0, 3.8, 0]} width={6} height={3} intensity={0.6} color="#F5F0E8" rotation={[-Math.PI / 2, 0, 0]} />
      {/* Subtle warm bounce from floor */}
      <pointLight position={[0, 0.3, 0]} intensity={0.15} color="#C4A882" distance={8} decay={2} />
    </group>
  );
}
