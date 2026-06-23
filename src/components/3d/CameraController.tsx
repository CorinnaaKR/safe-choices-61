import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  target: [number, number, number] | null;
  playerPosition?: THREE.Vector3 | null;
  offset?: [number, number, number];
  defaultPosition?: [number, number, number];
  onArrived?: () => void;
}

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Orbit limits (follow mode)
const PITCH_MIN = 0.12;
const PITCH_MAX = 1.25;
const DIST_MIN = 2.4;
const DIST_MAX = 8;
const ORBIT_SPEED = 0.005;

// Inspect dolly limits (multiplier on the base inspect offset)
const INSPECT_ZOOM_MIN = 0.45;
const INSPECT_ZOOM_MAX = 1.9;

export function CameraController({
  target,
  playerPosition = null,
  offset = [0, 0.15, 0.6],
  defaultPosition = [0, 3, 6],
  onArrived,
}: CameraControllerProps) {
  const { camera, gl } = useThree();
  const arrivedRef = useRef(false);
  const timeRef = useRef(0);

  // Orbit state — yaw/pitch/distance around the player
  const yaw = useRef(0);
  const pitch = useRef(0.64);
  const dist = useRef(5);
  const dragging = useRef(false);

  // Inspect state — scroll-wheel dolly toward/away from the focus target
  const inspectZoom = useRef(1);
  const targetRef = useRef(target);
  targetRef.current = target;

  // Normalised mouse position drives the "held object" drift while inspecting
  const mouse = useRef({ x: 0, y: 0 });

  // Scratch vectors — reused every frame to avoid allocation
  const desiredPos = useRef(new THREE.Vector3(...defaultPosition));
  const lookTarget = useRef(new THREE.Vector3());
  const scratchA = useRef(new THREE.Vector3());
  const scratchB = useRef(new THREE.Vector3());
  const scratchC = useRef(new THREE.Vector3());

  useEffect(() => {
    arrivedRef.current = false;
    inspectZoom.current = 1;
  }, [target]);

  // Pointer drag = orbit; wheel = inspect dolly / orbit distance
  useEffect(() => {
    const el = gl.domElement;
    let pointerDown = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      pointerDown = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!pointerDown || targetRef.current) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      dragging.current = true;
      yaw.current -= dx * ORBIT_SPEED;
      pitch.current = THREE.MathUtils.clamp(
        pitch.current + dy * ORBIT_SPEED,
        PITCH_MIN,
        PITCH_MAX
      );
    };
    const onPointerUp = () => {
      pointerDown = false;
      dragging.current = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = 1 + e.deltaY * 0.0012;
      if (targetRef.current) {
        inspectZoom.current = THREE.MathUtils.clamp(
          inspectZoom.current * factor,
          INSPECT_ZOOM_MIN,
          INSPECT_ZOOM_MAX
        );
      } else {
        dist.current = THREE.MathUtils.clamp(dist.current * factor, DIST_MIN, DIST_MAX);
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('wheel', onWheel);
    };
  }, [gl]);

  useFrame((_, delta) => {
    timeRef.current += delta;

    if (target) {
      // --- Inspecting: dolly toward the evidence, [SCROLL] to zoom ---
      const focus = scratchA.current.set(target[0], target[1], target[2]);
      const off = scratchB.current.set(offset[0], offset[1], offset[2]);
      const baseLen = off.length();
      off.normalize().multiplyScalar(baseLen * inspectZoom.current);
      desiredPos.current.copy(focus).add(off);

      // Mouse-follow drift so the object feels "held"
      if (!prefersReducedMotion && arrivedRef.current) {
        const drift = scratchC.current
          .set(mouse.current.x * 0.06, -mouse.current.y * 0.04, 0)
          .applyQuaternion(camera.quaternion);
        desiredPos.current.add(drift);
      }

      const distTo = camera.position.distanceTo(desiredPos.current);
      // Slow cinematic approach, then responsive tracking once arrived
      const t = arrivedRef.current
        ? 0.12
        : Math.max(0.015, Math.min(0.04, 1 / (distTo * 12 + 5)));
      camera.position.lerp(desiredPos.current, t);

      const currentLookAt = lookTarget.current;
      camera.getWorldDirection(currentLookAt);
      currentLookAt.multiplyScalar(5).add(camera.position);
      currentLookAt.lerp(focus, Math.max(t, 0.06));
      camera.lookAt(currentLookAt);

      if (!arrivedRef.current && distTo < 0.15) {
        arrivedRef.current = true;
        onArrived?.();
      }

      // Subtle breathing sway when arrived
      if (arrivedRef.current && !prefersReducedMotion) {
        camera.position.x += Math.sin(timeRef.current * 1.2) * 0.003;
        camera.position.y += Math.sin(timeRef.current * 2) * 0.002;
      }
    } else if (playerPosition) {
      // --- Free roam: orbit around the player ([DRAG] to look) ---
      const cosP = Math.cos(pitch.current);
      desiredPos.current.set(
        playerPosition.x + Math.sin(yaw.current) * cosP * dist.current,
        playerPosition.y + Math.sin(pitch.current) * dist.current,
        playerPosition.z + Math.cos(yaw.current) * cosP * dist.current
      );
      if (dragging.current) {
        // Snap directly — no lerp while the player is actively dragging
        camera.position.copy(desiredPos.current);
      } else {
        camera.position.lerp(desiredPos.current, 0.1);
      }

      lookTarget.current.set(
        playerPosition.x,
        playerPosition.y + 0.9,
        playerPosition.z
      );
      if (dragging.current) {
        camera.lookAt(lookTarget.current);
      } else {
        const currentLookAt = scratchA.current;
        camera.getWorldDirection(currentLookAt);
        currentLookAt.multiplyScalar(5).add(camera.position);
        currentLookAt.lerp(lookTarget.current, 0.12);
        camera.lookAt(currentLookAt);
      }
    } else {
      camera.position.lerp(
        desiredPos.current.set(defaultPosition[0], defaultPosition[1], defaultPosition[2]),
        0.04
      );
    }
  });

  return null;
}
