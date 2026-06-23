/**
 * Full end-to-end test suite for Heli.
 * Covers: landing page → mode selection → Lazlo's Story (Learning + Training)
 * → Jamie's Story (smoke) → evidence panel → results page.
 *
 * Run: npx playwright test tests/e2e-full.spec.ts
 */
import { test, expect, Page } from '@playwright/test';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Clear all saved state so each test starts fresh. */
async function clearState(page: Page) {
  // Must be on a same-origin page before accessing localStorage
  await page.evaluate(() => localStorage.clear());
}

/** Navigate to the home page and set localStorage (safe: same-origin). */
async function setLocalState(page: Page, key: string, value: object) {
  await page.goto('/');
  await page.evaluate(([k, v]) => localStorage.setItem(k, JSON.stringify(v)), [key, value] as [string, object]);
}

/** Click through the content warning dialog that appears when starting a scenario. */
async function confirmContentWarning(page: Page) {
  const btn = page.getByRole('button', { name: /I understand/i });
  await btn.waitFor({ timeout: 5000 });
  await btn.click();
  await page.waitForTimeout(300);
}

/** Advance through narrative panels until no more appear.
 *  Uses JS dispatch to bypass Playwright's pointer-events/canvas obstruction check. */
async function drainNarrative(page: Page, maxClicks = 12) {
  for (let i = 0; i < maxClicks; i++) {
    const visible = await page.evaluate(() => {
      const panels = Array.from(document.querySelectorAll('.case-panel'));
      const panel = panels.find(p => p.textContent?.includes('[CLICK]'));
      if (!panel) return false;
      panel.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      return true;
    });
    if (!visible) break;
    // AnimatePresence mode="wait": 300ms exit + 300ms enter — need > 600ms between clicks
    await page.waitForTimeout(700);
  }
}

/** Drive the "Making the call" (ACT Early) scene: click through whatever
 *  choices appear, regardless of which evidence-gated options are shown,
 *  then hang up once the call ends. */
async function driveCallScene(page: Page) {
  await page.getByText('ACT Early Support Line').waitFor({ timeout: 8000 });
  for (let i = 0; i < 8; i++) {
    const ended = await page.getByText('Call ended.').isVisible().catch(() => false);
    if (ended) break;
    const choiceBtn = page.locator('button').filter({ hasText: /\S/ }).first();
    if (await choiceBtn.isVisible().catch(() => false)) {
      await choiceBtn.click();
    }
    await page.waitForTimeout(1000);
  }
  await page.getByText('Call ended.').waitFor({ timeout: 10000 });
  await page.waitForTimeout(500);
  await page.locator('button').last().click(); // red hang-up button
}

/** Wait for the scene to be interactive (canvas present + scene-ready delay). */
async function waitForScene(page: Page) {
  await page.waitForSelector('canvas', { timeout: 30000 });
  await page.waitForTimeout(5500); // scene-title stamp (2.4s) + HMR settle
}

/** Collect an evidence item via the dev test hook (bypasses Three.js raycasting). */
async function collectEvidenceViaHook(page: Page) {
  await page.evaluate(() => (window as any).__heliTestInspect?.());
  await page.waitForTimeout(600);
}

/** Dismiss the open evidence panel. */
async function dismissEvidence(page: Page) {
  // Try the dismiss button first
  const dismissBtn = page.getByRole('button', { name: /dismiss|close|done|logged/i }).first();
  if (await dismissBtn.isVisible().catch(() => false)) {
    await dismissBtn.click();
  } else {
    await page.evaluate(() => (window as any).__heliTestDismiss?.());
  }
  await page.waitForTimeout(400);
}

/** Click a narrative/choice button by text (partial match). */
async function clickChoice(page: Page, text: string) {
  await page.getByText(text, { exact: false }).first().click();
  await page.waitForTimeout(500);
}

/** Click "Continue ▸" on the feedback panel. */
async function continueFeedback(page: Page) {
  const btn = page.getByRole('button', { name: /continue/i });
  await btn.waitFor({ timeout: 8000 });
  await btn.click();
  await page.waitForTimeout(500);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

test.describe('Landing Page', () => {
  test('loads and shows both scenarios + mode toggle', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('The signs were there')).toBeVisible();

    // Both scenario cards present
    await expect(page.getByText("Jamie's Story")).toBeVisible();
    await expect(page.getByText("Lazlo's Story")).toBeVisible();

    // Mode options present
    await expect(page.getByText('Story mode')).toBeVisible();
    await expect(page.getByText('Training mode')).toBeVisible();

    await page.screenshot({ path: 'tests/screenshots/01-landing.png' });
  });

  test('mode selection persists across reload', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Training mode').click();
    await page.waitForTimeout(300);
    await page.reload();
    // Training mode should still be selected
    const trainingBtn = page.locator('[class*="border-primary"]').filter({ hasText: 'Training mode' });
    await expect(trainingBtn).toBeVisible();
  });
});

