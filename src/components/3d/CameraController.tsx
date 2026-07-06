import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  target: [number, number, number] | null;
  playerPosition?: THREE.Vector3 | null;
  offset?: [number, number, number];
  defaultPosition?: [number, number, number];
  onArrived?: () => void;
  /** [minX, maxX, minZ, maxZ, minY, maxY] — keeps the free-roam orbit camera
   *  physically inside the room, so it can never end up outside the walls
   *  looking back through them at the void. */
  roomBounds?: [number, number, number, number, number, number];
}

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// First-person look limits
const FPS_PITCH_MIN = -Math.PI / 2.5; // look up ~72°
const FPS_PITCH_MAX = Math.PI / 2.5;  // look down ~72°
const DIST_MIN = 2.4;
const DIST_MAX = 8;
const ORBIT_SPEED = 0.005;
const FPS_EYE_HEIGHT = 1.05;

// Inspect dolly limits (multiplier on the base inspect offset)
const INSPECT_ZOOM_MIN = 0.45;
const INSPECT_ZOOM_MAX = 1.9;

export function CameraController({
  target,
  playerPosition = null,
  offset = [0, 0.15, 0.6],
  defaultPosition = [0, 3, 6],
  onArrived,
  roomBounds,
}: CameraControllerProps) {
  const { camera, gl } = useThree();
  const arrivedRef = useRef(false);
  const timeRef = useRef(0);

  // Orbit state — yaw/pitch/distance around the player
  const yaw = useRef(0);
  const pitch = useRef(0); // 0 = level, positive = look down
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
        FPS_PITCH_MIN,
        FPS_PITCH_MAX
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
      // --- First-person: camera sits at eye height, drag to look ---
      desiredPos.current.set(
        playerPosition.x,
        playerPosition.y + FPS_EYE_HEIGHT,
        playerPosition.z,
      );
      // Snap immediately while dragging so view tracks the mouse 1:1;
      // lerp for positional follow when walking to reduce judder
      camera.position.lerp(desiredPos.current, dragging.current ? 1 : 0.2);

      // Apply look rotation in YXZ order (standard FPS: pan then tilt)
      camera.rotation.order = 'YXZ';
      camera.rotation.y = yaw.current;
      camera.rotation.x = pitch.current;
      camera.rotation.z = 0;
    } else {
      camera.position.lerp(
        desiredPos.current.set(defaultPosition[0], defaultPosition[1], defaultPosition[2]),
        0.04
      );
    }
  });

  return null;
}
