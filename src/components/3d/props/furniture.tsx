/** Shared furniture props — used across scene environments (classroom, office, home…). */

interface PropTransform {
  position: [number, number, number];
  rotation?: number;
}

/** School desk: wooden top on four metal legs. */
export function Desk({ position, rotation = 0 }: PropTransform) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.05, 0.5]} />
        <meshStandardMaterial color="#8B7355" roughness={0.65} metalness={0.05} />
      </mesh>
      {[[-0.35, 0.35, -0.2], [0.35, 0.35, -0.2], [-0.35, 0.35, 0.2], [0.35, 0.35, 0.2]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          <meshStandardMaterial color="#5A5A5A" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/** Stacking school chair. */
export function Chair({ position, rotation = 0, color = '#3A7BD5' }: PropTransform & { color?: string }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.35, 0.035, 0.35]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.7, -0.15]} castShadow>
        <boxGeometry args={[0.35, 0.5, 0.035]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      {[[-0.15, 0.22, -0.15], [0.15, 0.22, -0.15], [-0.15, 0.22, 0.15], [0.15, 0.22, 0.15]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.015, 0.015, 0.45, 8]} />
          <meshStandardMaterial color="#4A4A4A" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/** Outdoor bench: wooden planks on cast-iron legs. */
export function Bench({ position, rotation = 0 }: PropTransform) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[-0.12, 0, 0.12].map((z, i) => (
        <mesh key={`plank-${i}`} position={[0, 0.45, z]} castShadow>
          <boxGeometry args={[1.2, 0.03, 0.1]} />
          <meshStandardMaterial color="#9B7B2E" roughness={0.75} metalness={0} />
        </mesh>
      ))}
      {[0.55, 0.7].map((y, i) => (
        <mesh key={`back-${i}`} position={[0, y, -0.15]} castShadow>
          <boxGeometry args={[1.2, 0.08, 0.025]} />
          <meshStandardMaterial color="#8B6B14" roughness={0.75} />
        </mesh>
      ))}
      {[[-0.5, 0.22, 0], [0.5, 0.22, 0]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.04, 0.45, 0.35]} />
          <meshStandardMaterial color="#3A3A3A" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

const BOOK_COLOURS = ['#7A3D10', '#263848', '#5A2525', '#3E5238', '#6B5520', '#42325A'];

/** Bookshelf with rows of varied book spines. Faces +z by default. */
export function Bookshelf({ position, rotation = 0 }: PropTransform) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Carcass */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 3, 0.3]} />
        <meshStandardMaterial color="#5C4033" roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Book rows on each shelf */}
      {[0.5, 1.2, 1.9, 2.6].map((y, row) => (
        <group key={row}>
          {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
            <mesh key={i} position={[x, y, 0.18]} castShadow>
              <boxGeometry args={[0.14, 0.26 + ((row + i) % 3) * 0.02, 0.14]} />
              <meshStandardMaterial
                color={BOOK_COLOURS[(row * 2 + i) % BOOK_COLOURS.length]}
                roughness={0.75}
                metalness={0.02}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/** Metal filing cabinet with drawer fronts and handles. Faces +z by default. */
export function FilingCabinet({ position, rotation = 0 }: PropTransform) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.66, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 1.32, 0.6]} />
        <meshStandardMaterial color="#7D7F82" roughness={0.45} metalness={0.5} />
      </mesh>
      {[0.25, 0.66, 1.07].map((y, i) => (
        <group key={i}>
          <mesh position={[0, y, 0.305]}>
            <boxGeometry args={[0.44, 0.34, 0.01]} />
            <meshStandardMaterial color="#8A8C8F" roughness={0.4} metalness={0.55} />
          </mesh>
          <mesh position={[0, y + 0.1, 0.32]}>
            <boxGeometry args={[0.16, 0.03, 0.02]} />
            <meshStandardMaterial color="#4A4C4F" roughness={0.3} metalness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Interior door with handle. Faces +z by default. */
export function Door({ position, rotation = 0 }: PropTransform) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.9, 2.2, 0.06]} />
        <meshStandardMaterial color="#5C4033" roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[0.3, 1.1, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[0.3, 1.1, 0.08]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.85} roughness={0.15} />
      </mesh>
    </group>
  );
}

/** Low side table. */
export function SideTable({ position, rotation = 0 }: PropTransform) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.04, 0.45]} />
        <meshStandardMaterial color="#6B4226" roughness={0.6} metalness={0.05} />
      </mesh>
      {[[-0.3, 0.25, -0.18], [0.3, 0.25, -0.18], [-0.3, 0.25, 0.18], [0.3, 0.25, 0.18]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
          <meshStandardMaterial color="#5A3A20" roughness={0.65} />
        </mesh>
      ))}
    </group>
  );
}
