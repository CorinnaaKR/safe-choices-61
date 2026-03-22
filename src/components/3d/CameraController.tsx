import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  target: [number, number, number] | null;
  playerPosition?: THREE.Vector3 | null;
  offset?: [number, number, number];
  followOffset?: [number, number, number];
  defaultPosition?: [number, number, number];
  defaultTarget?: [number, number, number];
  onArrived?: () => void;
}

export function CameraController({
  target,
  playerPosition = null,
  offset = [0, 0.15, 0.6],
  followOffset = [0, 3, 4],
  defaultPosition = [0, 3, 6],
  defaultTarget = [0, 0.5, 0],
  onArrived,
}: CameraControllerProps) {
  const { camera } = useThree();
  const arrivedRef = useRef(false);
  const inspectLerp = 0.015; // Slow cinematic zoom for evidence
  const followLerp = 0.06;
  const defaultLerp = 0.04;
  const timeRef = useRef(0);
  const targetPos = useRef(new THREE.Vector3(...defaultPosition));
  const lookAtPos = useRef(new THREE.Vector3(...defaultTarget));

  useEffect(() => {
    arrivedRef.current = false;
    if (target) {
      targetPos.current.set(
        target[0] + offset[0],
        target[1] + offset[1],
        target[2] + offset[2]
      );
      lookAtPos.current.set(target[0], target[1], target[2]);
    }
  }, [target, offset]);

  useFrame((_, delta) => {
    timeRef.current += delta;

    // If inspecting evidence — slow cinematic zoom
    if (target) {
      // Ease-in: start very slow, gradually speed up
      const dist = camera.position.distanceTo(targetPos.current);
      const t = Math.max(inspectLerp, Math.min(0.04, 1 / (dist * 12 + 5)));
      camera.position.lerp(targetPos.current, t);

      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      currentLookAt.multiplyScalar(5).add(camera.position);
      currentLookAt.lerp(lookAtPos.current, t);
      camera.lookAt(currentLookAt);

      if (!arrivedRef.current) {
        if (dist < 0.15) {
          arrivedRef.current = true;
          onArrived?.();
        }
      }

      // Subtle breathing sway when arrived
      if (arrivedRef.current) {
        const sway = Math.sin(timeRef.current * 1.2) * 0.003;
        const bob = Math.sin(timeRef.current * 2) * 0.002;
        camera.position.x += sway;
        camera.position.y += bob;
      }
    } else if (playerPosition) {
      // Follow the player character
      const desiredPos = new THREE.Vector3(
        playerPosition.x + followOffset[0],
        playerPosition.y + followOffset[1],
        playerPosition.z + followOffset[2]
      );
      camera.position.lerp(desiredPos, followLerp);

      const lookTarget = new THREE.Vector3(
        playerPosition.x,
        playerPosition.y + 0.8,
        playerPosition.z
      );
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      currentLookAt.multiplyScalar(5).add(camera.position);
      currentLookAt.lerp(lookTarget, followLerp);
      camera.lookAt(currentLookAt);
    } else {
      camera.position.lerp(targetPos.current, lerpFactor);
    }
  });

  return null;
}
