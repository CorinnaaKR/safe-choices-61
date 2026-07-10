import { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, Evidence, Scene, Choice, Mode, SkillArea, Scenario, TrainingProfile } from '@/types/simulation';
import { getScenario, DEFAULT_SCENARIO_ID } from '@/data/scenarios';

const storageKey = (scenarioId: string, mode: Mode) =>
  `heli-state:${scenarioId}:${mode}`;

function getInitialState(scenario: Scenario, mode: Mode): GameState {
  return {
    scenarioId: scenario.id,
    mode,
    currentSceneId: scenario.scenes[0]?.id ?? '',
    collectedEvidence: [],
    decisions: [],
    totalPoints: 0,
    maxPossiblePoints: scenario.maxPoints ?? 0,
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
        if (parsed.scenarioId === scenario.id && parsed.mode === mode) {
          return {
            ...parsed,
            maxPossiblePoints: scenario.maxPoints ?? parsed.maxPossiblePoints,
          };
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
          setGameState({
            ...parsed,
            maxPossiblePoints: scenario.maxPoints ?? parsed.maxPossiblePoints,
          });
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
      setGameState((prev) => {
        const currentTrust = prev.trustLevel ?? 50;
        const newTrust = choice.trustDelta !== undefined
          ? Math.max(0, Math.min(100, currentTrust + choice.trustDelta))
          : currentTrust;
        return {
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
              trustDelta: choice.trustDelta,
            },
          ],
          totalPoints: prev.totalPoints + choice.points,
          trustLevel: newTrust,
        };
      });
    },
    [scenario]
  );

  const completeTrainingGate = useCallback(
    (profile: TrainingProfile) => {
      setGameState((prev) => ({ ...prev, trainingProfile: profile }));
    },
    []
  );

  const completePreVisit = useCallback(
    (choiceIds: string[], finalTrust: number) => {
      setGameState((prev) => ({
        ...prev,
        preVisitComplete: true,
        preVisitChoices: choiceIds,
        trustLevel: finalTrust,
      }));
    },
    []
  );

  const completeLazloThread = useCallback(
    (tone: string, followUp: 'wait' | 'message' | 'visit') => {
      setGameState((prev) => ({
        ...prev,
        lazloThreadComplete: true,
        lazloTone: tone,
        lazloFollowUp: followUp,
      }));
    },
    []
  );

  const completeCallScene = useCallback(
    (scriptIds: string[], nextSceneId: string) => {
      setGameState((prev) => ({
        ...prev,
        callSceneComplete: true,
        callScript: scriptIds,
        currentSceneId: nextSceneId,
      }));
    },
    []
  );

  const proceedToNextScene = useCallback(() => {
    if (!lastChoice) return;
    setGameState((prev) => ({
      ...prev,
      currentSceneId: lastChoice.nextSceneId,
    }));
    setShowFeedback(false);
    setLastChoice(null);
  }, [lastChoice, scenario]);

  // Like makeChoice but skips the feedback panel and advances the scene immediately.
  // Use in self-contained scenes (e.g. GroupChatScene) that have no SceneHUD.
  const makeChoiceAndAdvance = useCallback(
    (choice: Choice, supportingEvidenceIds: string[] = []) => {
      setGameState((prev) => {
        const currentTrust = prev.trustLevel ?? 50;
        const newTrust = choice.trustDelta !== undefined
          ? Math.max(0, Math.min(100, currentTrust + choice.trustDelta))
          : currentTrust;
        return {
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
              trustDelta: choice.trustDelta,
            },
          ],
          totalPoints: prev.totalPoints + choice.points,
          trustLevel: newTrust,
          currentSceneId: choice.nextSceneId,
        };
      });
    },
    [scenario]
  );

  /** Call when the player clicks "View results" on the final scene. */
  const completeFinalScene = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isComplete: true,
      completedAt: new Date().toISOString(),
    }));
  }, []);

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
    makeChoiceAndAdvance,
    completeTrainingGate,
    completePreVisit,
    completeLazloThread,
    completeCallScene,
    proceedToNextScene,
    completeFinalScene,
    resetSimulation,
    hasSavedProgress,
    getProgress,
    getOptimalDecisionsCount,
    getSkillAreaBreakdown,
  };
}
