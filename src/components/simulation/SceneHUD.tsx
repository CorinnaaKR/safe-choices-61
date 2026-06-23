import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Evidence, Scene, Choice, GameState, Mode, CastMember, KnownFact } from '@/types/simulation';
import { FeedbackPanel } from './FeedbackPanel';
import { ChoiceConfirmModal } from './ChoiceConfirmModal';
import { InspectViewer } from './InspectViewer';
import { KnowledgePanel } from './KnowledgePanel';
import { playUiTick } from '@/lib/sfx';
import { useHudActivity } from '@/hooks/useHudActivity';

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
  cast?: CastMember[];
  knownFacts?: KnownFact[];
  onMakeChoice: (choice: Choice, supportingEvidenceIds?: string[]) => void;
  onProceed: () => void;
  onExit: () => void;
  onDismissEvidence: () => void;
  onComplete?: () => void;
  onAddObservation?: (evidence: Evidence) => void;
}

// Spring config used on choice buttons — feels mechanical, not floaty
const CHOICE_SPRING = { type: 'spring', stiffness: 420, damping: 28 } as const;

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
  cast = [],
  knownFacts = [],
  onMakeChoice,
  onProceed,
  onExit,
  onDismissEvidence,
  onComplete,
  onAddObservation,
}: SceneHUDProps) {
  const [journalOpen, setJournalOpen] = useState(false);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  const [visibleParagraph, setVisibleParagraph] = useState(() =>
    currentScene.narrative.length > 0 ? 1 : 0
  );
  const [pendingChoice, setPendingChoice] = useState<Choice | null>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const prevSceneId = useRef(currentScene.id);
  const readyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sceneEvidence = currentScene.evidence || [];
  const uncollected = sceneEvidence.filter(
    e => !gameState.collectedEvidence.some(c => c.id === e.id)
  );

  // HUD ghosts out after 3s of inactivity — stays visible when journal/inspect is open
  const userActive = useHudActivity(3000);

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
    if (next <= currentScene.narrative.length) setVisibleParagraph(next);
  };

  const allRevealed = visibleParagraph >= currentScene.narrative.length;
  const narrativeUnread = sceneReady && !allRevealed && visibleParagraph > 0;
  const choicesReady = sceneReady && allRevealed && !!currentScene.isDecisionPoint;
  const forceVisible = journalOpen || knowledgeOpen || !!inspectedEvidence || showFeedback || !!pendingChoice || narrativeUnread || choicesReady;
  const hudOpacity = forceVisible ? 1 : userActive ? 1 : 0.12;

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
    ? Math.max(1, gameState.collectedEvidence.findIndex(e => e.id === inspectedEvidence.id) + 1)
    : 1;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-10"
      animate={{ opacity: hudOpacity }}
      transition={{ duration: forceVisible || userActive ? 0.25 : 2.0, ease: 'easeInOut' }}
    >
      {/* ── TOP-CENTRE: scene identity + clue count ─────────────────────── */}
      {!inspectedEvidence && !showFeedback && (
        <div className="absolute top-6 inset-x-0 flex flex-col items-center gap-1.5 pointer-events-none">
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.1 }}
            className="font-mono text-[9px] uppercase tracking-[0.45em] text-foreground/35 hud-float"
          >
            {scenarioTitle}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.18 }}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/65 hud-float"
          >
            {currentScene.title}
          </motion.p>
          <AnimatePresence>
            {uncollected.length > 0 && !focusedEvidenceId && (
              <motion.p
                key="clue-count"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="font-mono text-[9px] uppercase tracking-[0.35em] text-primary/50 hud-float mt-0.5"
              >
                {String(uncollected.length).padStart(2, '0')}&nbsp;
                {uncollected.length === 1 ? 'clue' : 'clues'} in scene
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── HUD CLUSTER: top-left on mobile, bottom-left on desktop ────────── */}
      {!inspectedEvidence && !showFeedback && !focusedEvidenceId && (
        <div className="absolute top-4 left-4 md:top-auto md:bottom-6 md:left-6 pointer-events-auto flex flex-col gap-2">
          <button
            onClick={onExit}
            className="key-hint hover:text-foreground transition-colors hud-btn block text-left"
          >
            <span className="hidden md:inline"><b>[ESC]</b> </span>Menu
          </button>
          <button
            onClick={() => setJournalOpen(!journalOpen)}
            className="key-hint hover:text-foreground transition-colors hud-btn block text-left"
          >
            <span className="hidden md:inline"><b>[TAB]</b> </span>
            {mode === 'learning' ? 'Observations' : 'Evidence'}&nbsp;—&nbsp;
            <span className="text-primary">
              {String(gameState.collectedEvidence.length).padStart(2, '0')}
            </span>
          </button>
          {mode === 'training' && (
            <div className="pointer-events-none">
              <div className="w-16 h-px bg-border/60 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-primary/70"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/25 mt-1 hud-float">
                {String(progress).padStart(3, '0')}%
              </p>
            </div>
          )}
          <div className="pointer-events-none mt-1 space-y-0.5">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/22 hud-float hidden md:block">
              [drag] look around
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/22 hud-float hidden md:block">
              [click] {mode === 'learning' ? 'look closer' : 'examine'}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/22 hud-float block md:hidden">
              swipe to look
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/22 hud-float block md:hidden">
              tap to {mode === 'learning' ? 'look closer' : 'examine'}
            </p>
          </div>
        </div>
      )}

      {/* ── NARRATIVE: progressive reveal, bottom-centre ─────────────────── */}
      {!showFeedback && sceneReady && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90vw] max-w-xl pointer-events-auto">
          <AnimatePresence mode="wait">
            {!allRevealed && visibleParagraph > 0 && (
              <motion.div
                key={`p-${visibleParagraph - 1}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                onClick={advanceNarrative}
                className="cursor-pointer"
              >
                <div className="narrative-panel px-6 py-5">
                  <p className="narrative-text">
                    {currentScene.narrative[visibleParagraph - 1]}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="hud-label opacity-50">
                      {String(visibleParagraph).padStart(2, '0')} / {String(currentScene.narrative.length).padStart(2, '0')}
                    </span>
                    <motion.button
                      onClick={advanceNarrative}
                      className="flex items-center gap-2 bg-primary/90 hover:bg-primary text-primary-foreground font-mono text-[11px] uppercase tracking-[0.14em] px-4 py-2 transition-colors pointer-events-auto"
                      animate={{ opacity: [0.85, 1, 0.85] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {visibleParagraph >= currentScene.narrative.length - 1 ? 'Continue' : 'Next'}
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {allRevealed && currentScene.isFinalScene && onComplete && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.3 }}
              className="text-center"
            >
              <motion.button
                onClick={onComplete}
                whileHover={{ x: 4, scale: 1.03 }}
                whileTap={{ scale: 0.96, x: 2 }}
                transition={CHOICE_SPRING}
                className="bg-primary text-primary-foreground font-sans text-sm font-semibold px-8 py-3.5 hover:bg-primary/90 shadow-lg"
              >
                View results
              </motion.button>
            </motion.div>
          )}

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

      {/* ── DECISION PANEL: bottom-right ─────────────────────────────────── */}
      {!showFeedback && sceneReady && allRevealed && currentScene.isDecisionPoint && currentScene.choices && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:w-[400px] pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.3 }}
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
                <motion.button
                  key={choice.id}
                  whileHover={{ x: 4, scale: 1.03, backgroundColor: 'hsl(var(--secondary))' }}
                  whileTap={{ scale: 0.97, x: 2 }}
                  transition={CHOICE_SPRING}
                  onClick={() => {
                    playUiTick();
                    if (mode === 'learning') {
                      onMakeChoice(choice, []);
                    } else {
                      setPendingChoice(choice);
                    }
                  }}
                  className="w-full text-left px-4 py-3 bg-secondary/40 border border-transparent hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs text-muted-foreground group-hover:text-primary mt-0.5 transition-colors">
                      [{String.fromCharCode(65 + i)}]
                    </span>
                    <p className="text-sm text-foreground/85 group-hover:text-foreground leading-relaxed">
                      {choice.text}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ── EVIDENCE INSPECT ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {inspectedEvidence && focusedEvidenceId && (
          <div
            className="flex justify-center items-center pointer-events-none overflow-y-auto"
            style={{ position: 'fixed', inset: 0, zIndex: 9000, padding: '1rem' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="w-[90vw] max-w-md pointer-events-auto my-2"
            >
              <InspectViewer
                evidence={inspectedEvidence}
                evidenceNumber={evidenceNumber}
                onDismiss={onDismissEvidence}
                mode={mode}
                collected={gameState.collectedEvidence.some((e) => e.id === inspectedEvidence.id)}
                onAddObservation={onAddObservation ? () => onAddObservation(inspectedEvidence) : undefined}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── CHOICE CONFIRMATION ──────────────────────────────────────────── */}
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

      {/* ── FEEDBACK OVERLAY ─────────────────────────────────────────────── */}
      {showFeedback && lastChoice && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative z-10 w-[90vw] max-w-lg"
          >
            <FeedbackPanel choice={lastChoice} onContinue={onProceed} mode={mode} />
          </motion.div>
        </div>
      )}

      {/* ── JOURNAL DRAWER ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {journalOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute top-0 right-0 bottom-0 w-80 case-panel border-l border-border pointer-events-auto overflow-y-auto"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-background/90">
              <span className="hud-label text-primary">
                {mode === 'learning' ? 'Observations' : 'Evidence'} —{' '}
                {String(gameState.collectedEvidence.length).padStart(2, '0')} logged
              </span>
              <button
                onClick={() => setJournalOpen(false)}
                className="key-hint hover:text-foreground transition-colors hud-btn"
              >
                <span className="hidden md:inline"><b>[TAB]</b> </span>Close
              </button>
            </div>
            <div className="p-4 space-y-px">
              {gameState.collectedEvidence.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8 leading-relaxed">
                  {mode === 'learning'
                    ? 'Nothing logged yet. Look closely at people and objects in the scene.'
                    : 'No evidence yet. Look closely at people and objects in the scene.'}
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

      {/* ── WHAT YOU KNOW PANEL ──────────────────────────────────────────── */}
      <KnowledgePanel
        open={knowledgeOpen}
        onClose={() => setKnowledgeOpen(false)}
        cast={cast}
        knownFacts={knownFacts}
        collectedEvidence={gameState.collectedEvidence}
        mode={mode}
      />

      {/* ── WHAT YOU KNOW BUTTON: always visible, top-right ─────────────── */}
      {!inspectedEvidence && !showFeedback && !knowledgeOpen && (
        <button
          onClick={() => setKnowledgeOpen(true)}
          aria-label="What you know"
          className="absolute top-4 right-4 pointer-events-auto flex items-center gap-2 px-3 py-2 bg-background/90 border border-border hover:border-primary/70 hover:bg-background transition-colors backdrop-blur-sm"
          style={{ zIndex: 15 }}
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary shrink-0">
            <path d="M9 4C9 4 6.5 3 3 3.5V14.5C6.5 14 9 15 9 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 4C9 4 11.5 3 15 3.5V14.5C11.5 14 9 15 9 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 4V15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/80">What you know</span>
        </button>
      )}
    </motion.div>
  );
}
