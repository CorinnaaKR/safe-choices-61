import { Suspense, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, SoftShadows } from '@react-three/drei';
import { EffectComposer, DepthOfField, Vignette, Outline, Selection } from '@react-three/postprocessing';
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
        camera={{ position: [0, 3, 6], fov: 50 }}
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: sceneType === 'playground' ? 1.2 : 0.9,
        }}
        style={{ background: sceneType === 'playground' ? '#87CEEB' : '#1a1a2e' }}
      >
        <Suspense fallback={null}>
          <Selection>
          <SoftShadows size={25} samples={16} focus={0.5} />

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

          {/* Environment-based lighting for realistic reflections */}
          <Environment preset={sceneType === 'playground' ? 'park' : 'apartment'} />

          {/* Contact shadows for grounding objects */}
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.4}
            scale={sceneType === 'playground' ? 20 : 12}
            blur={2}
            far={4}
          />

          {/* Outline pass on hovered/focused evidence (basement-style edge
              highlight); DoF + vignette only while inspecting */}
          {focusTarget ? (
            <EffectComposer multisampling={4} autoClear={false}>
              <Outline
                blur
                edgeStrength={4}
                visibleEdgeColor={0xffffff}
                hiddenEdgeColor={0x555555}
              />
              <DepthOfField
                target={new THREE.Vector3(focusTarget[0], focusTarget[1], focusTarget[2])}
                focalLength={0.02}
                bokehScale={4}
                height={480}
              />
              <Vignette eskil={false} offset={0.2} darkness={0.55} />
            </EffectComposer>
          ) : (
            <EffectComposer multisampling={4} autoClear={false}>
              <Outline
                blur
                edgeStrength={4}
                visibleEdgeColor={0xffffff}
                hiddenEdgeColor={0x555555}
              />
            </EffectComposer>
          )}

          <fog attach="fog" args={[sceneType === 'playground' ? '#87CEEB' : '#1a1a2e', 12, 30]} />
          </Selection>
        </Suspense>
      </Canvas>
    </div>
  );
}
