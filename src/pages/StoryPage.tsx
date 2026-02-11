import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '@/hooks/useSimulation';
import { SceneRenderer, getSceneType } from '@/components/3d/SceneRenderer';
import { CLASSROOM_EVIDENCE_POSITIONS } from '@/components/3d/ClassroomScene';
import { PLAYGROUND_EVIDENCE_POSITIONS } from '@/components/3d/PlaygroundScene';
import { OFFICE_EVIDENCE_POSITIONS } from '@/components/3d/OfficeScene';
import { Evidence } from '@/types/simulation';
import { SceneHUD } from '@/components/simulation/SceneHUD';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoryPage() {
  const navigate = useNavigate();
  const {
    gameState,
    currentScene,
    showFeedback,
    lastChoice,
    collectEvidence,
    makeChoice,
    proceedToNextScene,
    resetSimulation,
    getProgress,
  } = useSimulation();

  const [focusedEvidenceId, setFocusedEvidenceId] = useState<string | null>(null);
  const [inspectedEvidence, setInspectedEvidence] = useState<Evidence | null>(null);

  useEffect(() => {
    if (gameState.isComplete) {
      navigate('/results');
    }
  }, [gameState.isComplete, navigate]);

  useEffect(() => {
    setFocusedEvidenceId(null);
    setInspectedEvidence(null);
  }, [gameState.currentSceneId, showFeedback]);

  const sceneType = currentScene ? getSceneType(currentScene.id) : 'classroom';
  const sceneEvidence = currentScene?.evidence || [];
  const collectedIds = gameState.collectedEvidence.map(e => e.id);

  // Build evidence position map
  const evidencePositions = useMemo(() => {
    const posMap = new Map<string, [number, number, number]>();
    const positions =
      sceneType === 'classroom' ? CLASSROOM_EVIDENCE_POSITIONS :
      sceneType === 'playground' ? PLAYGROUND_EVIDENCE_POSITIONS :
      OFFICE_EVIDENCE_POSITIONS;
    sceneEvidence.forEach((ev, i) => {
      posMap.set(ev.id, positions[i] || [i * 1.5, 1, 0]);
    });
    return posMap;
  }, [sceneEvidence, sceneType]);

  const handleFocusEvidence = (evidence: Evidence) => {
    setFocusedEvidenceId(evidence.id);
    setInspectedEvidence(evidence);
    collectEvidence(evidence);
  };

  const handleCameraReset = () => {
    setFocusedEvidenceId(null);
    setInspectedEvidence(null);
  };

  if (!currentScene) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading scenario...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Full-screen 3D scene */}
      <SceneRenderer
        sceneType={sceneType}
        evidence={sceneEvidence}
        collectedIds={collectedIds}
        focusedEvidenceId={focusedEvidenceId}
        evidencePositions={evidencePositions}
        onCollectEvidence={collectEvidence}
        onFocusEvidence={handleFocusEvidence}
        onCameraReset={handleCameraReset}
      />

      {/* HUD overlay */}
      <SceneHUD
        currentScene={currentScene}
        gameState={gameState}
        showFeedback={showFeedback}
        lastChoice={lastChoice}
        inspectedEvidence={inspectedEvidence}
        focusedEvidenceId={focusedEvidenceId}
        progress={getProgress()}
        onMakeChoice={makeChoice}
        onProceed={proceedToNextScene}
        onReset={() => {
          resetSimulation();
          navigate('/');
        }}
        onDismissEvidence={handleCameraReset}
        onCollectEvidence={collectEvidence}
      />
    </div>
  );
}
