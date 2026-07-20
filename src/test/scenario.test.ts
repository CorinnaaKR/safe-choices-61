import { describe, it, expect } from 'vitest';
import { listScenarios } from '@/data/scenarios';

/**
 * Scenario graph integrity, run over every registered scenario:
 * every branch must lead somewhere real and every story must end.
 */
describe('scenario registry integrity', () => {
  const playable = listScenarios().filter((s) => s.status !== 'in-development');

  it('registry has at least one playable scenario', () => {
    expect(playable.length).toBeGreaterThan(0);
  });

  for (const scenario of playable) {
    describe(scenario.title, () => {
      const sceneIds = new Set(scenario.scenes.map((s) => s.id));
      // 'scene-call' is a hardcoded sentinel (see StoryPage.tsx) that hands off to the
      // scripted CallScene component rather than a real registered scene — valid only
      // when the scenario actually defines a callScene to hand off to.
      const isValidTarget = (nextSceneId: string) =>
        sceneIds.has(nextSceneId) || (nextSceneId === 'scene-call' && !!scenario.callScene);
      // Scoring (evidence points, choice skill areas) only applies to scenarios that
      // support Training mode — see Mode / supportedModes in types/simulation.ts.
      const supportsTraining =
        !scenario.supportedModes || scenario.supportedModes.includes('training');

      it('has at least one scene and one final scene', () => {
        expect(scenario.scenes.length).toBeGreaterThan(0);
        expect(scenario.scenes.some((s) => s.isFinalScene)).toBe(true);
      });

      it('every choice points to an existing scene', () => {
        for (const scene of scenario.scenes) {
          for (const choice of scene.choices ?? []) {
            expect(
              isValidTarget(choice.nextSceneId),
              `choice ${choice.id} in ${scene.id} -> missing scene "${choice.nextSceneId}"`
            ).toBe(true);
          }
        }
      });

      it('every non-final decision scene has choices', () => {
        for (const scene of scenario.scenes) {
          if (scene.isDecisionPoint && !scene.isFinalScene) {
            expect(
              (scene.choices ?? []).length,
              `decision scene ${scene.id} has no choices`
            ).toBeGreaterThan(0);
          }
        }
      });

      it('evidence ids are unique', () => {
        const ids = scenario.scenes.flatMap((s) => s.evidence?.map((e) => e.id) ?? []);
        expect(new Set(ids).size).toBe(ids.length);
      });

      it('every scene declares an environment', () => {
        for (const scene of scenario.scenes) {
          expect(scene.environment, `scene ${scene.id} has no environment`).toBeTruthy();
        }
      });

      it('all evidence carries category and importance', () => {
        for (const scene of scenario.scenes) {
          for (const ev of scene.evidence ?? []) {
            expect(ev.category, `evidence ${ev.id} missing category`).toBeTruthy();
            expect(ev.importance, `evidence ${ev.id} missing importance`).toBeTruthy();
          }
        }
      });

      it.skipIf(!supportsTraining)('all evidence carries points (training-mode scenarios)', () => {
        for (const scene of scenario.scenes) {
          for (const ev of scene.evidence ?? []) {
            expect(ev.points, `evidence ${ev.id} missing points`).toBeGreaterThan(0);
          }
        }
      });

      it.skipIf(!supportsTraining)('all choices carry a skill area (training-mode scenarios)', () => {
        for (const scene of scenario.scenes) {
          for (const choice of scene.choices ?? []) {
            expect(choice.skillArea, `choice ${choice.id} missing skillArea`).toBeTruthy();
          }
        }
      });
    });
  }
});
