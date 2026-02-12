import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Evidence, Scene, Choice, GameState } from '@/types/simulation';
import { FeedbackPanel } from './FeedbackPanel';
import {
  Eye, X, Hand,
  Briefcase, Search, RotateCcw, ChevronRight
} from 'lucide-react';

interface SceneHUDProps {
  currentScene: Scene;
  gameState: GameState;
  showFeedback: boolean;
  lastChoice: Choice | null;
  inspectedEvidence: Evidence | null;
  focusedEvidenceId: string | null;
  progress: number;
  onMakeChoice: (choice: Choice) => void;
  onProceed: () => void;
  onReset: () => void;
  onDismissEvidence: () => void;
  onCollectEvidence: (evidence: Evidence) => void;
}

export function SceneHUD({
  currentScene,
  gameState,
  showFeedback,
  lastChoice,
  inspectedEvidence,
  focusedEvidenceId,
  progress,
  onMakeChoice,
  onProceed,
  onReset,
  onDismissEvidence,
  onCollectEvidence,
}: SceneHUDProps) {
  const [journalOpen, setJournalOpen] = useState(false);
  const [visibleParagraph, setVisibleParagraph] = useState(0);
  const [narrativeComplete, setNarrativeComplete] = useState(false);
  const prevSceneId = useRef(currentScene.id);

  const sceneEvidence = currentScene.evidence || [];
  const uncollected = sceneEvidence.filter(
    e => !gameState.collectedEvidence.some(c => c.id === e.id)
  );

  // Reset paragraph progression on scene change
  useEffect(() => {
    if (prevSceneId.current !== currentScene.id) {
      setVisibleParagraph(0);
      setNarrativeComplete(false);
      prevSceneId.current = currentScene.id;
    }
  }, [currentScene.id]);

  // Auto-advance first paragraph immediately
  useEffect(() => {
    if (visibleParagraph === 0 && currentScene.narrative.length > 0) {
      setVisibleParagraph(1);
    }
  }, [currentScene.id]);

  const advanceNarrative = () => {
    const next = visibleParagraph + 1;
    if (next <= currentScene.narrative.length) {
      setVisibleParagraph(next);
    }
    if (next >= currentScene.narrative.length) {
      setNarrativeComplete(true);
    }
  };

  const allRevealed = visibleParagraph >= currentScene.narrative.length;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top bar */}
      <div className="pointer-events-auto">
        <div className="flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={onReset}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-white/70" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-white">Jamie's Story</h1>
              <p className="text-xs text-white/50">{currentScene.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-decision-highlight rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-white/50">{progress}%</span>
            </div>

            {/* Evidence journal */}
            <button
              onClick={() => setJournalOpen(!journalOpen)}
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Briefcase className="w-4 h-4 text-white/70" />
              {gameState.collectedEvidence.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-decision-highlight rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {gameState.collectedEvidence.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Scene hints */}
      {!showFeedback && uncollected.length > 0 && !focusedEvidenceId && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
          >
            <Search className="w-3.5 h-3.5 text-decision-highlight" />
            <span className="text-xs text-white/80">
              {uncollected.length} clue{uncollected.length !== 1 ? 's' : ''} to find — click glowing objects
            </span>
          </motion.div>
        </div>
      )}

      {/* Controls hint */}
      {!showFeedback && allRevealed && (
        <div className="absolute bottom-4 left-4 pointer-events-none">
          <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5">
            <p className="text-[10px] text-white/40">
              WASD / Arrow keys to move · Click objects to investigate
            </p>
          </div>
        </div>
      )}

      {/* Narrative — progressive reveal, bottom center */}
      {!showFeedback && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90vw] max-w-xl pointer-events-auto">
          <AnimatePresence mode="wait">
            {!allRevealed && visibleParagraph > 0 && (
              <motion.div
                key={`p-${visibleParagraph - 1}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                onClick={advanceNarrative}
                className="cursor-pointer"
              >
                <div className="bg-black/75 backdrop-blur-md border border-white/10 rounded-xl px-6 py-4 shadow-2xl">
                  <p className="text-sm md:text-base leading-relaxed text-white/85 font-serif">
                    {currentScene.narrative[visibleParagraph - 1]}
                  </p>
                  <div className="flex items-center justify-end gap-1.5 mt-3">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">
                      {visibleParagraph} / {currentScene.narrative.length}
                    </span>
                    <ChevronRight className="w-3 h-3 text-white/30 animate-pulse" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* After all paragraphs revealed, show a subtle collapsed summary */}
          {allRevealed && !currentScene.isDecisionPoint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-black/50 backdrop-blur-sm border border-white/5 rounded-lg px-4 py-2 text-center"
            >
              <p className="text-xs text-white/40 font-serif italic">
                {currentScene.narrative[currentScene.narrative.length - 1]?.slice(0, 80)}…
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Choices panel — bottom right */}
      {!showFeedback && allRevealed && currentScene.isDecisionPoint && currentScene.choices && (
        <div className="absolute bottom-4 right-4 md:w-[380px] pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-black/70 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <Hand className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-white">What do you do?</span>
            </div>
            <div className="p-3 space-y-2 max-h-[40vh] overflow-y-auto">
              {currentScene.choices.map((choice, i) => (
                <button
                  key={choice.id}
                  onClick={() => onMakeChoice(choice)}
                  className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-decision-highlight/30 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold text-decision-highlight/60 mt-0.5 group-hover:text-decision-highlight">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <p className="text-sm text-white/80 group-hover:text-white leading-relaxed">
                      {choice.text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Evidence inspection overlay */}
      <AnimatePresence>
        {inspectedEvidence && focusedEvidenceId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 w-[90vw] max-w-md pointer-events-auto"
          >
            <div className="bg-black/80 backdrop-blur-md border border-decision-highlight/30 rounded-xl p-5 shadow-2xl shadow-decision-highlight/10">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-decision-highlight/20">
                  <Eye className="w-4 h-4 text-decision-highlight" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{inspectedEvidence.title}</h4>
                  <p className="text-xs text-white/50">{inspectedEvidence.timestamp}</p>
                </div>
                <button
                  onClick={onDismissEvidence}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-white/50" />
                </button>
              </div>
              <p className="text-sm text-white/70 leading-relaxed border-l-2 border-decision-highlight/30 pl-3 italic">
                {inspectedEvidence.content}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-decision-highlight/60 font-semibold">
                  Evidence collected
                </span>
                <span className="text-decision-highlight">✓</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback overlay */}
      {showFeedback && lastChoice && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-[90vw] max-w-lg"
          >
            <FeedbackPanel choice={lastChoice} onContinue={onProceed} />
          </motion.div>
        </div>
      )}

      {/* Evidence journal drawer */}
      <AnimatePresence>
        {journalOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute top-0 right-0 bottom-0 w-80 bg-black/80 backdrop-blur-md border-l border-white/10 pointer-events-auto overflow-y-auto"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-decision-highlight" />
                <span className="text-sm font-semibold text-white">Evidence Journal</span>
              </div>
              <button onClick={() => setJournalOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10">
                <X className="w-4 h-4 text-white/50" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {gameState.collectedEvidence.length === 0 ? (
                <p className="text-sm text-white/40 text-center py-8">
                  No evidence collected yet. Explore the scene to find clues.
                </p>
              ) : (
                gameState.collectedEvidence.map(ev => (
                  <div key={ev.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="w-3 h-3 text-decision-highlight" />
                      <h5 className="text-xs font-semibold text-white">{ev.title}</h5>
                    </div>
                    <p className="text-xs text-white/50 mb-1">{ev.timestamp}</p>
                    <p className="text-xs text-white/60 leading-relaxed">{ev.content}</p>
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
