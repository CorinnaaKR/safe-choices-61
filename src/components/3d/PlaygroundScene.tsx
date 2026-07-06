import { InteractiveObject } from './InteractiveObject';
import { NPCCharacter, NPCHotspot } from './NPCCharacter';
import { Evidence } from '@/types/simulation';
import { useGrassTexture, useNoiseTexture, useWoodTexture } from './TexturedMaterials';
import { Bench, Tree, Bin, Football, FlavourObject } from './props';

interface PlaygroundSceneProps {
  evidence: Evidence[];
  collectedIds: string[];
  focusedEvidenceId: string | null;
  onCollectEvidence: (evidence: Evidence) => void;
  onFocusEvidence: (evidence: Evidence) => void;
}

/** Low shrub — clustered spheres along the fence line. */
function Bush({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.45, 10, 10]} />
        <meshStandardMaterial color="#2E5518" roughness={0.95} />
      </mesh>
      <mesh position={[0.35, 0.22, 0.1]} castShadow>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#35631C" roughness={0.95} />
      </mesh>
      <mesh position={[-0.3, 0.2, -0.1]} castShadow>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial color="#2A5014" roughness={0.95} />
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial map={grassTex} roughness={0.95} metalness={0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial map={tarmacTex} roughness={0.9} metalness={0.05} />
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

      {/* Back fence (z = -5) */}
      {Array.from({ length: 15 }).map((_, i) => (
        <group key={`bf-${i}`}>
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

      {/* Left fence (x = -8) */}
      {Array.from({ length: 11 }).map((_, i) => (
        <group key={`lf-${i}`}>
          <mesh position={[-8, 0.6, -5 + i]}>
            <boxGeometry args={[0.04, 1.2, 0.04]} />
            <meshStandardMaterial color="#808080" />
          </mesh>
          {[0.3, 0.6, 0.9].map((y, j) => (
            <mesh key={j} position={[-8, y, -4.5 + i]}>
              <boxGeometry args={[0.03, 0.03, 1]} />
              <meshStandardMaterial color="#909090" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Right fence (x = 8) */}
      {Array.from({ length: 11 }).map((_, i) => (
        <group key={`rf-${i}`}>
          <mesh position={[8, 0.6, -5 + i]}>
            <boxGeometry args={[0.04, 1.2, 0.04]} />
            <meshStandardMaterial color="#808080" />
          </mesh>
          {[0.3, 0.6, 0.9].map((y, j) => (
            <mesh key={j} position={[8, y, -4.5 + i]}>
              <boxGeometry args={[0.03, 0.03, 1]} />
              <meshStandardMaterial color="#909090" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Front fence (z = 5.5) */}
      {Array.from({ length: 15 }).map((_, i) => (
        <group key={`ff-${i}`}>
          <mesh position={[-7 + i, 0.6, 5.5]}>
            <boxGeometry args={[0.04, 1.2, 0.04]} />
            <meshStandardMaterial color="#808080" />
          </mesh>
          {[0.3, 0.6, 0.9].map((y, j) => (
            <mesh key={j} position={[-6.5 + i, y, 5.5]}>
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

      {/* ── School building — U-shaped, 2-storey ── */}
      {/* Shared materials: brick #B8724A, trim #E8DCC8, roof #888880, glass #7BB8D4 */}

      {/* ── MAIN BACK BLOCK ── */}
      {/* Ground floor */}
      <mesh position={[0, 1.5, -11]} receiveShadow castShadow>
        <boxGeometry args={[22, 3, 5]} />
        <meshStandardMaterial color="#B8724A" roughness={0.92} metalness={0} />
      </mesh>
      {/* Concrete band between floors */}
      <mesh position={[0, 3.1, -11]}>
        <boxGeometry args={[22, 0.25, 5.1]} />
        <meshStandardMaterial color="#D8CDB8" roughness={0.85} />
      </mesh>
      {/* First floor */}
      <mesh position={[0, 4.6, -11]} receiveShadow castShadow>
        <boxGeometry args={[22, 3, 5]} />
        <meshStandardMaterial color="#B8724A" roughness={0.92} metalness={0} />
      </mesh>
      {/* Roof parapet */}
      <mesh position={[0, 6.3, -11]}>
        <boxGeometry args={[22.4, 0.5, 5.4]} />
        <meshStandardMaterial color="#888880" roughness={0.9} />
      </mesh>
      {/* Flat roof surface */}
      <mesh position={[0, 6.52, -11]}>
        <boxGeometry args={[22, 0.08, 5]} />
        <meshStandardMaterial color="#777772" roughness={1} />
      </mesh>

      {/* Ground floor windows — main block */}
      {[-8,-6,-4,-2,0,2,4,6,8].map((x, i) => (
        <group key={`mgw-${i}`} position={[x, 1.7, -8.74]}>
          <mesh>
            <boxGeometry args={[1.1, 1.4, 0.15]} />
            <meshStandardMaterial color="#D8CDB8" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[0.95, 1.25, 0.05]} />
            <meshPhysicalMaterial color="#7BB8D4" transmission={0.5} roughness={0.05} metalness={0.1} />
          </mesh>
        </group>
      ))}
      {/* First floor windows — main block */}
      {[-8,-6,-4,-2,0,2,4,6,8].map((x, i) => (
        <group key={`mfw-${i}`} position={[x, 4.8, -8.74]}>
          <mesh>
            <boxGeometry args={[1.1, 1.4, 0.15]} />
            <meshStandardMaterial color="#D8CDB8" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[0.95, 1.25, 0.05]} />
            <meshPhysicalMaterial color="#7BB8D4" transmission={0.5} roughness={0.05} metalness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Central entrance — double doors + canopy */}
      <mesh position={[0, 1.15, -8.7]}>
        <boxGeometry args={[2.4, 2.3, 0.15]} />
        <meshStandardMaterial color="#D8CDB8" roughness={0.7} />
      </mesh>
      <mesh position={[-0.55, 1.15, -8.64]}>
        <boxGeometry args={[1.0, 2.1, 0.06]} />
        <meshPhysicalMaterial color="#7BB8D4" transmission={0.35} roughness={0.1} />
      </mesh>
      <mesh position={[0.55, 1.15, -8.64]}>
        <boxGeometry args={[1.0, 2.1, 0.06]} />
        <meshPhysicalMaterial color="#7BB8D4" transmission={0.35} roughness={0.1} />
      </mesh>
      {/* Canopy */}
      <mesh position={[0, 2.55, -8.2]}>
        <boxGeometry args={[3.2, 0.12, 1.2]} />
        <meshStandardMaterial color="#888880" roughness={0.85} />
      </mesh>
      <mesh position={[-1.4, 2.1, -8.2]}>
        <boxGeometry args={[0.08, 0.9, 0.08]} />
        <meshStandardMaterial color="#999990" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[1.4, 2.1, -8.2]}>
        <boxGeometry args={[0.08, 0.9, 0.08]} />
        <meshStandardMaterial color="#999990" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* ── LEFT WING ── (x = -11 to -13.5, z = -13.5 to -2) */}
      <mesh position={[-12.25, 1.5, -7.75]} receiveShadow castShadow>
        <boxGeometry args={[5, 3, 11.5]} />
        <meshStandardMaterial color="#B8724A" roughness={0.92} metalness={0} />
      </mesh>
      <mesh position={[-12.25, 3.1, -7.75]}>
        <boxGeometry args={[5, 0.25, 11.6]} />
        <meshStandardMaterial color="#D8CDB8" roughness={0.85} />
      </mesh>
      <mesh position={[-12.25, 4.6, -7.75]} receiveShadow castShadow>
        <boxGeometry args={[5, 3, 11.5]} />
        <meshStandardMaterial color="#B8724A" roughness={0.92} metalness={0} />
      </mesh>
      <mesh position={[-12.25, 6.3, -7.75]}>
        <boxGeometry args={[5.4, 0.5, 11.9]} />
        <meshStandardMaterial color="#888880" roughness={0.9} />
      </mesh>
      {/* Left wing inner-face windows (facing playground) */}
      {[-10, -7.5, -5].map((z, i) => (
        <group key={`lgw-${i}`} position={[-9.74, 1.7, z]}>
          <mesh><boxGeometry args={[0.15, 1.4, 1.1]} /><meshStandardMaterial color="#D8CDB8" roughness={0.7} /></mesh>
          <mesh position={[-0.08, 0, 0]}><boxGeometry args={[0.05, 1.25, 0.95]} /><meshPhysicalMaterial color="#7BB8D4" transmission={0.5} roughness={0.05} /></mesh>
        </group>
      ))}
      {[-10, -7.5, -5].map((z, i) => (
        <group key={`lfw-${i}`} position={[-9.74, 4.8, z]}>
          <mesh><boxGeometry args={[0.15, 1.4, 1.1]} /><meshStandardMaterial color="#D8CDB8" roughness={0.7} /></mesh>
          <mesh position={[-0.08, 0, 0]}><boxGeometry args={[0.05, 1.25, 0.95]} /><meshPhysicalMaterial color="#7BB8D4" transmission={0.5} roughness={0.05} /></mesh>
        </group>
      ))}

      {/* ── RIGHT WING ── (mirror of left) */}
      <mesh position={[12.25, 1.5, -7.75]} receiveShadow castShadow>
        <boxGeometry args={[5, 3, 11.5]} />
        <meshStandardMaterial color="#B8724A" roughness={0.92} metalness={0} />
      </mesh>
      <mesh position={[12.25, 3.1, -7.75]}>
        <boxGeometry args={[5, 0.25, 11.6]} />
        <meshStandardMaterial color="#D8CDB8" roughness={0.85} />
      </mesh>
      <mesh position={[12.25, 4.6, -7.75]} receiveShadow castShadow>
        <boxGeometry args={[5, 3, 11.5]} />
        <meshStandardMaterial color="#B8724A" roughness={0.92} metalness={0} />
      </mesh>
      <mesh position={[12.25, 6.3, -7.75]}>
        <boxGeometry args={[5.4, 0.5, 11.9]} />
        <meshStandardMaterial color="#888880" roughness={0.9} />
      </mesh>
      {[-10, -7.5, -5].map((z, i) => (
        <group key={`rgw-${i}`} position={[9.74, 1.7, z]}>
          <mesh><boxGeometry args={[0.15, 1.4, 1.1]} /><meshStandardMaterial color="#D8CDB8" roughness={0.7} /></mesh>
          <mesh position={[0.08, 0, 0]}><boxGeometry args={[0.05, 1.25, 0.95]} /><meshPhysicalMaterial color="#7BB8D4" transmission={0.5} roughness={0.05} /></mesh>
        </group>
      ))}
      {[-10, -7.5, -5].map((z, i) => (
        <group key={`rfw-${i}`} position={[9.74, 4.8, z]}>
          <mesh><boxGeometry args={[0.15, 1.4, 1.1]} /><meshStandardMaterial color="#D8CDB8" roughness={0.7} /></mesh>
          <mesh position={[0.08, 0, 0]}><boxGeometry args={[0.05, 1.25, 0.95]} /><meshPhysicalMaterial color="#7BB8D4" transmission={0.5} roughness={0.05} /></mesh>
        </group>
      ))}

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

      {/* ---- Scene density ---- */}
      <Bush position={[-6.2, 0, -4.4]} />
      <Bush position={[-3.5, 0, -4.5]} />
      <Bush position={[5.8, 0, -4.4]} />
      <Bush position={[7.2, 0, 1]} />

      {/* Hopscotch chalk marks on the tarmac */}
      <group position={[-1.8, 0.03, -1.2]}>
        {[0, 0.55, 1.1, 1.65, 2.2].map((z, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[i % 2 ? 0.3 : 0, 0, z]}>
            <planeGeometry args={[0.45, 0.45]} />
            <meshBasicMaterial color="#E8E4DC" transparent opacity={0.35} />
          </mesh>
        ))}
      </group>

      {/* ---- Inspectable non-evidence: signal vs noise ---- */}
      <FlavourObject
        position={[2.8, 0, 0.5]}
        label="Football"
        note="A scuffed football. The game moves on without it."
        hitRadius={0.2}
        hitY={0.11}
      >
        <Football position={[0, 0, 0]} />
      </FlavourObject>

      <FlavourObject
        position={[4.5, 0.47, -3.4]}
        label="Lost glove"
        note="A small glove left on the bench. Lost property, nothing more."
        hitRadius={0.16}
        hitY={0.03}
      >
        {/* Glove: palm + thumb */}
        <mesh position={[0, 0.02, 0]} rotation={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.12, 0.03, 0.16]} />
          <meshStandardMaterial color="#8A3A3A" roughness={0.9} />
        </mesh>
        <mesh position={[0.07, 0.02, 0.04]} rotation={[0, 1.1, 0]}>
          <boxGeometry args={[0.04, 0.025, 0.07]} />
          <meshStandardMaterial color="#8A3A3A" roughness={0.9} />
        </mesh>
      </FlavourObject>

      <FlavourObject
        position={[5.6, 0, -3.6]}
        label="Bin"
        note="An overflowing bin. Crisp packets and juice cartons."
        hitRadius={0.26}
        hitY={0.25}
      >
        <Bin position={[0, 0, 0]} color="#3E5C3A" />
        {/* Overflow */}
        <mesh position={[0.05, 0.42, 0.02]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#C8B8A0" roughness={0.9} />
        </mesh>
        <mesh position={[-0.08, 0.4, -0.04]}>
          <boxGeometry args={[0.08, 0.05, 0.06]} />
          <meshStandardMaterial color="#A04A3A" roughness={0.85} />
        </mesh>
      </FlavourObject>

      <FlavourObject
        position={[-2, 0.03, -0.1]}
        label="Hopscotch"
        note="Chalk hopscotch from lunchtime. Half washed away."
        hitRadius={0.5}
        hitY={0.05}
      >
        <group />
      </FlavourObject>

      {/* Extended ground plane so the grass reaches the horizon */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#4A7C2E" roughness={1} />
      </mesh>

      {/* Dense tree line along all four edges to block sky/ground join */}
      {[-9,-7,-5,-3,-1,1,3,5,7,9].map((x, i) => (
        <Tree key={`ts-${i}`} position={[x, 0, 7.5]} />
      ))}
      {[-7,-5,-3,-1,1,3,5,7].map((z, i) => (
        <Tree key={`tw-${i}`} position={[-9.5, 0, z]} />
      ))}
      {[-7,-5,-3,-1,1,3,5,7].map((z, i) => (
        <Tree key={`te-${i}`} position={[9.5, 0, z]} />
      ))}

{/* Realistic outdoor lighting */}
      <ambientLight intensity={0.3} color="#E0E8F0" />
      <directionalLight
        position={[5, 10, 3]}
        intensity={1.2}
        color="#FFF5E0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={25}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.001}
      />
      <hemisphereLight args={['#87CEEB', '#4A7C2E', 0.35]} />
    </group>
  );
}
