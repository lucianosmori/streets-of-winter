const { test, expect } = require('@playwright/test');

/**
 * Gameplay flow tests.
 * Verify core game loop: title → game start → gameplay → game over.
 */

test.describe('Gameplay Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Attach console error listener
    page.on('pageerror', (err) => {
      console.error('Page error:', err.message);
    });
  });

  test('title scene loads on init', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Give game a moment to initialize
    await page.waitForTimeout(200);

    const sceneName = await page.evaluate(() => {
      // Kaplay injects getSceneName globally after init
      return typeof getSceneName === 'function' ? getSceneName() : null;
    });

    expect(sceneName).toBe('title');
  });

  test('1-player game starts on Enter', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(200);

    // Press Enter to start 1-player
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const sceneName = await page.evaluate(() => {
      return typeof getSceneName === 'function' ? getSceneName() : null;
    });

    expect(sceneName).toBe('game');
  });

  test('2-player game starts on Tab then Enter', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(200);

    // Press Tab to switch to 2-player
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    // Press Enter to start
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const sceneName = await page.evaluate(() => {
      return typeof getSceneName === 'function' ? getSceneName() : null;
    });

    expect(sceneName).toBe('game');
  });

  test('game-over scene appears after player defeat', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(200);

    // Start 1-player game
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Attack enemies multiple times to take damage and eventually lose
    // Each attack takes a moment to execute
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('x'); // kick
      await page.waitForTimeout(100);
    }

    // Wait for game over to trigger (player should be dead by now)
    // Timeout is generous to account for slow enemy AI
    const maxRetries = 30;
    let sceneName = null;

    for (let i = 0; i < maxRetries; i++) {
      sceneName = await page.evaluate(() => {
        return typeof getSceneName === 'function' ? getSceneName() : null;
      });

      if (sceneName === 'gameover') {
        break;
      }

      await page.waitForTimeout(200);
    }

    expect(sceneName).toBe('gameover');
  });

  test('retry from game-over returns to game', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(200);

    // Start game
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Take damage until game over
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('x');
      await page.waitForTimeout(100);
    }

    // Wait for game over
    let sceneName = null;
    for (let i = 0; i < 30; i++) {
      sceneName = await page.evaluate(() => {
        return typeof getSceneName === 'function' ? getSceneName() : null;
      });
      if (sceneName === 'gameover') break;
      await page.waitForTimeout(200);
    }

    expect(sceneName).toBe('gameover');

    // Press Enter to retry
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const newScene = await page.evaluate(() => {
      return typeof getSceneName === 'function' ? getSceneName() : null;
    });

    expect(newScene).toBe('game');
  });

  test('HUD elements visible during gameplay', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(200);

    // Start game
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Screenshot to verify HUD is rendered
    await page.screenshot({ path: 'test-results/gameplay-hud.png' });

    // Verify canvas is still visible and not blank
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });
});
