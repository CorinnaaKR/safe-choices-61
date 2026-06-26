import { Suspense, useRef, useCallback, useState, useEffect } from 'react';
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

// [minX, maxX, minZ, maxZ, minY, maxY] — kept a little inside each room's
// actual wall/ceiling positions so the orbit camera never ends up outside
// the room looking back at the invisible backside of a wall.
const ROOM_BOUNDS: Record<SceneType, [number, number, number, number, number, number]> = {
  classroom:  [-5.6, 5.6, -4.6, 4.6, 0.3, 3.6],
  office:     [-3.6, 3.6, -2.6, 2.6, 0.3, 3.6],
  home:       [-4.1, 4.1, -3.6, 3.6, 0.3, 2.6],
  playground: [-9.5, 9.5, -7.5, 7.5, 0.3, 6],
};

interface SceneRendererProps {
  sceneType: SceneType;
  /** Which scenario is active — gates scenario-specific NPCs/props in shared environments (e.g. Lazlo's NPC only appears in his own story, even though Jamie's Story also uses the 'home' environment). */
  scenarioId?: string;
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
  scenarioId,
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
  const [walkTarget, setWalkTarget] = useState<THREE.Vector3 | null>(null);
  const pendingEvidenceRef = useRef<Evidence | null>(null);

  // R3F's Canvas sizes itself via a ResizeObserver on its container. If the
  // container has no measurable size at the exact moment Canvas mounts (e.g.
  // while a parent is still mid framer-motion fade-in), that first observation
  // is missed and the canvas is stuck at the browser's default 300x150 buffer
  // — the whole scene renders into a tiny corner while CSS stretches the
  // empty backdrop colour to fill the screen, looking like a blank void.
  // Firing a resize event after mount forces R3F to recompute against the
  // now-settled layout.
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event('resize'));
    const raf1 = requestAnimationFrame(() => requestAnimationFrame(fire));
    const timeouts = [100, 400, 1100].map((ms) => setTimeout(fire, ms));
    return () => {
      cancelAnimationFrame(raf1);
      timeouts.forEach(clearTimeout);
    };
  }, [sceneType]);

  const handlePlayerMove = useCallback((pos: THREE.Vector3) => {
    playerPosRef.current.copy(pos);
  }, []);

  // When evidence is clicked, walk toward it first, then open inspect panel
  const handleFocusEvidence = useCallback((evidence: Evidence) => {
    const pos = evidencePositions.get(evidence.id);
    if (pos) {
      pendingEvidenceRef.current = evidence;
      setWalkTarget(new THREE.Vector3(pos[0], 0, pos[2]));
    } else {
      onFocusEvidence(evidence);
    }
  }, [evidencePositions, onFocusEvidence]);

  const handlePlayerArrived = useCallback(() => {
    setWalkTarget(null);
    if (pendingEvidenceRef.current) {
      onFocusEvidence(pendingEvidenceRef.current);
      pendingEvidenceRef.current = null;
    }
  }, [onFocusEvidence]);

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
            roomBounds={ROOM_BOUNDS[sceneType]}
          />

          <PlayerCharacter
            onPositionChange={handlePlayerMove}
            sceneType={sceneType}
            obstacles={sceneType === 'home' ? HOME_OBSTACLES : undefined}
            moveTarget={walkTarget}
            onArrived={handlePlayerArrived}
          />

          {sceneType === 'classroom' && (
            <ClassroomScene
              evidence={evidence}
              collectedIds={collectedIds}
              focusedEvidenceId={focusedEvidenceId}
              onCollectEvidence={onCollectEvidence}
              onFocusEvidence={handleFocusEvidence}
            />
          )}
          {sceneType === 'playground' && (
            <PlaygroundScene
              evidence={evidence}
              collectedIds={collectedIds}
              focusedEvidenceId={focusedEvidenceId}
              onCollectEvidence={onCollectEvidence}
              onFocusEvidence={handleFocusEvidence}
            />
          )}
          {sceneType === 'office' && (
            <OfficeScene
              evidence={evidence}
              collectedIds={collectedIds}
              focusedEvidenceId={focusedEvidenceId}
              onCollectEvidence={onCollectEvidence}
              onFocusEvidence={handleFocusEvidence}
            />
          )}
          {sceneType === 'home' && (
            <HomeScene
              showLazlo={scenarioId === 'lazlo-case'}
              evidence={evidence}
              collectedIds={collectedIds}
              focusedEvidenceId={focusedEvidenceId}
              onCollectEvidence={onCollectEvidence}
              onFocusEvidence={handleFocusEvidence}
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
