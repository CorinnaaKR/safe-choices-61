import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSimulation } from '@/hooks/useSimulation';
import { useLandscapePhone } from '@/hooks/useLandscapePhone';
import { DEFAULT_SCENARIO_ID } from '@/data/scenarios';
import { Mode, SceneEnvironment } from '@/types/simulation';
import { SceneRenderer, SceneType } from '@/components/3d/SceneRenderer';
import { CLASSROOM_EVIDENCE_POSITIONS } from '@/components/3d/ClassroomScene';
import { PLAYGROUND_EVIDENCE_POSITIONS } from '@/components/3d/PlaygroundScene';
import { OFFICE_EVIDENCE_POSITIONS } from '@/components/3d/OfficeScene';
import { HOME_EVIDENCE_POSITIONS } from '@/components/3d/HomeScene';
import { Evidence } from '@/types/simulation';
import { SceneHUD } from '@/components/simulation/SceneHUD';
import { PreVisitConversation } from '@/components/simulation/PreVisitConversation';
import { LazloThread } from '@/components/simulation/LazloThread';
import { CallScene } from '@/components/simulation/CallScene';
import { Epilogue } from '@/components/simulation/Epilogue';
import { ClosingSequence } from '@/components/simulation/ClosingSequence';
import { TrainingGate } from '@/components/simulation/TrainingGate';
import { SceneTitleStamp } from '@/components/LoadingSequence';
import { PauseOverlay } from '@/components/simulation/PauseOverlay';
import { GroupChatScene } from '@/components/simulation/GroupChatScene';

function environmentToSceneType(env?: SceneEnvironment): SceneType {
  if (env === 'classroom' || env === 'playground' || env === 'office' || env === 'home' || env === 'home-jamie') return env;
  return 'office';
}

