/** Jamie's Story — home kitchen/diner.
 *  Bright white walls + strip lighting = immediately distinct from Lazlo's dark living room. */

export function JamieHomeScene() {
  const wallColor    = '#F2EDE4'; // off-white plaster
  const floorColor   = '#A87040'; // warm oak boards
  const cabinetColor = '#FFFFFF'; // white gloss kitchen units
  const worktopColor = '#7A9090'; // grey-green stone
  const fridgeColor  = '#E8E8E8'; // white fridge
  const chairColor   = '#5A8A6A'; // sage green chairs

  return (
    <group>
      {/* ── Lighting — deliberately bright, domestic kitchen feel ──── */}
      <ambientLight intensity={1.8} color="#FFF8F0" />
      {/* Main ceiling strip lights */}
      <rectAreaLight position={[-1.5, 2.9, -1]} width={3} height={0.2} intensity={6} color="#FFF5E8" rotation={[-Math.PI / 2, 0, 0]} />
      <rectAreaLight position={[1.5, 2.9, 1]} width={3} height={0.2} intensity={6} color="#FFF5E8" rotation={[-Math.PI / 2, 0, 0]} />
      {/* Daylight from window */}
      <directionalLight position={[5, 4, 1]} intensity={2.0} color="#FFF0D8" castShadow shadow-mapSize={[512, 512]} />
      {/* Fill */}
      <pointLight position={[-3, 2, 2]} intensity={1.0} color="#FFE8D0" />

      {/* ── Floor ──────────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[9, 9]} />
        <meshStandardMaterial color={floorColor} roughness={0.65} />
      </mesh>
      {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.001, 0]}>
          <planeGeometry args={[0.015, 9]} />
          <meshStandardMaterial color="#7A5228" />
        </mesh>
      ))}

      {/* ── Walls (white) ──────────────────────────────────────────── */}
      <mesh position={[0, 1.5, -4.5]} receiveShadow>
        <boxGeometry args={[9, 3, 0.08]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>
      <mesh position={[-4.5, 1.5, 0]} receiveShadow>
        <boxGeometry args={[0.08, 3, 9]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>
      <mesh position={[4.5, 1.5, 0]} receiveShadow>
        <boxGeometry args={[0.08, 3, 9]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <planeGeometry args={[9, 9]} />
        <meshStandardMaterial color="#FFFFFF" roughness={1} />
      </mesh>

      {/* ── Kitchen units along back wall ──────────────────────────── */}
      {/* Base units */}
      <mesh position={[-0.5, 0.45, -4.1]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.9, 0.6]} />
        <meshStandardMaterial color={cabinetColor} roughness={0.3} metalness={0.05} />
      </mesh>
      {/* Worktop */}
      <mesh position={[-0.5, 0.92, -4.05]} castShadow>
        <boxGeometry args={[6.1, 0.05, 0.68]} />
        <meshStandardMaterial color={worktopColor} roughness={0.2} metalness={0.15} />
      </mesh>
      {/* Wall units */}
      <mesh position={[-0.5, 2.2, -4.34]}>
        <boxGeometry args={[6, 0.75, 0.35]} />
        <meshStandardMaterial color={cabinetColor} roughness={0.3} metalness={0.05} />
      </mesh>
      {/* Cabinet door lines */}
      {[-2.8, -1.3, 0.2, 1.7].map((x, i) => (
        <mesh key={i} position={[x, 0.45, -3.79]}>
          <boxGeometry args={[1.2, 0.82, 0.015]} />
          <meshStandardMaterial color="#F0F0F0" roughness={0.25} />
        </mesh>
      ))}
      {[-2.8, -1.3, 0.2, 1.7].map((x, i) => (
        <mesh key={i} position={[x, 2.2, -4.16]}>
          <boxGeometry args={[1.2, 0.65, 0.01]} />
          <meshStandardMaterial color="#F0F0F0" roughness={0.25} />
        </mesh>
      ))}
      {/* Small handles */}
      {[-2.8, -1.3, 0.2, 1.7].map((x, i) => (
        <mesh key={i} position={[x, 0.55, -3.78]}>
          <boxGeometry args={[0.3, 0.025, 0.025]} />
          <meshStandardMaterial color="#B0B8B8" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Hob (induction) on worktop */}
      <mesh position={[-2.2, 0.95, -4.0]}>
        <boxGeometry args={[0.6, 0.02, 0.5]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.2} metalness={0.7} />
      </mesh>
      {[[-0.13, -0.1], [0.13, -0.1], [-0.13, 0.1], [0.13, 0.1]].map(([ox, oz], i) => (
        <mesh key={i} position={[-2.2 + ox, 0.96, -4.0 + oz]}>
          <cylinderGeometry args={[0.07, 0.07, 0.01, 14]} />
          <meshStandardMaterial color="#2A2A3A" roughness={0.2} metalness={0.6} />
        </mesh>
      ))}

      {/* Sink */}
      <mesh position={[0.5, 0.93, -4.0]}>
        <boxGeometry args={[0.5, 0.04, 0.38]} />
        <meshStandardMaterial color="#C8D8D8" roughness={0.15} metalness={0.5} />
      </mesh>
      {/* Tap */}
      <mesh position={[0.5, 1.08, -4.15]}>
        <cylinderGeometry args={[0.012, 0.012, 0.18, 8]} />
        <meshStandardMaterial color="#C0C8C8" metalness={0.75} roughness={0.15} />
      </mesh>
      <mesh position={[0.5, 1.17, -4.1]}>
        <cylinderGeometry args={[0.01, 0.01, 0.12, 8]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#C0C8C8" metalness={0.75} roughness={0.15} />
      </mesh>

      {/* Kettle */}
      <mesh position={[2.1, 1.06, -3.92]} castShadow>
        <cylinderGeometry args={[0.1, 0.09, 0.24, 14]} />
        <meshStandardMaterial color="#E8E0D8" roughness={0.25} metalness={0.45} />
      </mesh>

      {/* ── Fridge — right side of kitchen ──────────────────────────── */}
      <mesh position={[3.55, 0.95, -4.1]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 1.9, 0.65]} />
        <meshStandardMaterial color={fridgeColor} roughness={0.25} metalness={0.1} />
      </mesh>
      {/* Freezer compartment line */}
      <mesh position={[3.55, 1.55, -3.77]}>
        <boxGeometry args={[0.68, 0.015, 0.01]} />
        <meshStandardMaterial color="#C8C8C8" />
      </mesh>
      {/* Fridge handle */}
      <mesh position={[3.2, 1.1, -3.78]}>
        <boxGeometry args={[0.04, 0.35, 0.04]} />
        <meshStandardMaterial color="#B0B8B8" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Freezer handle */}
      <mesh position={[3.2, 1.72, -3.78]}>
        <boxGeometry args={[0.04, 0.2, 0.04]} />
        <meshStandardMaterial color="#B0B8B8" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Fridge magnets (colourful) */}
      {[[0.1, 0.8], [-0.1, 1.2], [0.18, 1.4]].map(([fx, fy], i) => (
        <mesh key={i} position={[3.19, fy, -3.76 + fx]}>
          <boxGeometry args={[0.008, 0.06, 0.06]} />
          <meshStandardMaterial color={['#E04040', '#40A0E0', '#F0C040'][i]} roughness={0.5} />
        </mesh>
      ))}

      {/* ── Window — large, right wall ──────────────────────────────── */}
      {/* Frame */}
      <mesh position={[4.46, 2.0, -1.0]}>
        <boxGeometry args={[0.07, 1.6, 1.4]} />
        <meshStandardMaterial color="#E8E0D0" roughness={0.6} />
      </mesh>
      {/* Glass — emissive bright daylight */}
      <mesh position={[4.43, 2.0, -1.0]}>
        <boxGeometry args={[0.025, 1.4, 1.2]} />
        <meshStandardMaterial color="#D0E8FF" transparent opacity={0.55} emissive="#A0D0FF" emissiveIntensity={0.8} />
      </mesh>
      {/* Cross bar */}
      <mesh position={[4.46, 2.0, -1.0]}>
        <boxGeometry args={[0.05, 0.03, 1.4]} />
        <meshStandardMaterial color="#E8E0D0" roughness={0.6} />
      </mesh>
      <mesh position={[4.46, 2.0, -1.0]}>
        <boxGeometry args={[0.05, 1.4, 0.03]} />
        <meshStandardMaterial color="#E8E0D0" roughness={0.6} />
      </mesh>

      {/* ── Dining table ─────────────────────────────────────────────── */}
      {/* Tabletop — light wood */}
      <mesh position={[0.5, 0.74, 1.5]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.05, 1.0]} />
        <meshStandardMaterial color="#C8A86A" roughness={0.5} />
      </mesh>
      {/* Legs */}
      {[[-0.7, -0.42], [0.7, -0.42], [-0.7, 0.42], [0.7, 0.42]].map(([lx, lz], i) => (
        <mesh key={i} position={[0.5 + lx, 0.36, 1.5 + lz]} castShadow>
          <boxGeometry args={[0.05, 0.72, 0.05]} />
          <meshStandardMaterial color="#A07840" roughness={0.55} />
        </mesh>
      ))}

      {/* ── Chairs (sage green) ──────────────────────────────────────── */}
      {/* Near chair */}
      <group position={[0.5, 0, 2.4]}>
        <mesh position={[0, 0.44, 0]} castShadow><boxGeometry args={[0.42, 0.04, 0.42]} /><meshStandardMaterial color={chairColor} roughness={0.6} /></mesh>
        <mesh position={[0, 0.72, -0.19]} castShadow><boxGeometry args={[0.42, 0.5, 0.04]} /><meshStandardMaterial color={chairColor} roughness={0.6} /></mesh>
        {[[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]].map(([cx, cz], i) => (
          <mesh key={i} position={[cx, 0.21, cz]}><cylinderGeometry args={[0.015, 0.015, 0.42, 8]} /><meshStandardMaterial color="#3A5A40" /></mesh>
        ))}
      </group>
      {/* Far chair */}
      <group position={[0.5, 0, 0.6]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.44, 0]} castShadow><boxGeometry args={[0.42, 0.04, 0.42]} /><meshStandardMaterial color={chairColor} roughness={0.6} /></mesh>
        <mesh position={[0, 0.72, -0.19]} castShadow><boxGeometry args={[0.42, 0.5, 0.04]} /><meshStandardMaterial color={chairColor} roughness={0.6} /></mesh>
        {[[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]].map(([cx, cz], i) => (
          <mesh key={i} position={[cx, 0.21, cz]}><cylinderGeometry args={[0.015, 0.015, 0.42, 8]} /><meshStandardMaterial color="#3A5A40" /></mesh>
        ))}
      </group>
      {/* Side chair */}
      <group position={[1.9, 0, 1.5]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0.44, 0]} castShadow><boxGeometry args={[0.42, 0.04, 0.42]} /><meshStandardMaterial color={chairColor} roughness={0.6} /></mesh>
        <mesh position={[0, 0.72, -0.19]} castShadow><boxGeometry args={[0.42, 0.5, 0.04]} /><meshStandardMaterial color={chairColor} roughness={0.6} /></mesh>
        {[[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]].map(([cx, cz], i) => (
          <mesh key={i} position={[cx, 0.21, cz]}><cylinderGeometry args={[0.015, 0.015, 0.42, 8]} /><meshStandardMaterial color="#3A5A40" /></mesh>
        ))}
      </group>

      {/* Mugs on table */}
      <mesh position={[0.2, 0.8, 1.3]} castShadow>
        <cylinderGeometry args={[0.04, 0.034, 0.1, 12]} />
        <meshStandardMaterial color="#C04040" roughness={0.4} />
      </mesh>
      <mesh position={[0.8, 0.8, 1.65]} castShadow>
        <cylinderGeometry args={[0.04, 0.034, 0.1, 12]} />
        <meshStandardMaterial color="#4060C0" roughness={0.4} />
      </mesh>
      {/* Plate of biscuits */}
      <mesh position={[0.5, 0.77, 1.5]} castShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.012, 20]} />
        <meshStandardMaterial color="#E8E0D0" roughness={0.6} />
      </mesh>

      {/* ── Strip ceiling light ──────────────────────────────────────── */}
      {[-1.5, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 2.97, -0.5]}>
          <boxGeometry args={[2.5, 0.04, 0.12]} />
          <meshStandardMaterial color="#FFFFF0" emissive="#FFFCE0" emissiveIntensity={2.5} roughness={0.5} />
        </mesh>
      ))}

      {/* ── Noticeboard left wall ──────────────────────────────────────── */}
      <mesh position={[-4.46, 1.9, -2.0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.8, 0.55, 0.025]} />
        <meshStandardMaterial color="#D4B870" roughness={0.8} />
      </mesh>
      <mesh position={[-4.45, 1.9, -2.0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.86, 0.61, 0.01]} />
        <meshStandardMaterial color="#7A5030" roughness={0.5} />
      </mesh>
      {[[-0.2, 0.08], [0.1, 0.04], [-0.05, -0.12]].map(([ny, nz], i) => (
        <mesh key={i} position={[-4.44, 1.9 + nz, -2.0 + ny]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.15, 0.1, 0.004]} />
          <meshStandardMaterial color={['#F0E860', '#F07070', '#70C8E8'][i]} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}
