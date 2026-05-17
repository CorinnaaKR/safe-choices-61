import { useState, useEffect, useCallback } from 'react';
import { GameState, Evidence, Scene, Choice } from '@/types/simulation';
import { safeguardingScenario } from '@/data/scenario';

const STORAGE_KEY = 'safeguarding-simulation-state';

const getInitialState = (): GameState => ({
  currentSceneId: safeguardingScenario.scenes[0].id,
  collectedEvidence: [],
  decisions: [],
  totalPoints: 0,
  maxPossiblePoints: calculateMaxPoints(),
  isComplete: false,
  startedAt: new Date().toISOString(),
});

function calculateMaxPoints(): number {
  return safeguardingScenario.scenes.reduce((total, scene) => {
    if (scene.choices && scene.choices.length > 0) {
      const maxChoicePoints = Math.max(...scene.choices.map(c => c.points));
      return total + maxChoicePoints;
    }
    return total;
  }, 0);
}

export function useSimulation() {
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window === 'undefined') return getInitialState();
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getInitialState();
      }
    }
    return getInitialState();
  });

  const [showFeedback, setShowFeedback] = useState(false);
  const [lastChoice, setLastChoice] = useState<Choice | null>(null);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const currentScene: Scene | undefined = safeguardingScenario.scenes.find(
    s => s.id === gameState.currentSceneId
  );

  const collectEvidence = useCallback((evidence: Evidence) => {
    setGameState(prev => {
      const alreadyCollected = prev.collectedEvidence.some(e => e.id === evidence.id);
      if (alreadyCollected) return prev;
      
      return {
        ...prev,
        collectedEvidence: [...prev.collectedEvidence, evidence],
      };
    });
  }, []);

  const makeChoice = useCallback((choice: Choice, supportingEvidenceIds: string[] = []) => {
    setLastChoice(choice);
    setShowFeedback(true);
    
    setGameState(prev => ({
      ...prev,
      decisions: [
        ...prev.decisions,
        {
          sceneId: prev.currentSceneId,
          choiceId: choice.id,
          isOptimal: choice.isOptimal,
          points: choice.points,
          supportingEvidenceIds,
        },
      ],
      totalPoints: prev.totalPoints + choice.points,
    }));
  }, []);

  const proceedToNextScene = useCallback(() => {
    if (!lastChoice) return;
    
    const nextScene = safeguardingScenario.scenes.find(s => s.id === lastChoice.nextSceneId);
    
    setGameState(prev => ({
      ...prev,
      currentSceneId: lastChoice.nextSceneId,
      isComplete: nextScene?.isFinalScene ?? false,
      completedAt: nextScene?.isFinalScene ? new Date().toISOString() : undefined,
    }));
    
    setShowFeedback(false);
    setLastChoice(null);
  }, [lastChoice]);

  const resetSimulation = useCallback(() => {
    const newState = getInitialState();
    setGameState(newState);
    setShowFeedback(false);
    setLastChoice(null);
  }, []);

  const hasSavedProgress = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return false;
    try {
      const state = JSON.parse(saved) as GameState;
      return state.decisions.length > 0 && !state.isComplete;
    } catch {
      return false;
    }
  }, []);

  const getProgress = useCallback(() => {
    const totalScenes = safeguardingScenario.scenes.filter(s => s.isDecisionPoint).length;
    const completedDecisions = gameState.decisions.length;
    return Math.round((completedDecisions / totalScenes) * 100);
  }, [gameState.decisions.length]);

  const getOptimalDecisionsCount = useCallback(() => {
    return gameState.decisions.filter(d => d.isOptimal).length;
  }, [gameState.decisions]);

  return {
    gameState,
    currentScene,
    scenario: safeguardingScenario,
    showFeedback,
    lastChoice,
    collectEvidence,
    makeChoice,
    proceedToNextScene,
    resetSimulation,
    hasSavedProgress,
    getProgress,
    getOptimalDecisionsCount,
  };
}
