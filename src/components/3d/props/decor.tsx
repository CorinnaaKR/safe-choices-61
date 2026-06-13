/** Shared decor / clutter props — the small objects that make rooms read as lived-in. */

interface PropTransform {
  position: [number, number, number];
  rotation?: number;
}

/** Outdoor tree with layered foliage. */
export function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.22, 2, 12]} />
        <meshStandardMaterial color="#4A3520" roughness={0.95} metalness={0} />
      </mesh>
      <mesh position={[0, 2.6, 0]} castShadow>
        <sphereGeometry args={[1.1, 12, 12]} />
        <meshStandardMaterial color="#2A5014" roughness={0.9} />
      </mesh>
      <mesh position={[0.6, 2.2, 0.3]} castShadow>
        <sphereGeometry args={[0.75, 10, 10]} />
        <meshStandardMaterial color="#35631C" roughness={0.9} />
      </mesh>
      <mesh position={[-0.4, 2.3, -0.3]} castShadow>
        <sphereGeometry args={[0.65, 10, 10]} />
        <meshStandardMaterial color="#2E5518" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, 0.01, 0.3]}>
        <circleGeometry args={[1.5, 16]} />
        <meshBasicMaterial color="#1a3a0a" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

/** Potted plant. */
export function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.1, 0.3, 12]} />
        <meshStandardMaterial color="#A0522D" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color="#3E6B2A" roughness={0.9} />
      </mesh>
      <mesh position={[0.12, 0.58, 0.05]} castShadow>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshStandardMaterial color="#4A7C33" roughness={0.9} />
      </mesh>
      <mesh position={[-0.1, 0.55, -0.06]} castShadow>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#365E24" roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Waste-paper bin. */
export function Bin({ position, color = '#5A6268' }: { position: [number, number, number]; color?: string }) {
  return (
    <mesh position={[position[0], position[1] + 0.2, position[2]]} castShadow>
      <cylinderGeometry args={[0.16, 0.12, 0.4, 14]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.4} />
    </mesh>
  );
}

const PAPER_COLOURS = ['#F2EDE2', '#E8D8B8', '#D8E4EC', '#F0DCDC', '#E0ECD8'];

/** Cork noticeboard with pinned papers. Faces +z by default. */
export function NoticeBoard({ position, rotation = 0 }: PropTransform) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh>
        <boxGeometry args={[1.6, 1.1, 0.04]} />
        <meshStandardMaterial color="#A8845C" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0, -0.005]}>
        <boxGeometry args={[1.7, 1.2, 0.03]} />
        <meshStandardMaterial color="#5C4033" roughness={0.7} />
      </mesh>
      {[[-0.5, 0.25], [0.05, 0.3], [0.55, 0.15], [-0.25, -0.25], [0.35, -0.28]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.025]} rotation={[0, 0, (i % 2 === 0 ? 1 : -1) * 0.06 * (i + 1)]}>
          <planeGeometry args={[0.28, 0.36]} />
          <meshStandardMaterial color={PAPER_COLOURS[i % PAPER_COLOURS.length]} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** Flat rug. */
export function Rug({
  position,
  size = [2, 1.4],
  color = '#7A4A3A',
}: {
  position: [number, number, number];
  size?: [number, number];
  color?: string;
}) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.98} metalness={0} />
    </mesh>
  );
}

/** Small stack of books / marking. */
export function BookStack({ position, rotation = 0 }: PropTransform) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[
        { y: 0.02, c: '#7A3D10', w: 0.26 },
        { y: 0.06, c: '#263848', w: 0.24 },
        { y: 0.1, c: '#5A2525', w: 0.27 },
        { y: 0.14, c: '#3E5238', w: 0.22 },
      ].map(({ y, c, w }, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0, (i % 2 ? -1 : 1) * 0.15, 0]} castShadow>
          <boxGeometry args={[w, 0.04, 0.18]} />
          <meshStandardMaterial color={c} roughness={0.75} />
        </mesh>
      ))}
    </group>
  );
}

/** Mug. */
export function Mug({ position, color = '#B5483A' }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.045, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.03, 0.09, 12]} />
        <meshStandardMaterial color={color} roughness={0.35} />
      </mesh>
      <mesh position={[0.045, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.022, 0.006, 8, 12]} />
        <meshStandardMaterial color={color} roughness={0.35} />
      </mesh>
    </group>
  );
}