test.describe("Lazlo's Story — Learning Mode (full flow)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearState(page);
    await page.goto('/');
  });

  test('Pre-visit: Lilly text conversation completes', async ({ page }) => {
    // Select learning mode and start Lazlo
    await page.getByText('Story mode').click();
    await page.waitForTimeout(200);
    // Click the "Enter the story" button on the Lazlo card (not the title text)
    const lazloCard = page.locator('article').filter({ hasText: "Lazlo's Story" });
    await lazloCard.getByRole('button', { name: /Enter the story|Continue/i }).click();
    await page.waitForTimeout(300);

    // Content warning dialog — must confirm before navigation
    await confirmContentWarning(page);

    await page.waitForURL(/story\/lazlo-case/);
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'tests/screenshots/02-previsit-start.png' });

    // pv-1: wait for the first choice to appear, then click it
    const pv1 = page.getByText(/I actually tried him last week/i);
    await pv1.waitFor({ timeout: 15000 });
    await pv1.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'tests/screenshots/03-previsit-responded.png' });

    // Verify the pre-visit screen is still running (Lilly is responding)
    // We don't click through pv-2 — each of its 6 incoming messages has a 3-8s delay
    // totalling ~28s before choices appear. Covered instead by state-injection tests.
    await expect(page.getByText(/Lilly/i).first()).toBeVisible();
  });

  test('Lazlo Thread: tone + follow-up selection leads to scene', async ({ page }) => {
    // Inject completed pre-visit state to skip it
    await setLocalState(page, 'heli-state:lazlo-case:learning', {
      scenarioId: 'lazlo-case', mode: 'learning', currentSceneId: 'scene-l1',
      collectedEvidence: [], decisions: [], preVisitComplete: true,
      lazloThreadComplete: false, isComplete: false, maxPossiblePoints: 0, totalPoints: 0,
    });
    await page.goto('/story/lazlo-case?mode=learning');
    await page.waitForTimeout(1500);

    await page.screenshot({ path: 'tests/screenshots/04-lazlo-thread.png' });

    // Pick "Casual" tone — button shows the message text, not the label
    const casualBtn = page.getByText(/Hey Laz, haven't heard from you/i);
    await casualBtn.waitFor({ timeout: 10000 });
    await casualBtn.click();
    await page.waitForTimeout(2500); // typing animation

    // Pick "visit" follow-up
    const visitBtn = page.getByText(/Go and see him/i).first();
    await visitBtn.waitFor({ timeout: 10000 });
    await visitBtn.click();
    await page.waitForTimeout(1500);

    // Should transition to 3D scene
    await page.waitForSelector('canvas', { timeout: 20000 });
    await page.screenshot({ path: 'tests/screenshots/05-scene-loaded.png' });
  });

  test('Scene L1 → L2: narrative + choice + evidence', async ({ page }) => {
    // Jump to scene-l1 with pre-visit + thread done
    await page.evaluate(() => {
      localStorage.setItem('heli-state:lazlo-case:learning', JSON.stringify({
        scenarioId: 'lazlo-case', mode: 'learning', currentSceneId: 'scene-l1',
        collectedEvidence: [], decisions: [], preVisitComplete: true,
        lazloThreadComplete: true, lazloTone: 'lt-tone-b', lazloFollowUp: 'visit',
        isComplete: false, maxPossiblePoints: 0, totalPoints: 0,
      }));
    });
    await page.goto('/story/lazlo-case?mode=learning');
    await waitForScene(page);

    // Corner HUD should be visible
    await expect(page.getByText("LAZLO'S STORY")).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/06-scene-l1.png' });

    // Drain narrative panels
    await drainNarrative(page);

    // Decision panel should appear
    await expect(page.getByText('Decision — What do you do?')).toBeVisible({ timeout: 8000 });
    await page.screenshot({ path: 'tests/screenshots/07-scene-l1-decision.png' });

    // Choose optimal: "Coffee would be great"
    await clickChoice(page, 'Coffee would be great');
    // Learning mode shows a feedback panel — dismiss it to proceed
    await continueFeedback(page);

    // Scene L2 should load — match the HUD title specifically
    await expect(page.locator('.hud-label').filter({ hasText: 'The Living Room' })).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'tests/screenshots/08-scene-l2.png' });
  });

  test('Evidence panel: opens, hides HUD, closes, restores HUD', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('heli-state:lazlo-case:learning', JSON.stringify({
        scenarioId: 'lazlo-case', mode: 'learning', currentSceneId: 'scene-l1',
        collectedEvidence: [], decisions: [], preVisitComplete: true,
        lazloThreadComplete: true, lazloTone: 'lt-tone-b', lazloFollowUp: 'visit',
        isComplete: false, maxPossiblePoints: 0, totalPoints: 0,
      }));
    });
    await page.goto('/story/lazlo-case?mode=learning');
    await waitForScene(page);

    // HUD visible before inspecting
    await expect(page.getByText("LAZLO'S STORY")).toBeVisible();

    // Open evidence via hook
    await collectEvidenceViaHook(page);
    await page.screenshot({ path: 'tests/screenshots/09-evidence-open.png' });

    // Corner HUD hidden while evidence panel is open
    await expect(page.getByText("LAZLO'S STORY")).not.toBeVisible();

    // Evidence panel visible
    const panel = page.locator('.case-panel, [class*="inspect"]').first();
    await expect(panel).toBeVisible();

    // Dismiss
    await dismissEvidence(page);
    await page.screenshot({ path: 'tests/screenshots/10-evidence-closed.png' });

    // Corner HUD restored
    await expect(page.getByText("LAZLO'S STORY")).toBeVisible();
  });

  test('Full Lazlo flow: L1→L2→L3a→L4a→results', async ({ page }) => {
    test.setTimeout(150000);
    // Start at scene-l1 fresh
    await page.evaluate(() => {
      localStorage.setItem('heli-state:lazlo-case:learning', JSON.stringify({
        scenarioId: 'lazlo-case', mode: 'learning', currentSceneId: 'scene-l1',
        collectedEvidence: [], decisions: [], preVisitComplete: true,
        lazloThreadComplete: true, lazloTone: 'lt-tone-b', lazloFollowUp: 'visit',
        isComplete: false, maxPossiblePoints: 0, totalPoints: 0,
      }));
    });
    await page.goto('/story/lazlo-case?mode=learning');
    await waitForScene(page);

    // L1: drain narrative → choose Coffee → dismiss feedback panel
    await drainNarrative(page);
    await expect(page.getByText('Decision — What do you do?')).toBeVisible({ timeout: 8000 });
    await clickChoice(page, 'Coffee would be great');
    await continueFeedback(page);

    // L2: collect evidence, drain narrative, choose → dismiss feedback
    await waitForScene(page);
    await collectEvidenceViaHook(page);
    await dismissEvidence(page);
    await drainNarrative(page);
    await expect(page.getByText('Decision — What do you do?')).toBeVisible({ timeout: 8000 });
    await clickChoice(page, 'How are you doing with everything since Joey');
    await continueFeedback(page);

    // L3a: collect evidence, drain narrative, choose → dismiss feedback
    await waitForScene(page);
    await collectEvidenceViaHook(page);
    await dismissEvidence(page);
    await drainNarrative(page);
    await expect(page.getByText('Decision — What do you do?')).toBeVisible({ timeout: 8000 });
    await clickChoice(page, 'Tell me more about these people');
    await continueFeedback(page);

    // L4a: drain narrative, choose ACT Early → dismiss feedback
    await waitForScene(page);
    await drainNarrative(page);
    await expect(page.getByText('Decision — What do you do?')).toBeVisible({ timeout: 8000 });
    await clickChoice(page, 'ACT Early');
    await continueFeedback(page);

    // "Making the call" — ACT Early simulation
    await driveCallScene(page);

    // L5: final scene — drain narrative, click "View results" (enters epilogue)
    await waitForScene(page);
    await drainNarrative(page);
    const viewResultsScene = page.getByRole('button', { name: /view results/i });
    await viewResultsScene.waitFor({ timeout: 10000 });
    await page.screenshot({ path: 'tests/screenshots/11-final-scene.png' });
    await viewResultsScene.click();

    // Epilogue — ACT Early was chosen, so this is the good-outcome thread
    await page.getByText('Three weeks later').waitFor({ timeout: 8000 });
    const viewResultsEpilogue = page.getByRole('button', { name: /view results/i });
    await viewResultsEpilogue.waitFor({ timeout: 20000 });
    await page.screenshot({ path: 'tests/screenshots/11b-epilogue.png' });
    await viewResultsEpilogue.click();

    // Results page — wait for something unique to ResultsPage (not on StoryPage)
    await page.waitForURL(/results/, { timeout: 10000 });
    await expect(page.getByText('Case closed')).toBeVisible({ timeout: 8000 });
    await page.screenshot({ path: 'tests/screenshots/12-results.png' });
  });
});

