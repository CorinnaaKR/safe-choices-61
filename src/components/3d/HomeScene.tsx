import { InteractiveObject } from './InteractiveObject';
import { NPCCharacter, NPCHotspot } from './NPCCharacter';
import { Evidence } from '@/types/simulation';
import { useWoodTexture, useWallTexture, useTileTexture } from './TexturedMaterials';
import {
  Sofa,
  CoffeeTable,
  Television,
  FloorLamp,
  Door,
  Bookshelf,
  SideTable,
  Rug,
  Mug,
  WallFrame,
  FlavourObject,
  PhotoCluster,
  Laptop,
  Pamphlet,
  MailPile,
  CurtainedWindow,
} from './props';

interface HomeSceneProps {
  evidence: Evidence[];
  collectedIds: string[];
  focusedEvidenceId: string | null;
  onCollectEvidence: (evidence: Evidence) => void;
  onFocusEvidence: (evidence: Evidence) => void;
}

/**
 * Axis-aligned bounding boxes for furniture the player cannot walk through.
 * Format: [minX, maxX, minZ, maxZ] in world space.
 */
export const HOME_OBSTACLES: [number, number, number, number][] = [
  [-0.95, 0.95, -3.2, -2.45],   // sofa
  [-0.42, 0.42, -1.32, -0.88],  // coffee table
  [-4.15, -3.05, -1.05, 0.25],  // TV + stand (rotated against left wall)
  [2.35,  2.65,  -2.65, -2.35], // floor lamp (thin post)
  [3.65,  4.45,  -2.85, -1.55], // bookshelf (against right wall)
  [1.28,  1.82,  -2.38, -1.82], // side table
  [-0.32, 0.32,  -2.72, -2.08], // Lazlo NPC
];

/** World-space positions for each Lazlo evidence item. */
export const HOME_EVIDENCE_POSITIONS: Record<string, [number, number, number]> = {
  // Behavioural — on Lazlo NPC (hotspots, handled separately)
  'beh-l1': [0, 0.9, -1.7],
  'beh-l2': [0.18, 1.05, -1.72],
  // Environmental — free in room
  'env-l1': [-1.2, 2.1, -3.94],   // poster on back wall
  'env-l2': [2.2, 1.9, -3.94],    // newspaper clippings on back wall
  'env-l3': [-3.7, 0.85, -2.6],   // Uncle Joey shrine
  'env-l4': [0, 0.36, -0.78],     // pamphlet on coffee table
  'env-l5': [-3.92, 1.5, 0.2],    // curtained window
  // Documentation
  'doc-l1': [3.1, 0.08, 2.4],     // mail pile near door
  // Digital
  'dig-l1': [1.55, 0.75, -1.85],  // laptop on side table
  'dig-l2': [-0.22, 0.55, -1.65], // phone (NPC hotspot offset, world approx)
  // Behavioural — NPC hotspot (beh-l3: mentions group)
  'beh-l3': [0.08, 1.15, -1.72],
  // Behavioural — scene-l2b (walls-up path): Lazlo's closed body language
  'beh-l4': [-0.12, 0.72, -1.68],
};

