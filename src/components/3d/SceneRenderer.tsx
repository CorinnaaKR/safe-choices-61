import { Suspense, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, DepthOfField, Vignette, Outline, Selection, N8AO, Bloom } from '@react-three/postprocessing';
import { ClassroomScene } from './ClassroomScene';
import { PlaygroundScene } from './PlaygroundScene';
import { OfficeScene } from './OfficeScene';
import { HomeScene, HOME_OBSTACLES } from './HomeScene';
import { CameraController } from './CameraController';
import { PlayerCharacter } from './PlayerCharacter';
import { Evidence } from '@/types/simulation';
import * as THREE from 'three';

export type SceneType = 'classroom' | 'playground' | 'office' | 'home';

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
          toneMappingExposure: sceneType === 'playground' ? 1.2 : sceneType === 'home' ? 0.85 : 1.0,
        }}
        style={{ background: sceneType === 'playground' ? '#87CEEB' : sceneType === 'home' ? '#0D0B08' : '#211c19' }}
      >
        <Suspense fallback={null}>
          <Selection>

          <CameraController
            target={focusTarget}
            playerPosition={focusTarget ? null : playerPosRef.current}
            onArrived={() => {}}
          />

          <PlayerCharacter
            onPositionChange={handlePlayerMove}
            sceneType={sceneType}
            obstacles={sceneType === 'home' ? HOME_OBSTACLES : undefined}
          />

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
          {sceneType === 'home' && (
            <HomeScene
              evidence={evidence}
              collectedIds={collectedIds}
              focusedEvidenceId={focusedEvidenceId}
              onCollectEvidence={onCollectEvidence}
              onFocusEvidence={onFocusEvidence}
            />
          )}

          {/* Environment-based lighting for realistic reflections */}
          <Environment preset={sceneType === 'playground' ? 'park' : sceneType === 'home' ? 'night' : 'apartment'} />

          {/* Contact shadows for grounding objects */}
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.4}
            scale={sceneType === 'playground' ? 20 : 12}
            blur={2}
            far={4}
            frames={1}
          />

          {/* Always-on realism passes: ambient occlusion grounds objects in
              their corners, subtle bloom lifts emissives (screens, sky).
              Outline = basement-style edge highlight on hovered evidence.
              DoF + vignette join only while inspecting. */}
          <EffectComposer multisampling={0} autoClear={false}>
            <N8AO
              halfRes
              quality="performance"
              intensity={2}
              aoRadius={0.5}
              distanceFalloff={0.75}
            />
            <Outline
              blur
              edgeStrength={4}
              visibleEdgeColor={0xffffff}
              hiddenEdgeColor={0x555555}
            />
            <Bloom mipmapBlur intensity={0.25} luminanceThreshold={0.9} />
            {focusTarget != null && (
              <DepthOfField
                target={new THREE.Vector3(focusTarget[0], focusTarget[1], focusTarget[2])}
                focalLength={0.02}
                bokehScale={4}
                height={480}
              />
            )}
            {focusTarget != null && (
              <Vignette eskil={false} offset={0.2} darkness={0.55} />
            )}
          </EffectComposer>

          <fog attach="fog" args={[
            sceneType === 'playground' ? '#87CEEB' : sceneType === 'home' ? '#0D0B08' : '#211c19',
            sceneType === 'home' ? 8 : 12,
            sceneType === 'home' ? 18 : 30,
          ]} />
          </Selection>
        </Suspense>
      </Canvas>
    </div>
  );
}
