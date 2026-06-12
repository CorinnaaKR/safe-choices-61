import { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, Evidence, Scene, Choice, Mode, SkillArea, Scenario } from '@/types/simulation';
import { getScenario, DEFAULT_SCENARIO_ID } from '@/data/scenarios';

const storageKey = (scenarioId: string, mode: Mode) =>
  `heli-state:${scenarioId}:${mode}`;

function calculateMaxPoints(scenario: Scenario): number {
  return scenario.scenes.reduce((total, scene) => {
    if (scene.choices && scene.choices.length > 0) {
      return total + Math.max(...scene.choices.map((c) => c.points));
    }
    return total;
  }, 0);
}

function getInitialState(scenario: Scenario, mode: Mode): GameState {
  return {
    scenarioId: scenario.id,
    mode,
    currentSceneId: scenario.scenes[0]?.id ?? '',
    collectedEvidence: [],
    decisions: [],
    totalPoints: 0,
    maxPossiblePoints: calculateMaxPoints(scenario),
    isComplete: false,
    startedAt: new Date().toISOString(),
  };
}

export function useSimulation(
  scenarioId: string = DEFAULT_SCENARIO_ID,
  mode: Mode = 'training'
) {
  const scenario = useMemo(
    () => getScenario(scenarioId) ?? getScenario(DEFAULT_SCENARIO_ID)!,
    [scenarioId]
  );

  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window === 'undefined') return getInitialState(scenario, mode);
    const saved = localStorage.getItem(storageKey(scenario.id, mode));
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GameState;
        // Discard saves from an older schema or different scenario
        if (parsed.scenarioId === scenario.id && parsed.mode === mode) {
          return parsed;
        }
      } catch {
        /* fall through to fresh state */
      }
    }
    return getInitialState(scenario, mode);
  });

  const [showFeedback, setShowFeedback] = useState(false);
  const [lastChoice, setLastChoice] = useState<Choice | null>(null);

  // Re-initialise when scenario/mode change (navigating between stories)
  useEffect(() => {
    const saved = localStorage.getItem(storageKey(scenario.id, mode));
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GameState;
        if (parsed.scenarioId === scenario.id && parsed.mode === mode) {
          setGameState(parsed);
          return;
        }
      } catch {
        /* ignore corrupt save */
      }
    }
    setGameState(getInitialState(scenario, mode));
    setShowFeedback(false);
    setLastChoice(null);
  }, [scenario, mode]);

  useEffect(() => {
    localStorage.setItem(
      storageKey(gameState.scenarioId, gameState.mode),
      JSON.stringify(gameState)
    );
  }, [gameState]);

  const currentScene: Scene | undefined = scenario.scenes.find(
    (s) => s.id === gameState.currentSceneId
  );

  const collectEvidence = useCallback((evidence: Evidence) => {
    setGameState((prev) => {
      if (prev.collectedEvidence.some((e) => e.id === evidence.id)) return prev;
      return {
        ...prev,
        collectedEvidence: [...prev.collectedEvidence, evidence],
      };
    });
  }, []);

  const makeChoice = useCallback(
    (choice: Choice, supportingEvidenceIds: string[] = []) => {
      setLastChoice(choice);
      setShowFeedback(true);
      setGameState((prev) => ({
        ...prev,
        decisions: [
          ...prev.decisions,
          {
            sceneId: prev.currentSceneId,
            choiceId: choice.id,
            isOptimal: choice.isOptimal,
            points: choice.points,
            skillArea: choice.skillArea,
            supportingEvidenceIds,
          },
        ],
        totalPoints: prev.totalPoints + choice.points,
      }));
    },
    []
  );

  const proceedToNextScene = useCallback(() => {
    if (!lastChoice) return;
    const nextScene = scenario.scenes.find((s) => s.id === lastChoice.nextSceneId);
    setGameState((prev) => ({
      ...prev,
      currentSceneId: lastChoice.nextSceneId,
      isComplete: nextScene?.isFinalScene ?? false,
      completedAt: nextScene?.isFinalScene ? new Date().toISOString() : undefined,
    }));
    setShowFeedback(false);
    setLastChoice(null);
  }, [lastChoice, scenario]);

  const resetSimulation = useCallback(() => {
    setGameState(getInitialState(scenario, mode));
    setShowFeedback(false);
    setLastChoice(null);
  }, [scenario, mode]);

  const hasSavedProgress = useCallback(() => {
    const saved = localStorage.getItem(storageKey(scenario.id, mode));
    if (!saved) return false;
    try {
      const state = JSON.parse(saved) as GameState;
      return state.decisions.length > 0 && !state.isComplete;
    } catch {
      return false;
    }
  }, [scenario, mode]);

  const getProgress = useCallback(() => {
    const totalScenes = scenario.scenes.filter((s) => s.isDecisionPoint).length;
    if (totalScenes === 0) return 0;
    return Math.round((gameState.decisions.length / totalScenes) * 100);
  }, [gameState.decisions.length, scenario]);

  const getOptimalDecisionsCount = useCallback(() => {
    return gameState.decisions.filter((d) => d.isOptimal).length;
  }, [gameState.decisions]);

  /** Training mode: points earned vs available per skill area. */
  const getSkillAreaBreakdown = useCallback(() => {
    const breakdown = new Map<SkillArea, { earned: number; possible: number }>();
    for (const decision of gameState.decisions) {
      if (!decision.skillArea) continue;
      const scene = scenario.scenes.find((s) => s.id === decision.sceneId);
      const possible = scene?.choices
        ? Math.max(...scene.choices.map((c) => c.points))
        : decision.points;
      const entry = breakdown.get(decision.skillArea) ?? { earned: 0, possible: 0 };
      entry.earned += decision.points;
      entry.possible += possible;
      breakdown.set(decision.skillArea, entry);
    }
    return breakdown;
  }, [gameState.decisions, scenario]);

  return {
    gameState,
    currentScene,
    scenario,
    mode,
    showFeedback,
    lastChoice,
    collectEvidence,
    makeChoice,
    proceedToNextScene,
    resetSimulation,
    hasSavedProgress,
    getProgress,
    getOptimalDecisionsCount,
    getSkillAreaBreakdown,
  };
}