export default function StoryPage() {
  const navigate = useNavigate();
  const { scenarioId = DEFAULT_SCENARIO_ID } = useParams();
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const mode: Mode = modeParam === 'training' ? 'training' : 'learning';

  const {
    gameState,
    currentScene,
    scenario,
    showFeedback,
    lastChoice,
    collectEvidence,
    makeChoice,
    makeChoiceAndAdvance,
    completeTrainingGate,
    completePreVisit,
    completeLazloThread,
    completeCallScene,
    proceedToNextScene,
    completeFinalScene,
    getProgress,
  } = useSimulation(scenarioId, mode);

  const [focusedEvidenceId, setFocusedEvidenceId] = useState<string | null>(null);
  const [inspectedEvidence, setInspectedEvidence] = useState<Evidence | null>(null);
  const [showPause, setShowPause] = useState(false);
  const [showEpilogue, setShowEpilogue] = useState(false);
  const [vignettePulse, setVignettePulse] = useState(false);
  const [cameraReturning, setCameraReturning] = useState(false);
  const vignettTimer = useRef<ReturnType<typeof setTimeout>>();
  const cameraReturnTimer = useRef<ReturnType<typeof setTimeout>>();
  const isLandscapePhone = useLandscapePhone();

  const triggerVignette = () => {
    setVignettePulse(true);
    clearTimeout(vignettTimer.current);
    vignettTimer.current = setTimeout(() => setVignettePulse(false), 600);
  };

  useEffect(() => {
    if (gameState.isComplete) {
      if (gameState.mode === 'learning') {
        navigate('/');
      } else {
        navigate(`/results?scenario=${gameState.scenarioId}&mode=${gameState.mode}`);
      }
    }
  }, [gameState.isComplete, gameState.scenarioId, gameState.mode, navigate]);

  useEffect(() => {
    setFocusedEvidenceId(null);
    setInspectedEvidence(null);
  }, [gameState.currentSceneId, showFeedback]);

  // If the player chose to go straight over (pv-3a), skip the Lazlo text thread —
  // messaging him before visiting contradicts that choice.
  useEffect(() => {
    if (
      scenarioId === 'lazlo-case' &&
      gameState.preVisitComplete &&
      !gameState.lazloThreadComplete &&
      gameState.preVisitChoices?.includes('pv-3a')
    ) {
      completeLazloThread('direct', 'visit');
    }
  }, [scenarioId, gameState.preVisitComplete, gameState.lazloThreadComplete, gameState.preVisitChoices, completeLazloThread]);

  const sceneType = environmentToSceneType(currentScene?.environment);
  const sceneEvidence = currentScene?.evidence || [];
  const collectedIds = gameState.collectedEvidence.map(e => e.id);

  // NPC-attached evidence positions (character-relative world coords)
  const NPC_EVIDENCE_POSITIONS: Record<string, [number, number, number]> = {
    // Classroom: Jamie at [3.5, 0.45, 2.5]
    'obs-1': [3.5, 0.9, 2.7],
    // Playground: Jamie at [-4, 0.45, 2.8]
    'obs-2': [-4, 1.1, 2.95],
    'vis-1': [-3.78, 0.6, 2.85],
    // Scene 3a: bruise confirmation — playground, near Jamie on bench
    'vis-2': [-3.78, 0.6, 2.8],
    'obs-3': [-4, 1.1, 2.8],
  };

  // Build evidence position map
  const evidencePositions = useMemo(() => {
    const posMap = new Map<string, [number, number, number]>();
    sceneEvidence.forEach((ev, i) => {
      if (NPC_EVIDENCE_POSITIONS[ev.id]) {
        posMap.set(ev.id, NPC_EVIDENCE_POSITIONS[ev.id]);
      } else if (sceneType === 'home' && HOME_EVIDENCE_POSITIONS[ev.id]) {
        posMap.set(ev.id, HOME_EVIDENCE_POSITIONS[ev.id]);
      } else {
        const fallback =
          sceneType === 'classroom' ? CLASSROOM_EVIDENCE_POSITIONS :
          sceneType === 'playground' ? PLAYGROUND_EVIDENCE_POSITIONS :
          OFFICE_EVIDENCE_POSITIONS;
        posMap.set(ev.id, fallback[i] || [i * 1.5, 1, 0]);
      }
    });
    return posMap;
  }, [sceneEvidence, sceneType]);

  const handleFocusEvidence = (evidence: Evidence) => {
    setFocusedEvidenceId(evidence.id);
    setInspectedEvidence(evidence);
    // Training mode keeps the original auto-collect behaviour (Lazlo's Story).
    // Story mode is opt-in: noticing something isn't the same as deciding it
    // matters — see the "gut instinct, not a memory test" principle in
    // safeguarding-restructure-jamie-friend-pov memory. The player explicitly
    // chooses to add it via handleAddObservation below.
    if (mode === 'training') {
      collectEvidence(evidence);
    }
  };

  const handleAddObservation = (evidence: Evidence) => {
    collectEvidence(evidence);
  };

  // Dev-only: allow Playwright tests to inject an inspect state without 3D click
  useEffect(() => {
    if (import.meta.env.DEV && sceneEvidence.length > 0) {
      (window as any).__heliTestInspect = () => handleFocusEvidence(sceneEvidence[0]);
      (window as any).__heliTestDismiss = handleCameraReset;
    }
    return () => {
      delete (window as any).__heliTestInspect;
      delete (window as any).__heliTestDismiss;
    };
  }, [sceneEvidence]);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleCameraReset = () => {
    setFocusedEvidenceId(null);
    setInspectedEvidence(null);
    // Force R3F to recompute the canvas, then briefly show a fade to hide
    // the one-frame black flash that can occur when the camera returns from
    // inspect mode to FPS mode.
    window.dispatchEvent(new Event('resize'));
    setCameraReturning(true);
    clearTimeout(cameraReturnTimer.current);
    cameraReturnTimer.current = setTimeout(() => setCameraReturning(false), 350);
  };

  // Training mode: show declaration gate before anything else
  if (mode === 'training' && !gameState.trainingProfile) {
    return (
      <TrainingGate
        scenarioTitle={scenario.title}
        onComplete={completeTrainingGate}
      />
    );
  }

  // Show pre-visit SMS conversation if scenario has one and it hasn't been completed
  if (scenario.preVisit && !gameState.preVisitComplete) {
    return (
      <PreVisitConversation
        data={scenario.preVisit}
        onComplete={(choiceIds, finalTrust) => completePreVisit(choiceIds, finalTrust)}
      />
    );
  }

  // Show Lazlo thread scene after pre-visit, only for lazlo-case
  if (scenarioId === 'lazlo-case' && gameState.preVisitComplete && !gameState.lazloThreadComplete) {
    return (
      <LazloThread
        onComplete={(tone, followUp) => completeLazloThread(tone, followUp)}
      />
    );
  }

  // "Making the call" — shown when the player escalates via ACT Early
  if (
    scenario.callScene &&
    gameState.currentSceneId === 'scene-call' &&
    !gameState.callSceneComplete
  ) {
    return (
      <CallScene
        data={scenario.callScene}
        collectedEvidence={gameState.collectedEvidence}
        onComplete={(scriptIds) => completeCallScene(scriptIds, 'scene-l5')}
      />
    );
  }

  // Closing sequence — narrative epilogue + reflection + common-signs page (Story mode)
  if (showEpilogue && scenario.closingSequence) {
    const outcome = currentScene?.epilogueOutcome ?? 'sobering';
    return (
      <ClosingSequence
        data={scenario.closingSequence}
        outcome={outcome}
        collectedEvidence={gameState.collectedEvidence}
        onComplete={completeFinalScene}
      />
    );
  }

  // Epilogue — phone-thread style, shown after the final scene, before results (Lazlo's Story)
  if (showEpilogue && scenario.epilogue) {
    const trustedAdultChoices = ['c-l4a-2', 'c-l4b-2'];
    const tookTrustedAdultPath = gameState.decisions.some((d) => trustedAdultChoices.includes(d.choiceId));
    const outcome = gameState.callSceneComplete ? 'good' : tookTrustedAdultPath ? 'middle' : 'sobering';
    return (
      <Epilogue
        data={scenario.epilogue}
        outcome={outcome}
        onComplete={completeFinalScene}
      />
    );
  }

  if (!currentScene) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <p className="hud-label">Loading scenario…</p>
      </div>
    );
  }

  const sceneNumber =
    scenario.scenes.findIndex((s) => s.id === currentScene.id) + 1;

  return (
    <div className="fixed inset-0 overflow-hidden bg-background crosshair-area" style={{ touchAction: 'none' }}>
      {/* Full-screen 3D scene */}
      {/* Doorstep scene (scene-l0): replace the 3D interior with a simple
          exterior backdrop — overcast afternoon sky + concrete step + door —
          so the narrative ("you're outside knocking") makes visual sense. */}
      {currentScene.id === 'scene-l0' && (
        <div className="absolute inset-0 flex flex-col" style={{ zIndex: 1 }}>
          {/* Sky — flat overcast afternoon */}
          <div style={{ flex: '0 0 45%', background: 'linear-gradient(to bottom, #B8C8D8 0%, #D0D8E0 100%)' }} />
          {/* Exterior wall — rendered brick / render finish */}
          <div style={{ flex: '1', background: 'linear-gradient(to bottom, #9A8C7E 0%, #8A7C6E 100%)', position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '8%' }}>
            {/* Door */}
            <div style={{ width: '18%', maxWidth: 120, aspectRatio: '0.48', background: '#3A2A1A', borderRadius: '2px 2px 0 0', position: 'relative', boxShadow: '4px 0 12px rgba(0,0,0,0.4)' }}>
              {/* Door panels */}
              <div style={{ position: 'absolute', top: '8%', left: '10%', right: '10%', height: '28%', background: '#2E2010', borderRadius: 2 }} />
              <div style={{ position: 'absolute', top: '42%', left: '10%', right: '10%', height: '38%', background: '#2E2010', borderRadius: 2 }} />
              {/* Handle */}
              <div style={{ position: 'absolute', top: '55%', right: '12%', width: '10%', height: '6%', background: '#B09060', borderRadius: 4 }} />
              {/* Letterbox */}
              <div style={{ position: 'absolute', top: '48%', left: '25%', right: '25%', height: '3%', background: '#B09060', borderRadius: 2 }} />
            </div>
            {/* Step */}
            <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '30%', maxWidth: 200, height: '8%', background: '#7A7060' }} />
          </div>
        </div>
      )}
      <SceneRenderer
        sceneType={sceneType}
        scenarioId={scenarioId}
        hidePlayer={true}
        evidence={sceneEvidence}
        collectedIds={collectedIds}
        focusedEvidenceId={focusedEvidenceId}
        evidencePositions={evidencePositions}
        onCollectEvidence={collectEvidence}
        onFocusEvidence={handleFocusEvidence}
        onCameraReset={handleCameraReset}
      />

      {/* Scene title stamp on entry */}
      <SceneTitleStamp index={sceneNumber} title={currentScene.title} />

      {/* Vignette pulse on choice confirm — warm edge flash, like a film frame */}
      <AnimatePresence>
        {vignettePulse && (
          <motion.div
            key="vignette"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, exit: { duration: 0.45 } } as never}
            className="pointer-events-none fixed inset-0 z-20"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Brief fade when camera returns from evidence inspect — hides black flash */}
      <AnimatePresence>
        {cameraReturning && (
          <motion.div
            key="cam-return"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-none fixed inset-0 z-20 bg-background"
          />
        )}
      </AnimatePresence>

      {/* HUD overlay */}
      <SceneHUD
        scenarioTitle={scenario.title}
        mode={mode}
        currentScene={currentScene}
        gameState={gameState}
        showFeedback={showFeedback}
        lastChoice={lastChoice}
        inspectedEvidence={inspectedEvidence}
        focusedEvidenceId={focusedEvidenceId}
        progress={getProgress()}
        trustLevel={gameState.trustLevel}
        cast={scenario.castOfCharacters}
        knownFacts={scenario.knownFacts}
        onMakeChoice={(choice, ids) => { triggerVignette(); makeChoice(choice, ids); }}
        onProceed={proceedToNextScene}
        onComplete={(scenario.epilogue || scenario.closingSequence) ? () => setShowEpilogue(true) : completeFinalScene}
        onExit={() => setShowPause(true)}
        onDismissEvidence={handleCameraReset}
        onAddObservation={handleAddObservation}
      />
      {showPause && (
        <PauseOverlay
          scenario={scenario}
          onResume={() => setShowPause(false)}
          onLeave={() => navigate('/')}
        />
      )}

      {/* Landscape-phone nudge — shown when the device is phone-sized and rotated sideways */}
      <AnimatePresence>
        {isLandscapePhone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/95 gap-5 px-8 text-center"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-primary">
              <rect x="4" y="10" width="20" height="32" rx="3" stroke="currentColor" strokeWidth="1.8" transform="rotate(-90 4 10) translate(-6 -6)"/>
              <path d="M22 20a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M29 20v9h-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary mb-2">Rotate your device</p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                This simulation works best in portrait mode. Please rotate your phone upright to continue.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
