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

  // NPC-attached evidence positions (character-relative world coords)
  const NPC_EVIDENCE_POSITIONS: Record<string, [number, number, number]> = {
    // Classroom: Jamie at [3.5, 0.45, 2.5]
    'obs-1': [3.5, 0.9, 2.7],
    // Playground: Jamie at [-4, 0.45, 2.8]
    'obs-2': [-4, 1.1, 2.95],
    'vis-1': [-3.78, 0.6, 2.85],
    // Scene 3a: bruise confirmation
    'vis-2': [3.5, 0.6, 2.85],
    'obs-3': [3.5, 1.1, 2.7],
    // Scene 3b: drawing
    'vis-3': [3.5, 0.8, 2.8],
  };

  // Build evidence position map
  const evidencePositions = useMemo(() => {
    const posMap = new Map<string, [number, number, number]>();
    const positions =
      sceneType === 'classroom' ? CLASSROOM_EVIDENCE_POSITIONS :
      sceneType === 'playground' ? PLAYGROUND_EVIDENCE_POSITIONS :
      OFFICE_EVIDENCE_POSITIONS;
    sceneEvidence.forEach((ev, i) => {
      // Use NPC position if this evidence is character-attached
      if (NPC_EVIDENCE_POSITIONS[ev.id]) {
        posMap.set(ev.id, NPC_EVIDENCE_POSITIONS[ev.id]);
      } else {
        posMap.set(ev.id, positions[i] || [i * 1.5, 1, 0]);
      }
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