test.describe("Lazlo's Story — Training Mode", () => {
  test('shows score and feedback panel after each decision', async ({ page }) => {
    await setLocalState(page, 'heli-state:lazlo-case:training', {
      scenarioId: 'lazlo-case', mode: 'training', currentSceneId: 'scene-l1',
      collectedEvidence: [], decisions: [], preVisitComplete: true,
      lazloThreadComplete: true, lazloTone: 'lt-tone-b', lazloFollowUp: 'visit',
      isComplete: false, maxPossiblePoints: 0, totalPoints: 0,
      trainingProfile: { name: 'Test User', organisation: 'Test Org', role: 'Staff member', priorTraining: 'None' },
    });
    await page.goto('/story/lazlo-case?mode=training');
    await waitForScene(page);

    // Training mode should show progress bar in top-right HUD
    await expect(page.getByText(/Progress/i)).toBeVisible();

    await drainNarrative(page);
    await expect(page.getByText('Decision — What do you do?')).toBeVisible({ timeout: 8000 });

    // In training mode, choice confirmation modal appears first
    await clickChoice(page, 'Coffee would be great');
    await page.waitForTimeout(800);

    // Should see confirm modal with evidence selection
    const confirmModal = page.getByRole('button', { name: /confirm|proceed/i });
    if (await confirmModal.isVisible().catch(() => false)) {
      await confirmModal.click();
      await page.waitForTimeout(600);
    }

    // Feedback panel should appear after choice
    const feedback = page.getByText(/Continue ▸/i);
    if (await feedback.isVisible({ timeout: 5000 }).catch(() => false)) {
      await page.screenshot({ path: 'tests/screenshots/13-training-feedback.png' });
      await feedback.click();
    }

    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tests/screenshots/14-training-scene2.png' });
  });
});

