import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '@/hooks/useSimulation';
import { ProgressHeader } from '@/components/simulation/ProgressHeader';
import { StoryNarrative } from '@/components/simulation/StoryNarrative';
import { EvidenceCard } from '@/components/simulation/EvidenceCard';
import { ChoiceCard } from '@/components/simulation/ChoiceCard';
import { FeedbackPanel } from '@/components/simulation/FeedbackPanel';
import { EvidencePanel } from '@/components/simulation/EvidencePanel';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Hand } from 'lucide-react';

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

  // Redirect to results if complete
  useEffect(() => {
    if (gameState.isComplete) {
      navigate('/results');
    }
  }, [gameState.isComplete, navigate]);

  // Scroll to top on scene change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      
      <main className="container mx-auto px-4 py-10 pb-36">
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
              {/* Narrative */}
              <StoryNarrative 
                title={currentScene.title}
                paragraphs={currentScene.narrative}
              />
              
              {/* Evidence Section */}
              {currentScene.evidence && currentScene.evidence.length > 0 && (
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
                      Evidence Available
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-evidence-border to-transparent" />
                  </div>
                  <div className="space-y-4">
                    {currentScene.evidence.map((evidence, i) => (
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
      
      {/* Evidence Panel */}
      <EvidencePanel collectedEvidence={gameState.collectedEvidence} />
    </div>
  );
}
