import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  target: [number, number, number] | null;
  offset?: [number, number, number];
  defaultPosition?: [number, number, number];
  defaultTarget?: [number, number, number];
  onArrived?: () => void;
}

export function CameraController({
  target,
  offset = [0, 0.8, 2],
  defaultPosition = [0, 3, 6],
  defaultTarget = [0, 0.5, 0],
  onArrived,
}: CameraControllerProps) {
  const { camera } = useThree();
  const arrivedRef = useRef(false);
  const lerpFactor = 0.04;
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
    } else {
      targetPos.current.set(...defaultPosition);
      lookAtPos.current.set(...defaultTarget);
    }
  }, [target, offset, defaultPosition, defaultTarget]);

  useFrame(() => {
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
  });

  return null;
}
