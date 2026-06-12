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

const UP = new THREE.Vector3(0, 1, 0);

export function PlayerCharacter({ onPositionChange, sceneType = 'classroom' }: PlayerCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const keys = useRef<Record<string, boolean>>({});
  const rotationY = useRef(0);
  const [bobPhase, setBobPhase] = useState(0);
  const { camera } = useThree();
  // Scratch vectors — reused every frame to avoid allocation
  const camDir = useRef(new THREE.Vector3());
  const camRight = useRef(new THREE.Vector3());
  const moveVec = useRef(new THREE.Vector3());

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

    // Keep the player inside the room even before first input (spawn may
    // sit outside tighter scenes like the office)
    const [bMinX, bMaxX, bMinZ, bMaxZ] = SCENE_BOUNDS[sceneType];
    groupRef.current.position.x = THREE.MathUtils.clamp(
      groupRef.current.position.x, bMinX + WALL_MARGIN, bMaxX - WALL_MARGIN);
    groupRef.current.position.z = THREE.MathUtils.clamp(
      groupRef.current.position.z, bMinZ + WALL_MARGIN, bMaxZ - WALL_MARGIN);

    const k = keys.current;
    const forward = (k['w'] || k['arrowup'] ? 1 : 0) - (k['s'] || k['arrowdown'] ? 1 : 0);
    const strafe = (k['d'] || k['arrowright'] ? 1 : 0) - (k['a'] || k['arrowleft'] ? 1 : 0);

    const isMoving = forward !== 0 || strafe !== 0;

    if (isMoving) {
      // Movement is relative to the camera: W walks away from the camera,
      // A/D strafe across the view, whatever the current orbit angle.
      camera.getWorldDirection(camDir.current);
      camDir.current.y = 0;
      if (camDir.current.lengthSq() < 1e-6) camDir.current.set(0, 0, -1);
      camDir.current.normalize();
      camRight.current.crossVectors(camDir.current, UP);

      moveVec.current
        .copy(camDir.current)
        .multiplyScalar(forward)
        .addScaledVector(camRight.current, strafe)
        .normalize();

      // Face the direction of travel (shortest-path turn)
      const targetRotation = Math.atan2(moveVec.current.x, moveVec.current.z);
      let diff = targetRotation - rotationY.current;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      rotationY.current += diff * Math.min(1, ROTATION_SPEED * delta * 3);
      groupRef.current.rotation.y = rotationY.current;

      const [minX, maxX, minZ, maxZ] = SCENE_BOUNDS[sceneType];
      groupRef.current.position.x = THREE.MathUtils.clamp(
        groupRef.current.position.x + moveVec.current.x * SPEED * delta,
        minX + WALL_MARGIN,
        maxX - WALL_MARGIN
      );
      groupRef.current.position.z = THREE.MathUtils.clamp(
        groupRef.current.position.z + moveVec.current.z * SPEED * delta,
        minZ + WALL_MARGIN,
        maxZ - WALL_MARGIN
      );
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