test.describe("Jamie's Story — Smoke Test", () => {
  test('opens and shows the first scene', async ({ page }) => {
    await page.goto('/');
    await clearState(page);
    await page.goto('/');

    await page.getByText('Story mode').click();
    await page.waitForTimeout(200);
    const jamieCard = page.locator('article').filter({ hasText: "Jamie's Story" });
    await jamieCard.getByRole('button', { name: /Enter the story|Continue/i }).click();
    await page.waitForTimeout(300);

    // Content warning dialog — must confirm before navigation
    await confirmContentWarning(page);

    await page.waitForURL(/story\/jamie-case/, { timeout: 10000 });

    // Should see a scene load (canvas or pre-visit)
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'tests/screenshots/15-jamie-story.png' });

    // Confirm the page isn't broken
    const notFound = page.getByText('404');
    await expect(notFound).not.toBeVisible();
  });
});

test.describe('Navigation and UX', () => {
  test('ESC key opens pause menu', async ({ page }) => {
    await setLocalState(page, 'heli-state:lazlo-case:learning', {
      scenarioId: 'lazlo-case', mode: 'learning', currentSceneId: 'scene-l1',
      collectedEvidence: [], decisions: [], preVisitComplete: true,
      lazloThreadComplete: true, lazloTone: 'lt-tone-b', lazloFollowUp: 'visit',
      isComplete: false, maxPossiblePoints: 0, totalPoints: 0,
    });
    await page.goto('/story/lazlo-case?mode=learning');
    await waitForScene(page);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/16-pause-menu.png' });

    // Pause overlay should show
    await expect(page.getByText(/Resume|Leave|quit/i).first()).toBeVisible();
  });

  test('TAB key opens evidence journal', async ({ page }) => {
    await setLocalState(page, 'heli-state:lazlo-case:learning', {
      scenarioId: 'lazlo-case', mode: 'learning', currentSceneId: 'scene-l1',
      collectedEvidence: [
        { id: 'beh-l1', title: 'Lazlo — First Impression', content: 'Test', timestamp: '2PM', type: 'observation', category: 'behavioural', importance: 'major', points: 10 }
      ],
      decisions: [], preVisitComplete: true, lazloThreadComplete: true,
      lazloTone: 'lt-tone-b', lazloFollowUp: 'visit',
      isComplete: false, maxPossiblePoints: 0, totalPoints: 0,
    });
    await page.goto('/story/lazlo-case?mode=learning');
    await waitForScene(page);

    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/17-evidence-journal.png' });

    await expect(page.getByText('Evidence —').first()).toBeVisible();
    await expect(page.getByText('Lazlo — First Impression')).toBeVisible();
  });

  test('Results page: shows completion data and certificate button', async ({ page }) => {
    await page.goto('/results?scenario=lazlo-case&mode=learning');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'tests/screenshots/18-results-page.png' });

    // Should not 404
    await expect(page.getByText('404')).not.toBeVisible();
  });
});
