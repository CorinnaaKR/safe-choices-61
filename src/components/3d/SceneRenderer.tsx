import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ClassroomScene } from './ClassroomScene';
import { PlaygroundScene } from './PlaygroundScene';
import { OfficeScene } from './OfficeScene';
import { Evidence } from '@/types/simulation';

export type SceneType = 'classroom' | 'playground' | 'office';

interface SceneRendererProps {
  sceneType: SceneType;
  evidence: Evidence[];
  collectedIds: string[];
  onCollectEvidence: (evidence: Evidence) => void;
}

// Map scene IDs to 3D environments
export function getSceneType(sceneId: string): SceneType {
  if (sceneId.includes('scene-1') || sceneId.includes('scene-3a') || sceneId.includes('scene-3b')) {
    return 'classroom';
  }
  if (sceneId.includes('scene-2')) {
    return 'playground';
  }
  return 'office';
}

export function SceneRenderer({ sceneType, evidence, collectedIds, onCollectEvidence }: SceneRendererProps) {
  return (
    <div className="w-full h-[50vh] md:h-[55vh] rounded-2xl overflow-hidden border-2 border-border shadow-xl relative">
      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 z-10 bg-card/85 backdrop-blur px-3 py-2 rounded-lg border border-border shadow-sm">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Drag</span> to look around · <span className="font-semibold text-foreground">Scroll</span> to zoom · <span className="font-semibold text-decision-highlight">Click glowing objects</span> to investigate
        </p>
      </div>

      <Canvas
        camera={{ position: [0, 3, 6], fov: 55 }}
        style={{ background: sceneType === 'playground' ? '#87CEEB' : '#2a2a3a' }}
      >
        <Suspense fallback={null}>
          {sceneType === 'classroom' && (
            <ClassroomScene
              evidence={evidence}
              collectedIds={collectedIds}
              onCollectEvidence={onCollectEvidence}
            />
          )}
          {sceneType === 'playground' && (
            <PlaygroundScene
              evidence={evidence}
              collectedIds={collectedIds}
              onCollectEvidence={onCollectEvidence}
            />
          )}
          {sceneType === 'office' && (
            <OfficeScene
              evidence={evidence}
              collectedIds={collectedIds}
              onCollectEvidence={onCollectEvidence}
            />
          )}

          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={0.3}
            autoRotate
            autoRotateSpeed={0.3}
          />

          <fog attach="fog" args={[sceneType === 'playground' ? '#87CEEB' : '#2a2a3a', 10, 25]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