/** Wall clock. Faces +z by default. */
export function WallClock({ position, rotation = 0 }: PropTransform) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} />
        <meshStandardMaterial color="#E8E4DC" roughness={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.005]}>
        <cylinderGeometry args={[0.19, 0.19, 0.03, 24]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Hands */}
      <mesh position={[0, 0.04, 0.025]}>
        <boxGeometry args={[0.012, 0.09, 0.005]} />
        <meshStandardMaterial color="#2A2A2A" />
      </mesh>
      <mesh position={[0.035, 0.01, 0.025]} rotation={[0, 0, -1.1]}>
        <boxGeometry args={[0.012, 0.12, 0.005]} />
        <meshStandardMaterial color="#2A2A2A" />
      </mesh>
    </group>
  );
}

/** School backpack slumped on the floor. */
export function Backpack({ position, rotation = 0, color = '#3E5C8A' }: PropTransform & { color?: string }) {
  return (
    <group position={position} rotation={[0, rotation, 0.25]}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <capsuleGeometry args={[0.14, 0.18, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.22, 0.12]} castShadow>
        <capsuleGeometry args={[0.07, 0.12, 6, 10]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Strap */}
      <mesh position={[0, 0.3, -0.1]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.05, 0.18, 0.015]} />
        <meshStandardMaterial color="#2A3A52" roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Football. */
export function Football({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.11, 0]} castShadow>
        <sphereGeometry args={[0.11, 14, 14]} />
        <meshStandardMaterial color="#E8E4DC" roughness={0.55} />
      </mesh>
      {/* Scuffed patches */}
      {[[0.06, 0.16, 0.06], [-0.07, 0.09, 0.07], [0.02, 0.05, -0.09]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#2A2A2A" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/** Open cardboard box (lost property etc.). */
export function CardboardBox({ position, rotation = 0 }: PropTransform) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.3, 0.35]} />
        <meshStandardMaterial color="#B8915A" roughness={0.9} />
      </mesh>
      {/* Open flaps */}
      <mesh position={[0, 0.32, 0.2]} rotation={[0.7, 0, 0]}>
        <boxGeometry args={[0.43, 0.14, 0.015]} />
        <meshStandardMaterial color="#A8824E" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.32, -0.2]} rotation={[-0.7, 0, 0]}>
        <boxGeometry args={[0.43, 0.14, 0.015]} />
        <meshStandardMaterial color="#A8824E" roughness={0.9} />
      </mesh>
      {/* Jumble inside */}
      <mesh position={[-0.08, 0.28, 0]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#7A4A6A" roughness={0.85} />
      </mesh>
      <mesh position={[0.1, 0.27, 0.05]}>
        <boxGeometry args={[0.1, 0.06, 0.08]} />
        <meshStandardMaterial color="#3E6B8A" roughness={0.85} />
      </mesh>
    </group>
  );
}

/** Framed certificate / picture for walls. Faces +z by default. */
export function WallFrame({
  position,
  rotation = 0,
  color = '#F2EDE2',
}: PropTransform & { color?: string }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh>
        <boxGeometry args={[0.42, 0.32, 0.02]} />
        <meshStandardMaterial color="#4A3428" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[0.36, 0.26]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  );
}

/** Kettle on a small tray with mugs (staff-room corner). */
export function KettleTray({ position, rotation = 0 }: PropTransform) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.015, 0]} castShadow>
        <boxGeometry args={[0.5, 0.03, 0.32]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Kettle body */}
      <mesh position={[-0.12, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.2, 14]} />
        <meshStandardMaterial color="#C8CACC" roughness={0.25} metalness={0.8} />
      </mesh>
      {/* Spout + handle */}
      <mesh position={[-0.02, 0.17, 0]} rotation={[0, 0, -0.8]}>
        <cylinderGeometry args={[0.015, 0.02, 0.1, 8]} />
        <meshStandardMaterial color="#C8CACC" roughness={0.25} metalness={0.8} />
      </mesh>
      <mesh position={[-0.22, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.05, 0.012, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.6} />
      </mesh>
      <Mug position={[0.12, 0.03, 0.06]} color="#4A6B8A" />
      <Mug position={[0.18, 0.03, -0.07]} color="#6B8A4A" />
    </group>
  );
}

