import { describe, it, expect } from 'vitest';
import { safeguardingScenario } from '@/data/scenario';

/**
 * Scenario graph integrity: every branch must lead somewhere real,
 * and the story must always be able to end.
 */
describe('scenario data integrity', () => {
  const sceneIds = new Set(safeguardingScenario.scenes.map((s) => s.id));

  it('has at least one scene and one final scene', () => {
    expect(safeguardingScenario.scenes.length).toBeGreaterThan(0);
    expect(safeguardingScenario.scenes.some((s) => s.isFinalScene)).toBe(true);
  });

  it('every choice points to an existing scene', () => {
    for (const scene of safeguardingScenario.scenes) {
      for (const choice of scene.choices ?? []) {
        expect(
          sceneIds.has(choice.nextSceneId),
          `choice ${choice.id} in ${scene.id} → missing scene "${choice.nextSceneId}"`
        ).toBe(true);
      }
    }
  });

  it('every non-final decision scene has choices', () => {
    for (const scene of safeguardingScenario.scenes) {
      if (scene.isDecisionPoint && !scene.isFinalScene) {
        expect(
          (scene.choices ?? []).length,
          `decision scene ${scene.id} has no choices`
        ).toBeGreaterThan(0);
      }
    }
  });

  it('evidence ids are unique across the scenario', () => {
    const ids = safeguardingScenario.scenes.flatMap(
      (s) => s.evidence?.map((e) => e.id) ?? []
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
});
