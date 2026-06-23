import { test, expect } from '@playwright/test';

const completedState = {
  scenarioId: 'lazlo-case',
  mode: 'learning',
  currentSceneId: 'scene-l5',
  collectedEvidence: [
    { id: 'env-l2', title: 'Sons of Europa Poster', description: 'A poster on the wall', category: 'environmental', importance: 'high' },
  ],
  decisions: [
    { sceneId: 'scene-l1', choiceId: 'c-l1-2', isOptimal: true, points: 10, skillArea: 'responding', supportingEvidenceIds: [], trustDelta: 5 },
    { sceneId: 'scene-l2', choiceId: 'c-l2-1', isOptimal: true, points: 15, skillArea: 'evidence-gathering', supportingEvidenceIds: ['env-l2'], trustDelta: 0 },
    { sceneId: 'scene-l3a', choiceId: 'c-l3a-1', isOptimal: true, points: 20, skillArea: 'responding', supportingEvidenceIds: [], trustDelta: 5 },
    { sceneId: 'scene-l4a', choiceId: 'c-l4a-1', isOptimal: true, points: 25, skillArea: 'escalation', supportingEvidenceIds: [], trustDelta: 0 },
  ],
  totalPoints: 70,
  maxPossiblePoints: 70,
  isComplete: true,
  startedAt: '2026-06-15T10:00:00.000Z',
  completedAt: '2026-06-15T10:30:00.000Z',
  preVisitComplete: true,
  lazloThreadComplete: true,
  lazloTone: 'casual',
  lazloFollowUp: 'visit',
  trustLevel: 60,
};

test('Results page renders without crash with full Lazlo state', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  // Navigate first, then set localStorage
  await page.goto('http://localhost:8080/');
  await page.evaluate((state) => {
    localStorage.setItem('heli-state:lazlo-case:learning', JSON.stringify(state));
  }, completedState);

  // Navigate to results
  await page.goto('http://localhost:8080/results?scenario=lazlo-case&mode=learning');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'tests/screenshots/debug-results-full-state.png' });

  console.log('Errors:', errors);
  expect(errors.filter(e => !e.includes('favicon') && !e.includes('hot') && !e.includes('HMR'))).toHaveLength(0);

  // Check key elements render
  await expect(page.getByText('Case closed')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText("What you did — and what happened")).toBeVisible({ timeout: 5000 });
});

test('Results page: decision recap shows choices correctly', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.evaluate((state) => {
    localStorage.setItem('heli-state:lazlo-case:learning', JSON.stringify(state));
  }, completedState);

  await page.goto('http://localhost:8080/results?scenario=lazlo-case&mode=learning');
  await page.waitForTimeout(2000);

  // Check at least 1 decision row renders
  await expect(page.getByText('Decision 1 —')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('You chose:')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Because of this:')).toBeVisible({ timeout: 5000 });

  await page.screenshot({ path: 'tests/screenshots/debug-results-decisions.png' });
});

test('Story L5 final scene: View results button appears', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));

  const stateAtL5 = { ...completedState, isComplete: false, currentSceneId: 'scene-l5' };

  await page.goto('http://localhost:8080/');
  await page.evaluate((state) => {
    localStorage.setItem('heli-state:lazlo-case:learning', JSON.stringify(state));
  }, stateAtL5);

  await page.goto('http://localhost:8080/story/lazlo-case?mode=learning');
  await page.waitForTimeout(3500); // Wait for scene stamp + sceneReady timer

  // Click through all 5 narrative panels
  for (let i = 0; i < 5; i++) {
    await page.mouse.click(640, 400);
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'tests/screenshots/debug-l5-before-complete.png' });

  // "View results" button should appear
  const viewResultsBtn = page.getByText('View results');
  await expect(viewResultsBtn).toBeVisible({ timeout: 5000 });

  // Click it and check navigation to results
  await viewResultsBtn.click();
  await page.waitForURL(/results/, { timeout: 5000 });

  await page.screenshot({ path: 'tests/screenshots/debug-l5-after-complete.png' });

  console.log('Errors after complete:', errors);
  expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
});
