import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Evidence, Scene, Choice, GameState, Mode } from '@/types/simulation';
import { FeedbackPanel } from './FeedbackPanel';
import { ChoiceConfirmModal } from './ChoiceConfirmModal';
import { InspectViewer } from './InspectViewer';
import { playUiTick } from '@/lib/sfx';

interface SceneHUDProps {
  scenarioTitle: string;
  mode: Mode;
  currentScene: Scene;
  gameState: GameState;
  showFeedback: boolean;
  lastChoice: Choice | null;
  inspectedEvidence: Evidence | null;
  focusedEvidenceId: string | null;
  progress: number;
  trustLevel?: number;
  onMakeChoice: (choice: Choice, supportingEvidenceIds?: string[]) => void;
  onProceed: () => void;
  onExit: () => void;
  onDismissEvidence: () => void;
  /** Called when the player clicks "View results" on the final scene. */
  onComplete?: () => void;
}


export function SceneHUD({
  scenarioTitle,
  mode,
  currentScene,
  gameState,
  showFeedback,
  lastChoice,
  inspectedEvidence,
  focusedEvidenceId,
  progress,
  trustLevel,
  onMakeChoice,
  onProceed,
  onExit,
  onDismissEvidence,
  onComplete,
}: SceneHUDProps) {
  const [journalOpen, setJournalOpen] = useState(false);
  const [visibleParagraph, setVisibleParagraph] = useState(() =>
    currentScene.narrative.length > 0 ? 1 : 0
  );
  const [pendingChoice, setPendingChoice] = useState<Choice | null>(null);
  // Blocks narrative interaction while the scene-title stamp is showing (2.4s).
  // Prevents clicking through paragraphs before you've read the scene title.
  const [sceneReady, setSceneReady] = useState(false);
  const prevSceneId = useRef(currentScene.id);
  const readyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sceneEvidence = currentScene.evidence || [];
  const uncollected = sceneEvidence.filter(
    e => !gameState.collectedEvidence.some(c => c.id === e.id)
  );

  // On scene change: reset narrative and hold for stamp duration before going interactive
  useEffect(() => {
    if (prevSceneId.current !== currentScene.id) {
      prevSceneId.current = currentScene.id;
      setPendingChoice(null);
      setVisibleParagraph(currentScene.narrative.length > 0 ? 1 : 0);
      setSceneReady(false);
    }
    if (readyTimer.current) clearTimeout(readyTimer.current);
    readyTimer.current = setTimeout(() => setSceneReady(true), 2400);
    return () => { if (readyTimer.current) clearTimeout(readyTimer.current); };
  }, [currentScene.id, currentScene.narrative.length]);

  const advanceNarrative = () => {
    const next = visibleParagraph + 1;
    if (next <= currentScene.narrative.length) {
      setVisibleParagraph(next);
    }
  };

  const allRevealed = visibleParagraph >= currentScene.narrative.length;

  // [TAB] EVIDENCE / [ESC] close-or-menu
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (showFeedback) return;
      if (e.key === 'Tab') {
        e.preventDefault();
        setJournalOpen(open => !open);
      } else if (e.key === 'Escape') {
        if (pendingChoice) setPendingChoice(null);
        else if (journalOpen) setJournalOpen(false);
        else if (focusedEvidenceId) onDismissEvidence();
        else onExit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showFeedback, pendingChoice, journalOpen, focusedEvidenceId, onDismissEvidence, onExit]);

  const evidenceNumber = inspectedEvidence
    ? Math.max(
        1,
        gameState.collectedEvidence.findIndex(e => e.id === inspectedEvidence.id) + 1
      )
    : 1;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* ---- Corner HUD: top-left — exit + identity ---- */}
      <div className="absolute top-0 left-0 p-4 pointer-events-auto">
        <div className="case-panel px-4 py-3">
          <button
            onClick={onExit}
            className="key-hint hover:text-foreground transition-colors block mb-2"
          >
            <b>[ESC]</b> Menu
          </button>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground">
            {scenarioTitle}
          </p>
          <p className="hud-label mt-0.5">{currentScene.title}</p>
        </div>
      </div>

      {/* ---- Corner HUD: top-right — progress + evidence ---- */}
      <div className="absolute top-0 right-0 p-4 pointer-events-auto">
        <div className="case-panel px-4 py-3 text-right">
          {/* Progress: training mode only (learning shows no metrics) */}
          {mode === 'training' && (
            <div className="mb-2">
              <span className="hud-label">
                Progress {String(progress).padStart(3, '0')}%
              </span>
              <div className="w-28 h-px bg-border mt-1.5 ml-auto relative">
                <div
                  className="absolute inset-y-0 left-0 bg-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          <button
            onClick={() => setJournalOpen(!journalOpen)}
            className="key-hint hover:text-foreground transition-colors"
          >
            <b>[TAB]</b> Evidence —{' '}
            <span className="text-primary">
              {String(gameState.collectedEvidence.length).padStart(2, '0')}
            </span>
          </button>
        </div>
      </div>

      {/* ---- Clues-remaining hint, top centre ---- */}
      {!showFeedback && uncollected.length > 0 && !focusedEvidenceId && (
        <div className="absolute top-4 inset-x-0 flex justify-center pointer-events-none hidden md:flex">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="case-panel px-4 py-2"
          >
            <span className="hud-label">
              {String(uncollected.length).padStart(2, '0')} clue
              {uncollected.length !== 1 ? 's' : ''} in this scene — look at people and objects
            </span>
          </motion.div>
        </div>
      )}

      {/* ---- Key hints, bottom-left corner ---- */}
      {!showFeedback && (
        <div className="absolute bottom-4 left-4 pointer-events-none hidden sm:block">
          <p className="key-hint space-x-3">
            <span><b>[WASD]</b> Move</span>
            <span><b>[DRAG]</b> Look</span>
            <span><b>[CLICK]</b> Examine</span>
            <span><b>[TAB]</b> Evidence</span>
          </p>
        </div>
      )}

      {/* ---- Narrative: progressive reveal, bottom centre ---- */}
      {!showFeedback && sceneReady && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90vw] max-w-xl pointer-events-auto">
          <AnimatePresence mode="wait">
            {!allRevealed && visibleParagraph > 0 && (
              <motion.div
                key={`p-${visibleParagraph - 1}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                onClick={advanceNarrative}
                className="cursor-pointer"
              >
                <div className="case-panel px-6 py-4">
                  <p className="text-sm md:text-base leading-relaxed text-foreground/90">
                    {currentScene.narrative[visibleParagraph - 1]}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className="hud-label">
                      {String(visibleParagraph).padStart(2, '0')} /{' '}
                      {String(currentScene.narrative.length).padStart(2, '0')}
                    </span>
                    <span className="key-hint">
                      <b>[CLICK]</b> Continue
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Final scene: "View results" CTA once narrative is done */}
          {allRevealed && currentScene.isFinalScene && onComplete && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <button
                onClick={onComplete}
                className="bg-primary text-primary-foreground font-sans text-sm font-semibold px-8 py-3.5 rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
              >
                View results
              </button>
            </motion.div>
          )}

          {/* Collapsed reminder of the last line once fully revealed (non-final, non-decision scenes) */}
          {allRevealed && !currentScene.isDecisionPoint && !currentScene.isFinalScene && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="case-panel px-4 py-2 text-center"
            >
              <p className="hud-label normal-case tracking-normal text-foreground/50">
                {currentScene.narrative[currentScene.narrative.length - 1]?.slice(0, 80)}…
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* ---- Decision panel, bottom right ---- */}
      {!showFeedback && sceneReady && allRevealed && currentScene.isDecisionPoint && currentScene.choices && (
        <div className="absolute bottom-4 right-4 md:w-[400px] pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="case-panel"
          >
            <div className="px-5 py-3 border-b border-border">
              <span className="hud-label text-primary">Decision — What do you do?</span>
            </div>
            <div className="p-3 space-y-px max-h-[40vh] overflow-y-auto">
              {currentScene.choices.filter((choice) =>
                choice.requiresMinTrust === undefined ||
                (trustLevel ?? 50) >= choice.requiresMinTrust
              ).map((choice, i) => (
                <button
                  key={choice.id}
                  onClick={() => {
                    playUiTick();
                    if (mode === 'learning') {
                      onMakeChoice(choice, []);
                    } else {
                      setPendingChoice(choice);
                    }
                  }}
                  className="w-full text-left px-4 py-3 bg-secondary/40 hover:bg-secondary border border-transparent hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs text-muted-foreground group-hover:text-primary mt-0.5 transition-colors">
                      [{String.fromCharCode(65 + i)}]
                    </span>
                    <p className="text-sm text-foreground/85 group-hover:text-foreground leading-relaxed">
                      {choice.text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ---- Evidence inspect: rich visual panel ---- */}
      <AnimatePresence>
        {inspectedEvidence && focusedEvidenceId && (
          <div className="absolute top-24 inset-x-0 flex justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="w-[90vw] max-w-md pointer-events-auto"
            >
              <InspectViewer
                evidence={inspectedEvidence}
                evidenceNumber={evidenceNumber}
                onDismiss={onDismissEvidence}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---- Choice confirmation: evidence rationale ---- */}
      {pendingChoice && !showFeedback && (
        <ChoiceConfirmModal
          choice={pendingChoice}
          evidence={gameState.collectedEvidence}
          onCancel={() => setPendingChoice(null)}
          onConfirm={(ids) => {
            const c = pendingChoice;
            setPendingChoice(null);
            onMakeChoice(c, ids);
          }}
        />
      )}

      {/* ---- Feedback overlay ---- */}
      {showFeedback && lastChoice && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 w-[90vw] max-w-lg"
          >
            <FeedbackPanel choice={lastChoice} onContinue={onProceed} mode={mode} />
          </motion.div>
        </div>
      )}

      {/* ---- Evidence journal drawer ---- */}
      <AnimatePresence>
        {journalOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="absolute top-0 right-0 bottom-0 w-80 case-panel border-l border-border pointer-events-auto overflow-y-auto"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-background/90">
              <span className="hud-label text-primary">
                Evidence — {String(gameState.collectedEvidence.length).padStart(2, '0')} logged
              </span>
              <button
                onClick={() => setJournalOpen(false)}
                className="key-hint hover:text-foreground transition-colors"
              >
                <b>[TAB]</b> Close
              </button>
            </div>
            <div className="p-4 space-y-px">
              {gameState.collectedEvidence.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8 leading-relaxed">
                  No evidence yet. Look closely at people and objects in the scene.
                </p>
              ) : (
                gameState.collectedEvidence.map((ev, i) => (
                  <div key={ev.id} className="bg-secondary/40 border border-border p-3">
                    <p className="hud-label text-primary mb-1.5">
                      Nº {String(i + 1).padStart(2, '0')} — {ev.timestamp}
                    </p>
                    <h5 className="font-mono text-xs uppercase tracking-[0.15em] text-foreground mb-1.5">
                      {ev.title}
                    </h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">{ev.content}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