/** Cluster of 3–4 small framed photos (memorial / shrine corner). */
export function PhotoCluster({ position }: { position: [number, number, number] }) {
  const frames = [
    { x: -0.14, y: 0, size: [0.2, 0.16] as [number, number], col: '#B8A898' },
    { x: 0.12, y: 0.04, size: [0.16, 0.2] as [number, number], col: '#C8B8A0' },
    { x: -0.04, y: -0.02, size: [0.18, 0.14] as [number, number], col: '#A89888' },
  ];
  return (
    <group position={position}>
      {frames.map(({ x, y, size, col }, i) => (
        <group key={i} position={[x, y, i * 0.015]}>
          <mesh castShadow>
            <boxGeometry args={[size[0] + 0.025, size[1] + 0.025, 0.015]} />
            <meshStandardMaterial color="#2A1A10" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={size} />
            <meshStandardMaterial color={col} roughness={0.8} />
          </mesh>
          {/* Simple face silhouette */}
          <mesh position={[0, 0.02, 0.012]}>
            <circleGeometry args={[size[0] * 0.22, 12]} />
            <meshStandardMaterial color="#7A5A40" roughness={0.9} />
          </mesh>
        </group>
      ))}
      {/* Small candle stub */}
      <mesh position={[0.22, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.02, 0.1, 10]} />
        <meshStandardMaterial color="#F2EDE2" roughness={0.9} />
      </mesh>
      <pointLight position={[0.22, 0.12, 0]} intensity={0.3} distance={0.5} color="#FF9040" decay={2} />
    </group>
  );
}

/** Open laptop on a surface. Screen faces +z by default. */
export function Laptop({ position, rotation = 0 }: PropTransform) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Base */}
      <mesh position={[0, 0.01, 0.05]} castShadow>
        <boxGeometry args={[0.36, 0.02, 0.25]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Screen (tilted open ~110°) */}
      <group position={[0, 0.02, -0.075]} rotation={[-1.92, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.36, 0.24, 0.015]} />
          <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Screen glow */}
        <mesh position={[0, 0, 0.009]}>
          <planeGeometry args={[0.32, 0.2]} />
          <meshStandardMaterial
            color="#0A1520"
            roughness={0.1}
            emissive="#1A3060"
            emissiveIntensity={0.9}
          />
        </mesh>
      </group>
      {/* Keyboard hint */}
      <mesh position={[0, 0.022, 0.04]}>
        <planeGeometry args={[0.3, 0.18]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.5} />
      </mesh>
    </group>
  );
}

/** Small pamphlet / folded leaflet lying face-up. */
export function Pamphlet({ position, rotation = 0, color = '#1C1C2A' }: PropTransform & { color?: string }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.003, 0]} castShadow>
        <boxGeometry args={[0.2, 0.006, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Fold line */}
      <mesh position={[0, 0.007, 0]}>
        <planeGeometry args={[0.001, 0.14]} />
        <meshStandardMaterial color="#3A3A4A" roughness={0.7} />
      </mesh>
    </group>
  );
}

/** Pile of unopened letters and envelopes. */
export function MailPile({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[(i % 2) * 0.015, i * 0.008, (i % 3) * 0.01]}
          rotation={[0, (i % 2 === 0 ? 1 : -1) * 0.06 * (i + 1), 0]}
          castShadow
        >
          <boxGeometry args={[0.22, 0.005, 0.11]} />
          <meshStandardMaterial
            color={['#F5F0E8', '#E8E0D0', '#F0EAE0', '#EAE4D8'][i]}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Curtained window — drawn closed, minimal light bleed. */
export function CurtainedWindow({ position, rotation = 0 }: PropTransform) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Window recess */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[1.4, 1.6, 0.04]} />
        <meshStandardMaterial color="#1A1814" roughness={0.9} />
      </mesh>
      {/* Light bleed — very dim, curtains are almost fully closed */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[1.35, 1.55]} />
        <meshStandardMaterial color="#1E1C14" roughness={1} emissive="#302818" emissiveIntensity={0.15} />
      </mesh>
      {/* Left curtain panel */}
      <mesh position={[-0.6, 0, 0.06]} castShadow>
        <boxGeometry args={[0.3, 1.7, 0.04]} />
        <meshStandardMaterial color="#3A2A1E" roughness={0.95} />
      </mesh>
      {/* Right curtain panel */}
      <mesh position={[0.6, 0, 0.06]} castShadow>
        <boxGeometry args={[0.3, 1.7, 0.04]} />
        <meshStandardMaterial color="#3A2A1E" roughness={0.95} />
      </mesh>
      {/* Curtain rod */}
      <mesh position={[0, 0.85, 0.1]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 1.6, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#5A5A5A" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Thin gap of light between curtains */}
      <pointLight position={[0, 0, 0.2]} intensity={0.08} distance={1} color="#C8B88A" decay={2} />
    </group>
  );
}
