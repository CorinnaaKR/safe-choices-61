import { useRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Pose = 'idle' | 'sitting' | 'withdrawn' | 'hunched';

// Handles both ReadyPlayerMe and Mixamo bone naming conventions
const BONE_MAP: Record<string, string[]> = {
  head:      ['Head',         'mixamorigHead'],
  neck:      ['Neck',         'mixamorigNeck'],
  spine:     ['Spine',        'mixamorigSpine'],
  chest:     ['Chest',        'Spine1', 'mixamorigSpine1'],
  hips:      ['Hips',         'mixamorigHips'],
  lUpperLeg: ['LeftUpperLeg', 'mixamorigLeftUpLeg'],
  rUpperLeg: ['RightUpperLeg','mixamorigRightUpLeg'],
  lLowerLeg: ['LeftLeg',      'mixamorigLeftLeg'],
  rLowerLeg: ['RightLeg',     'mixamorigRightLeg'],
  lFoot:     ['LeftFoot',     'mixamorigLeftFoot'],
  rFoot:     ['RightFoot',    'mixamorigRightFoot'],
  lUpperArm: ['LeftUpperArm', 'mixamorigLeftArm'],
  rUpperArm: ['RightUpperArm','mixamorigRightArm'],
  lLowerArm: ['LeftLowerArm', 'mixamorigLeftForeArm'],
  rLowerArm: ['RightLowerArm','mixamorigRightForeArm'],
};

function getBone(skeleton: THREE.Skeleton, key: string): THREE.Bone | null {
  for (const name of BONE_MAP[key] ?? []) {
    const b = skeleton.bones.find(b => b.name === name);
    if (b) return b;
  }
  return null;
}

function applyPose(skeleton: THREE.Skeleton, pose: Pose) {
  if (pose === 'sitting' || pose === 'withdrawn' || pose === 'hunched') {
    // Thighs rotate horizontal
    const lUL = getBone(skeleton, 'lUpperLeg');
    const rUL = getBone(skeleton, 'rUpperLeg');
    // Lower legs hang straight down
    const lLL = getBone(skeleton, 'lLowerLeg');
    const rLL = getBone(skeleton, 'rLowerLeg');
    // Feet level
    const lF  = getBone(skeleton, 'lFoot');
    const rF  = getBone(skeleton, 'rFoot');

    if (lUL) lUL.rotation.x = -Math.PI / 2 + 0.05;
    if (rUL) rUL.rotation.x = -Math.PI / 2 + 0.05;
    if (lLL) lLL.rotation.x =  Math.PI / 2 - 0.1;
    if (rLL) rLL.rotation.x =  Math.PI / 2 - 0.1;
    if (lF)  lF.rotation.x  = -0.1;
    if (rF)  rF.rotation.x  = -0.1;
  }

  if (pose === 'withdrawn' || pose === 'hunched') {
    const bowAmount = pose === 'hunched' ? 0.55 : 0.28;
    const spineAmount = pose === 'hunched' ? 0.22 : 0.12;

    const head  = getBone(skeleton, 'head');
    const spine = getBone(skeleton, 'spine');
    const chest = getBone(skeleton, 'chest');
    const lArm  = getBone(skeleton, 'lUpperArm');
    const rArm  = getBone(skeleton, 'rUpperArm');
    const lFore = getBone(skeleton, 'lLowerArm');
    const rFore = getBone(skeleton, 'rLowerArm');

    if (head)  { head.rotation.x  = -bowAmount; }
    if (spine) { spine.rotation.x =  spineAmount; }
    if (chest) { chest.rotation.x =  spineAmount * 0.6; }

    // Right arm crosses body toward left sleeve
    if (rArm) { rArm.rotation.x = 0.6; rArm.rotation.z = 0.7; rArm.rotation.y = -0.3; }
    if (rFore){ rFore.rotation.x = 0.5; rFore.rotation.y = -0.4; }

    // Left arm pulled in, being gripped at the sleeve
    if (lArm) { lArm.rotation.x = 0.4; lArm.rotation.z = -0.5; }
    if (lFore){ lFore.rotation.x = 0.3; }
  }

  if (pose === 'idle') {
    // Slight natural arm hang (A-pose correction if needed)
    const lArm = getBone(skeleton, 'lUpperArm');
    const rArm = getBone(skeleton, 'rUpperArm');
    if (lArm) lArm.rotation.z = -0.15;
    if (rArm) rArm.rotation.z =  0.15;
  }
}

export interface GLBCharacterProps {
  url: string;
  pose?: Pose;
  /** World-unit height target — model is scaled to match */
  targetHeight?: number;
  pullsSleeves?: boolean;
  fidget?: number;
}

export function GLBCharacter({
  url,
  pose = 'idle',
  targetHeight = 1.15,
  pullsSleeves = false,
  fidget = 0.3,
}: GLBCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);

  // Clone so multiple instances don't share state
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    // Re-bind SkinnedMesh skeletons after clone
    const sourceMeshes: THREE.SkinnedMesh[] = [];
    const clonedMeshes: THREE.SkinnedMesh[] = [];
    scene.traverse(o => { if ((o as THREE.SkinnedMesh).isSkinnedMesh) sourceMeshes.push(o as THREE.SkinnedMesh); });
    c.traverse(o => { if ((o as THREE.SkinnedMesh).isSkinnedMesh) clonedMeshes.push(o as THREE.SkinnedMesh); });
    clonedMeshes.forEach((mesh, i) => {
      if (sourceMeshes[i]) mesh.bind(sourceMeshes[i].skeleton, mesh.bindMatrix);
    });
    return c;
  }, [scene]);

  // Auto-scale to targetHeight
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const naturalHeight = box.max.y - box.min.y;
    if (naturalHeight > 0) {
      const s = targetHeight / naturalHeight;
      cloned.scale.setScalar(s);
      // Shift so feet sit at y=0
      cloned.position.y = -box.min.y * s;
    }
  }, [cloned, targetHeight]);

  // Find the first skeleton
  const skeleton = useMemo(() => {
    let skel: THREE.Skeleton | null = null;
    cloned.traverse(o => {
      if (!skel && (o as THREE.SkinnedMesh).isSkinnedMesh) {
        skel = (o as THREE.SkinnedMesh).skeleton;
      }
    });
    return skel;
  }, [cloned]);

  // Apply idle animation if bundled
  const { actions } = useAnimations(animations, groupRef);
  useEffect(() => {
    const names = Object.keys(actions);
    const clip = actions['Idle'] ?? actions['idle'] ?? actions['Armature|mixamo.com|Layer0'] ?? (names.length ? actions[names[0]] : null);
    if (clip) clip.reset().fadeIn(0.4).play();
  }, [actions]);

  // Apply bone pose (done once after mount, then micro-movement via useFrame)
  useEffect(() => {
    if (skeleton) applyPose(skeleton, pose);
  }, [skeleton, pose]);

  // Subtle idle breathing + sleeve pulling
  useFrame((state) => {
    if (!skeleton) return;
    const t = state.clock.elapsedTime;

    const head = getBone(skeleton, 'head');
    if (head) {
      head.rotation.y += Math.sin(t * 0.45) * 0.006 * fidget;
    }

    const spine = getBone(skeleton, 'spine');
    if (spine && pose === 'idle') {
      // Gentle breathing
      spine.rotation.x = Math.sin(t * 0.9) * 0.008 * fidget;
    }

    if (pullsSleeves) {
      const rArm = getBone(skeleton, 'rUpperArm');
      if (rArm) {
        const cycle = (t * 0.4) % (Math.PI * 2);
        const pull = Math.max(0, Math.sin(cycle)) * 0.18;
        rArm.rotation.x = 0.6 + pull;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={cloned} />
    </group>
  );
}
