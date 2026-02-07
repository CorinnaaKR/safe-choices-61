import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '@/hooks/useSimulation';
import { ProgressHeader } from '@/components/simulation/ProgressHeader';
import { StoryNarrative } from '@/components/simulation/StoryNarrative';
import { EvidenceCard } from '@/components/simulation/EvidenceCard';
import { ChoiceCard } from '@/components/simulation/ChoiceCard';
import { FeedbackPanel } from '@/components/simulation/FeedbackPanel';
import { EvidencePanel } from '@/components/simulation/EvidencePanel';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-story-bg">
      <ProgressHeader 
        progress={getProgress()}
        evidenceCount={gameState.collectedEvidence.length}
        onReset={() => {
          resetSimulation();
          navigate('/');
        }}
      />
      
      <main className="container mx-auto px-4 py-8 pb-32">
        {showFeedback && lastChoice ? (
          <FeedbackPanel 
            choice={lastChoice} 
            onContinue={proceedToNextScene}
          />
        ) : (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Narrative */}
            <StoryNarrative 
              title={currentScene.title}
              paragraphs={currentScene.narrative}
            />
            
            {/* Evidence Section */}
            {currentScene.evidence && currentScene.evidence.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: currentScene.narrative.length * 0.15 + 0.2 }}
                className="max-w-3xl mx-auto mt-10"
              >
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-decision-highlight" />
                  Evidence Available
                </h3>
                <div className="space-y-4">
                  {currentScene.evidence.map(evidence => (
                    <EvidenceCard
                      key={evidence.id}
                      evidence={evidence}
                      isCollected={isEvidenceCollected(evidence.id)}
                      onCollect={() => collectEvidence(evidence)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Choices Section */}
            {currentScene.isDecisionPoint && currentScene.choices && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: currentScene.narrative.length * 0.15 + 0.4 }}
                className="max-w-3xl mx-auto mt-10"
              >
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  What do you do?
                </h3>
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
      </main>
      
      {/* Evidence Panel */}
      <EvidencePanel collectedEvidence={gameState.collectedEvidence} />
    </div>
  );
}
