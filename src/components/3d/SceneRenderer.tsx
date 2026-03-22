import { Suspense, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, SoftShadows } from '@react-three/drei';
import { ClassroomScene } from './ClassroomScene';
import { PlaygroundScene } from './PlaygroundScene';
import { OfficeScene } from './OfficeScene';
import { CameraController } from './CameraController';
import { PlayerCharacter } from './PlayerCharacter';
import { Evidence } from '@/types/simulation';
import * as THREE from 'three';

export type SceneType = 'classroom' | 'playground' | 'office';

interface SceneRendererProps {
  sceneType: SceneType;
  evidence: Evidence[];
  collectedIds: string[];
  focusedEvidenceId: string | null;
  evidencePositions: Map<string, [number, number, number]>;
  onCollectEvidence: (evidence: Evidence) => void;
  onFocusEvidence: (evidence: Evidence) => void;
  onCameraReset: () => void;
}

export function getSceneType(sceneId: string): SceneType {
  if (sceneId.includes('scene-1') || sceneId.includes('scene-3a') || sceneId.includes('scene-3b')) {
    return 'classroom';
  }
  if (sceneId.includes('scene-2')) {
    return 'playground';
  }
  return 'office';
}

export function SceneRenderer({
  sceneType,
  evidence,
  collectedIds,
  focusedEvidenceId,
  evidencePositions,
  onCollectEvidence,
  onFocusEvidence,
  onCameraReset,
}: SceneRendererProps) {
  const focusTarget = focusedEvidenceId ? evidencePositions.get(focusedEvidenceId) ?? null : null;
  const playerPosRef = useRef(new THREE.Vector3(0, 0, 3));

  const handlePlayerMove = useCallback((pos: THREE.Vector3) => {
    playerPosRef.current.copy(pos);
  }, []);

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 3, 6], fov: 55 }}
        style={{ background: sceneType === 'playground' ? '#87CEEB' : '#1a1a2e' }}
      >
        <Suspense fallback={null}>
          <CameraController
            target={focusTarget}
            playerPosition={focusTarget ? null : playerPosRef.current}
            onArrived={() => {}}
          />

          <PlayerCharacter onPositionChange={handlePlayerMove} sceneType={sceneType} />

          {sceneType === 'classroom' && (
            <ClassroomScene
              evidence={evidence}
              collectedIds={collectedIds}
              focusedEvidenceId={focusedEvidenceId}
              onCollectEvidence={onCollectEvidence}
              onFocusEvidence={onFocusEvidence}
            />
          )}
          {sceneType === 'playground' && (
            <PlaygroundScene
              evidence={evidence}
              collectedIds={collectedIds}
              focusedEvidenceId={focusedEvidenceId}
              onCollectEvidence={onCollectEvidence}
              onFocusEvidence={onFocusEvidence}
            />
          )}
          {sceneType === 'office' && (
            <OfficeScene
              evidence={evidence}
              collectedIds={collectedIds}
              focusedEvidenceId={focusedEvidenceId}
              onCollectEvidence={onCollectEvidence}
              onFocusEvidence={onFocusEvidence}
            />
          )}

          <fog attach="fog" args={[sceneType === 'playground' ? '#87CEEB' : '#1a1a2e', 10, 25]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
