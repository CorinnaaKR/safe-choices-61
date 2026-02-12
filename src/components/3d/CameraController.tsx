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
  offset = [0, 0.8, 2],
  followOffset = [0, 3, 4],
  defaultPosition = [0, 3, 6],
  defaultTarget = [0, 0.5, 0],
  onArrived,
}: CameraControllerProps) {
  const { camera } = useThree();
  const arrivedRef = useRef(false);
  const lerpFactor = 0.04;
  const followLerp = 0.06;
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

  useFrame(() => {
    // If inspecting evidence, zoom to it
    if (target) {
      camera.position.lerp(targetPos.current, lerpFactor);
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      currentLookAt.multiplyScalar(5).add(camera.position);
      currentLookAt.lerp(lookAtPos.current, lerpFactor);
      camera.lookAt(currentLookAt);

      if (!arrivedRef.current) {
        const dist = camera.position.distanceTo(targetPos.current);
        if (dist < 0.1) {
          arrivedRef.current = true;
          onArrived?.();
        }
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
