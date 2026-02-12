import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface PlayerCharacterProps {
  onPositionChange: (position: THREE.Vector3) => void;
  boundaryRadius?: number;
}

const SPEED = 3;
const ROTATION_SPEED = 3;

export function PlayerCharacter({ onPositionChange, boundaryRadius = 8 }: PlayerCharacterProps) {
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
      
      const newX = groupRef.current.position.x + dx;
      const newZ = groupRef.current.position.z + dz;
      
      // Boundary clamping
      const dist = Math.sqrt(newX * newX + newZ * newZ);
      if (dist < boundaryRadius) {
        groupRef.current.position.x = newX;
        groupRef.current.position.z = newZ;
      }

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
      {/* Body */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.35, 8, 16]} />
        <meshStandardMaterial color="#4a90d9" roughness={0.6} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#f5c6a0" roughness={0.5} />
      </mesh>

      {/* Eyes direction indicator */}
      <mesh position={[0.05, 1.08, 0.14]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#333" />
      </mesh>
      <mesh position={[-0.05, 1.08, 0.14]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#333" />
      </mesh>

      {/* Shadow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.25, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
