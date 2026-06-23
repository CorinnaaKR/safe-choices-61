import { test, expect } from '@playwright/test';

const LAZLO_STATE = JSON.stringify({
  scenarioId: 'lazlo-case',
  mode: 'learning',
  currentSceneId: 'scene-l1',
  collectedEvidence: [],
  decisions: [],
  preVisitComplete: true,
  lazloThreadComplete: true,
  lazloTone: 'lt-tone-b',
  lazloFollowUp: 'visit',
  isComplete: false,
  maxPossiblePoints: 0,
  totalPoints: 0,
});

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate((state) => {
    localStorage.setItem('heli-state:lazlo-case:learning', state);
  }, LAZLO_STATE);
  await page.goto('/story/lazlo-case?mode=learning');
  await page.waitForSelector('canvas', { timeout: 30000 });
  // Wait for scene + React state to stabilise and dev hook to register
  await page.waitForTimeout(6000);
});

test('corner HUD is hidden when evidence panel opens', async ({ page }) => {
  // Confirm corner HUD is visible before opening evidence
  const cornerHUD = page.getByText("LAZLO'S STORY");
  await expect(cornerHUD).toBeVisible();

  // Trigger evidence inspect via the dev hook (bypasses Three.js raycasting)
  await page.evaluate(() => (window as any).__heliTestInspect?.());
  await page.waitForTimeout(600);

  await page.screenshot({ path: 'tests/corner-hud-hidden.png' });

  // Corner HUD should be hidden while inspect panel is open
  const hudVisible = await cornerHUD.isVisible().catch(() => false);
  expect(hudVisible).toBe(false);
});

test('corner HUD reappears after dismissing evidence panel', async ({ page }) => {
  // Open the inspect panel
  await page.evaluate(() => (window as any).__heliTestInspect?.());
  await page.waitForTimeout(600);

  // Dismiss it
  await page.evaluate(() => (window as any).__heliTestDismiss?.());
  await page.waitForTimeout(400);

  await page.screenshot({ path: 'tests/corner-hud-restored.png' });

  const cornerHUD = page.getByText("LAZLO'S STORY");
  await expect(cornerHUD).toBeVisible();
});
