import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '@/hooks/useSimulation';
import { ProgressHeader } from '@/components/simulation/ProgressHeader';
import { StoryNarrative } from '@/components/simulation/StoryNarrative';
import { EvidenceCard } from '@/components/simulation/EvidenceCard';
import { ChoiceCard } from '@/components/simulation/ChoiceCard';
import { FeedbackPanel } from '@/components/simulation/FeedbackPanel';
import { EvidencePanel } from '@/components/simulation/EvidencePanel';
import { SceneRenderer, getSceneType } from '@/components/3d/SceneRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Hand, Eye } from 'lucide-react';
import { Evidence } from '@/types/simulation';

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

  const [inspectedEvidence, setInspectedEvidence] = useState<Evidence | null>(null);

  useEffect(() => {
    if (gameState.isComplete) {
      navigate('/results');
    }
  }, [gameState.isComplete, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setInspectedEvidence(null);
  }, [gameState.currentSceneId, showFeedback]);

  if (!currentScene) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading scenario...</p>
      </div>
    );
  }

  const isEvidenceCollected = (evidenceId: string) => {
    return gameState.collectedEvidence.some(e => e.id === evidenceId);
  };

  const sceneType = getSceneType(currentScene.id);
  const sceneEvidence = currentScene.evidence || [];
  const collectedIds = gameState.collectedEvidence.map(e => e.id);

  const handleCollectFrom3D = (evidence: Evidence) => {
    setInspectedEvidence(evidence);
    collectEvidence(evidence);
  };

  return (
    <div className="min-h-screen story-atmosphere">
      <ProgressHeader 
        progress={getProgress()}
        evidenceCount={gameState.collectedEvidence.length}
        onReset={() => {
          resetSimulation();
          navigate('/');
        }}
      />
      
      <main className="container mx-auto px-4 py-6 pb-36">
        <AnimatePresence mode="wait">
          {showFeedback && lastChoice ? (
            <motion.div
              key="feedback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FeedbackPanel 
                choice={lastChoice} 
                onContinue={proceedToNextScene}
              />
            </motion.div>
          ) : (
            <motion.div
              key={currentScene.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* 3D Scene */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto mb-8"
              >
                <SceneRenderer
                  sceneType={sceneType}
                  evidence={sceneEvidence}
                  collectedIds={collectedIds}
                  onCollectEvidence={handleCollectFrom3D}
                />
              </motion.div>

              {/* Evidence inspection popup */}
              <AnimatePresence>
                {inspectedEvidence && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="max-w-3xl mx-auto mb-8"
                  >
                    <div className="bg-card border-2 border-decision-highlight/50 rounded-xl p-5 shadow-lg shadow-decision-highlight/10">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-decision-highlight/10">
                          <Eye className="w-4 h-4 text-decision-highlight" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{inspectedEvidence.title}</h4>
                          <p className="text-xs text-muted-foreground">{inspectedEvidence.timestamp}</p>
                        </div>
                        <button
                          onClick={() => setInspectedEvidence(null)}
                          className="ml-auto text-muted-foreground hover:text-foreground text-sm"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed border-l-2 border-decision-highlight/30 pl-3 italic">
                        {inspectedEvidence.content}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Narrative - condensed */}
              <StoryNarrative 
                title={currentScene.title}
                paragraphs={currentScene.narrative}
              />
              
              {/* Evidence cards (also accessible below narrative) */}
              {sceneEvidence.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: currentScene.narrative.length * 0.2 + 0.3 }}
                  className="max-w-3xl mx-auto mt-6"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-lg bg-decision-highlight/10">
                      <Search className="w-4 h-4 text-decision-highlight" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm uppercase tracking-widest">
                      Evidence Found
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-evidence-border to-transparent" />
                  </div>
                  <div className="space-y-4">
                    {sceneEvidence.map((evidence, i) => (
                      <motion.div
                        key={evidence.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: currentScene.narrative.length * 0.2 + 0.4 + i * 0.1 }}
                      >
                        <EvidenceCard
                          evidence={evidence}
                          isCollected={isEvidenceCollected(evidence.id)}
                          onCollect={() => collectEvidence(evidence)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Choices Section */}
              {currentScene.isDecisionPoint && currentScene.choices && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: currentScene.narrative.length * 0.2 + 0.6 }}
                  className="max-w-3xl mx-auto mt-10"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-lg bg-primary/10 glow-pulse">
                      <Hand className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm uppercase tracking-widest">
                      What do you do?
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                  </div>
                  <div className="space-y-3">
                    {currentScene.choices.map((choice, index) => (
                      <ChoiceCard
                        key={choice.id}
                        choice={choice}
                        index={index}
                        onSelect={() => makeChoice(choice)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <EvidencePanel collectedEvidence={gameState.collectedEvidence} />
    </div>
  );
}
