import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneType } from './SceneRenderer';

// Room boundaries per scene type: [minX, maxX, minZ, maxZ]
const SCENE_BOUNDS: Record<SceneType, [number, number, number, number]> = {
  classroom: [-5.5, 5.5, -4.5, 4.5],
  playground: [-7, 7, -5, 5],
  office: [-3.5, 3.5, -2.5, 2.5],
};

interface PlayerCharacterProps {
  onPositionChange: (position: THREE.Vector3) => void;
  sceneType?: SceneType;
}

const SPEED = 3;
const ROTATION_SPEED = 3;
const WALL_MARGIN = 0.3; // character radius buffer

export function PlayerCharacter({ onPositionChange, sceneType = 'classroom' }: PlayerCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const keys = useRef<Record<string, boolean>>({});
  const rotationY = useRef(0);
  const [bobPhase, setBobPhase] = useState(0);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const onUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const k = keys.current;
    const forward = (k['w'] || k['arrowup'] ? 1 : 0) - (k['s'] || k['arrowdown'] ? 1 : 0);
    const strafe = (k['a'] || k['arrowleft'] ? 1 : 0) - (k['d'] || k['arrowright'] ? 1 : 0);

    const isMoving = forward !== 0 || strafe !== 0;

    if (isMoving) {
      // Calculate movement direction relative to current rotation
      const moveAngle = Math.atan2(strafe, forward);
      const targetRotation = moveAngle;
      
      // Smoothly rotate the character to face movement direction
      rotationY.current = THREE.MathUtils.lerp(rotationY.current, targetRotation, ROTATION_SPEED * delta * 3);
      
      const dx = Math.sin(rotationY.current) * SPEED * delta;
      const dz = Math.cos(rotationY.current) * SPEED * delta;
      
      const [minX, maxX, minZ, maxZ] = SCENE_BOUNDS[sceneType];
      const newX = THREE.MathUtils.clamp(
        groupRef.current.position.x + dx,
        minX + WALL_MARGIN,
        maxX - WALL_MARGIN
      );
      const newZ = THREE.MathUtils.clamp(
        groupRef.current.position.z + dz,
        minZ + WALL_MARGIN,
        maxZ - WALL_MARGIN
      );
      groupRef.current.position.x = newX;
      groupRef.current.position.z = newZ;

      groupRef.current.rotation.y = rotationY.current;
    }

    // Walking bob
    if (isMoving) {
      setBobPhase(prev => prev + delta * 10);
      groupRef.current.position.y = Math.abs(Math.sin(bobPhase)) * 0.06;
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 5 * delta);
    }

    onPositionChange(groupRef.current.position);
  });

  return (
    <group ref={groupRef} position={[0, 0, 3]}>
      {/* Body — torso */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.16, 0.35, 8, 16]} />
        <meshStandardMaterial color="#3A6B9F" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.08, 0]} castShadow>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshStandardMaterial color="#E8C4A0" roughness={0.6} metalness={0} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.18, -0.02]}>
        <sphereGeometry args={[0.152, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#3A2815" roughness={0.85} />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.045, 1.1, 0.13]}>
        <sphereGeometry args={[0.022, 10, 10]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.3} />
      </mesh>
      <mesh position={[-0.045, 1.1, 0.13]}>
        <sphereGeometry args={[0.022, 10, 10]} />
        <meshStandardMaterial color="#2A2A2A" roughness={0.3} />
      </mesh>

      {/* Arms */}
      <mesh position={[0.22, 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.04, 0.3, 8, 8]} />
        <meshStandardMaterial color="#3A6B9F" roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[-0.22, 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.04, 0.3, 8, 8]} />
        <meshStandardMaterial color="#3A6B9F" roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Hands */}
      <mesh position={[0.22, 0.35, 0]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#E8C4A0" roughness={0.6} />
      </mesh>
      <mesh position={[-0.22, 0.35, 0]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#E8C4A0" roughness={0.6} />
      </mesh>

      {/* Legs */}
      <mesh position={[0.07, 0.2, 0]} castShadow>
        <capsuleGeometry args={[0.05, 0.25, 8, 8]} />
        <meshStandardMaterial color="#2C2C3E" roughness={0.7} />
      </mesh>
      <mesh position={[-0.07, 0.2, 0]} castShadow>
        <capsuleGeometry args={[0.05, 0.25, 8, 8]} />
        <meshStandardMaterial color="#2C2C3E" roughness={0.7} />
      </mesh>

      {/* Shoes */}
      <mesh position={[0.07, 0.04, 0.02]} castShadow>
        <boxGeometry args={[0.065, 0.04, 0.12]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[-0.07, 0.04, 0.02]} castShadow>
        <boxGeometry args={[0.065, 0.04, 0.12]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Shadow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.22, 20]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}