export function HomeScene({
  evidence,
  collectedIds,
  focusedEvidenceId,
  onCollectEvidence,
  onFocusEvidence,
}: HomeSceneProps) {
  const floorTex = useTileTexture('#6A5040', '#5A4030', 24, [3, 3]);
  const wallTex = useWallTexture('#2C2520', [2, 1]);
  const ceilTex = useWallTexture('#1E1C18', [2, 1]);

  // Split evidence: NPC-attached hotspots vs free objects
  const npcHotspotIds = new Set(['beh-l1', 'beh-l2', 'beh-l3', 'dig-l2']);
  const freeEvidence = evidence.filter((e) => !npcHotspotIds.has(e.id));
  const npcEvidence = evidence.filter((e) => npcHotspotIds.has(e.id));

  const lazloHotspots: NPCHotspot[] = npcEvidence.map((ev) => {
    const offsets: Record<string, [number, number, number]> = {
      'beh-l1': [0, 0.35, 0.22],   // body / posture
      'beh-l2': [0.22, 0.55, 0.15], // arms / shoulders
      'beh-l3': [0, 0.95, 0.18],   // face / speech
      'dig-l2': [-0.2, 0.28, 0.2], // hand / phone
    };
    return {
      id: ev.id,
      label: ev.title,
      offset: offsets[ev.id] ?? [0, 0.5, 0.2],
      hint: 'Click to observe',
      collected: collectedIds.includes(ev.id),
    };
  });

  const handleLazloHotspot = (hotspotId: string) => {
    const ev = evidence.find((e) => e.id === hotspotId);
    if (ev) onFocusEvidence(ev);
  };

  return (
    <group>
      {/* ── Floor ─────────────────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[9, 8]} />
        <meshStandardMaterial map={floorTex} roughness={0.88} metalness={0.04} />
      </mesh>

      {/* ── Ceiling ───────────────────────────────────────────────────────── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <planeGeometry args={[9, 8]} />
        <meshStandardMaterial map={ceilTex} roughness={0.95} />
      </mesh>

      {/* ── Back wall ─────────────────────────────────────────────────────── */}
      <mesh position={[0, 1.5, -4]} receiveShadow>
        <planeGeometry args={[9, 3]} />
        <meshStandardMaterial map={wallTex} roughness={0.92} />
      </mesh>

      {/* ── Left wall ─────────────────────────────────────────────────────── */}
      <mesh position={[-4.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 3]} />
        <meshStandardMaterial map={wallTex} roughness={0.92} />
      </mesh>

      {/* ── Right wall ────────────────────────────────────────────────────── */}
      <mesh position={[4.5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 3]} />
        <meshStandardMaterial map={wallTex} roughness={0.92} />
      </mesh>

      {/* ── Front wall (behind player start) ─────────────────────────────── */}
      <mesh position={[0, 1.5, 4]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[9, 3]} />
        <meshStandardMaterial map={wallTex} roughness={0.92} />
      </mesh>

      {/* ── Lighting ──────────────────────────────────────────────────────── */}
      {/* Ambient — curtains drawn but not pitch dark; enough to read the room */}
      <ambientLight intensity={0.35} color="#3A3020" />
      {/* Ceiling pendant — main source */}
      <pointLight position={[0, 2.7, -0.5]} intensity={2.8} distance={10} color="#C08840" decay={2} castShadow shadow-mapSize={[512, 512]} />
      {/* Soft overhead fill to lift the whole room */}
      <directionalLight position={[0, 4, 1]} intensity={0.4} color="#B89060" />
      {/* Floor lamp fill — warm corner */}
      <pointLight position={[2.5, 1.6, -2.5]} intensity={1.4} distance={6} color="#D4A050" decay={2} />
      {/* TV screen fill */}
      <pointLight position={[-3.4, 0.9, -0.5]} intensity={0.5} distance={3} color="#3060A0" decay={2} />

      {/* ── Rug ──────────────────────────────────────────────────────────── */}
      <Rug position={[0, 0.01, -1.4]} size={[3.2, 2.2]} color="#3A2A1E" />

      {/* ── Sofa (Lazlo sits here) ────────────────────────────────────────── */}
      <Sofa position={[0, 0, -2.8]} rotation={0} color="#4A3A5A" />

      {/* ── Coffee table ─────────────────────────────────────────────────── */}
      <CoffeeTable position={[0, 0, -1.1]} />

      {/* ── Lazlo NPC ─────────────────────────────────────────────────────── */}
      <NPCCharacter
        position={[0, 0, -2.4]}
        rotation={Math.PI}
        bodyColor="#3A3A4A"
        skinColor="#C8A888"
        pose="hunched"
        name="Lazlo"
        behaviorHint="Not responding"
        fidget={0.15}
        hotspots={lazloHotspots}
        onHotspotClick={handleLazloHotspot}
      />

      {/* ── Television + stand (left wall) ───────────────────────────────── */}
      <Television position={[-3.6, 0, -0.4]} rotation={Math.PI / 2} />

      {/* ── Floor lamp ────────────────────────────────────────────────────── */}
      <FloorLamp position={[2.5, 0, -2.5]} />

      {/* ── Bookshelf (right wall) ────────────────────────────────────────── */}
      <Bookshelf position={[4.1, 0, -2.2]} rotation={-Math.PI / 2} />

      {/* ── Side table with laptop ────────────────────────────────────────── */}
      <SideTable position={[1.55, 0, -2.1]} />

      {/* ── Door (right wall, near front) ─────────────────────────────────── */}
      <Door position={[3.8, 0, 2.4]} rotation={-Math.PI / 2} />

      {/* ── Curtained window (left wall) ──────────────────────────────────── */}
      <group position={[-4.48, 1.5, 0.2]} rotation={[0, Math.PI / 2, 0]}>
        <CurtainedWindow position={[0, 0, 0]} />
      </group>

      {/* ── Uncle Joey shrine corner (left-back) ──────────────────────────── */}
      <PhotoCluster position={[-3.7, 0.85, -2.6]} />
      {/* Small shelf the shrine sits on */}
      <mesh position={[-3.95, 0.72, -2.6]} castShadow>
        <boxGeometry args={[0.08, 0.02, 0.55]} />
        <meshStandardMaterial color="#3A2A18" roughness={0.7} />
      </mesh>

      {/* ── Flavour objects (non-evidence, rule-out clutter) ─────────────── */}
      <FlavourObject
        position={[0, 0.35, -1.1]}
        label="Remote control"
        note="An old TV remote. The batteries have been left out beside it."
        hitRadius={0.14}
        hitY={0.05}
      >
        <mesh position={[0, 0.04, 0]} castShadow>
          <boxGeometry args={[0.06, 0.016, 0.14]} />
          <meshStandardMaterial color="#2A2A2A" roughness={0.5} />
        </mesh>
      </FlavourObject>

      <FlavourObject
        position={[-0.35, 0.35, -1.15]}
        label="Empty mug"
        note="A mug with dried coffee residue. It has been sitting here a while."
        hitRadius={0.1}
        hitY={0.06}
      >
        <Mug position={[0, 0, 0]} color="#3A3A3A" />
      </FlavourObject>

      <FlavourObject
        position={[3.5, 0.55, -1.2]}
        label="Gym bag"
        note="An old gym bag, unopened. Dust on the zip — hasn't been used in months."
        hitRadius={0.25}
        hitY={0.2}
      >
        <mesh position={[0, 0.18, 0]} castShadow>
          <capsuleGeometry args={[0.18, 0.3, 6, 12]} />
          <meshStandardMaterial color="#2C3A2C" roughness={0.85} />
        </mesh>
      </FlavourObject>

      <FlavourObject
        position={[4.05, 0.55, -1.6]}
        label="Photo"
        note="A photo of Lazlo and his girlfriend at a festival. It has been turned face-down."
        hitRadius={0.12}
        hitY={0.06}
      >
        <WallFrame position={[0, 0, 0]} rotation={Math.PI / 2} />
      </FlavourObject>

      <FlavourObject
        position={[-3.5, 0.88, -2.0]}
        label="Candle"
        note="A half-burned candle. Part of the corner where the photos are arranged."
        hitRadius={0.08}
        hitY={0.06}
      >
        <mesh position={[0, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.028, 0.12, 10]} />
          <meshStandardMaterial color="#EEE8DC" roughness={0.9} />
        </mesh>
      </FlavourObject>

      {/* ── Free evidence objects ─────────────────────────────────────────── */}
      {freeEvidence.map((ev) => {
        const pos = HOME_EVIDENCE_POSITIONS[ev.id] ?? [0, 1, 0];
        const collected = collectedIds.includes(ev.id);
        const focused = focusedEvidenceId === ev.id;

        // Evidence-specific meshes that match the visual type
        switch (ev.id) {
          case 'env-l1':
            // Extremist poster — wall-mounted rectangle with abstract symbol
            return (
              <group key={ev.id} position={pos}>
                <InteractiveObject
                  position={[0, 0, 0.01]}
                  geometry="box"
                  size={[0.7, 0.95, 0.02]}
                  color="#1A1020"
                  label={ev.title}
                  collected={collected}
                  focused={focused}
                  onClick={() => onFocusEvidence(ev)}
                />
                {/* Poster visual behind the marker */}
                <mesh position={[0, 0, -0.005]}>
                  <planeGeometry args={[0.7, 0.95]} />
                  <meshStandardMaterial color="#0D0A14" roughness={0.9} />
                </mesh>
                {/* Abstract angular symbol */}
                <mesh position={[0, 0.15, 0.005]}>
                  <cylinderGeometry args={[0.12, 0, 0.01, 8]} />
                  <meshStandardMaterial color="#8B1A1A" emissive="#8B1A1A" emissiveIntensity={0.4} />
                </mesh>
              </group>
            );

          case 'env-l2':
            // Newspaper clippings — cluster of paper strips on wall
            return (
              <group key={ev.id} position={pos}>
                <InteractiveObject
                  position={[0, 0, 0.01]}
                  geometry="box"
                  size={[0.65, 0.8, 0.02]}
                  color="#B8A878"
                  label={ev.title}
                  collected={collected}
                  focused={focused}
                  onClick={() => onFocusEvidence(ev)}
                />
                {[[-0.18, 0.22], [0.1, 0.1], [-0.05, -0.1], [0.2, -0.22], [-0.2, -0.05]].map(
                  ([x, y], i) => (
                    <mesh key={i} position={[x, y, 0.005]} rotation={[0, 0, (i % 2 === 0 ? 1 : -1) * 0.08]}>
                      <planeGeometry args={[0.22, 0.08]} />
                      <meshStandardMaterial color="#F0EAD8" roughness={0.9} />
                    </mesh>
                  )
                )}
              </group>
            );

          case 'env-l3':
            // Uncle Joey shrine — handled by PhotoCluster, just an invisible trigger
            return (
              <InteractiveObject
                key={ev.id}
                position={[pos[0], pos[1] + 0.1, pos[2]]}
                geometry="sphere"
                size={[0.28, 0.28, 0.28]}
                color="#C89858"
                label={ev.title}
                collected={collected}
                focused={focused}
                onClick={() => onFocusEvidence(ev)}
              />
            );

          case 'env-l4':
            // Pamphlet on coffee table
            return (
              <group key={ev.id} position={pos}>
                <Pamphlet position={[0, 0, 0]} color="#1C1C2E" />
                <InteractiveObject
                  position={[0, 0.06, 0]}
                  geometry="box"
                  size={[0.22, 0.05, 0.15]}
                  color="#2A2A3E"
                  label={ev.title}
                  collected={collected}
                  focused={focused}
                  onClick={() => onFocusEvidence(ev)}
                />
              </group>
            );

          case 'dig-l1':
            // Laptop on side table
            return (
              <group key={ev.id} position={pos}>
                <Laptop position={[0, 0, 0]} />
                <InteractiveObject
                  position={[0, 0.22, 0]}
                  geometry="box"
                  size={[0.38, 0.28, 0.04]}
                  color="#1A3060"
                  label={ev.title}
                  collected={collected}
                  focused={focused}
                  onClick={() => onFocusEvidence(ev)}
                />
              </group>
            );

          case 'env-l5':
            // Window / curtain trigger
            return (
              <InteractiveObject
                key={ev.id}
                position={[pos[0] + 0.5, pos[1], pos[2]]}
                geometry="box"
                size={[0.15, 0.5, 0.12]}
                color="#3A2A1E"
                label={ev.title}
                collected={collected}
                focused={focused}
                onClick={() => onFocusEvidence(ev)}
              />
            );

          case 'doc-l1':
            // Mail pile near door
            return (
              <group key={ev.id} position={pos}>
                <MailPile position={[0, 0, 0]} />
                <InteractiveObject
                  position={[0, 0.06, 0]}
                  geometry="box"
                  size={[0.24, 0.04, 0.14]}
                  color="#E0D8C8"
                  label={ev.title}
                  collected={collected}
                  focused={focused}
                  onClick={() => onFocusEvidence(ev)}
                />
              </group>
            );

          default:
            return (
              <InteractiveObject
                key={ev.id}
                position={pos}
                size={[0.22, 0.22, 0.22]}
                color="#8B6A3A"
                label={ev.title}
                collected={collected}
                focused={focused}
                onClick={() => onFocusEvidence(ev)}
              />
            );
        }
      })}
    </group>
  );
}
