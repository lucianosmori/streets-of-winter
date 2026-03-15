const { test, expect } = require('@playwright/test');

/**
 * Smoke tests for Streets of Winter.
 * Verify page loads, canvas renders, and basic structure is intact.
 */

test.describe('Page Load & Canvas', () => {
  test('page title is correct', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Ottawa Rage — Streets of Winter');
  });

  test('canvas element exists', async ({ page }) => {
    const jsErrors = [];
    page.on('pageerror', (err) => jsErrors.push(err.message));

    await page.goto('/');

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    expect(jsErrors).toHaveLength(0);
  });

  test('no JavaScript errors on load', async ({ page }) => {
    const jsErrors = [];
    page.on('pageerror', (err) => jsErrors.push(err.message));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(jsErrors).toHaveLength(0);
  });

  test('landscape viewport hides rotate overlay', async ({ page }) => {
    await page.goto('/');

    const overlay = page.locator('#rotate-overlay');
    const display = await overlay.evaluate((el) => window.getComputedStyle(el).display);

    expect(display).toBe('none');
  });

  test('canvas is not blank (has pixel data)', async ({ page }) => {
    await page.goto('/');

    // Give the game a moment to render
    await page.waitForTimeout(500);

    const hasPixelData = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      const ctx = canvas?.getContext('2d');
      if (!ctx) return false;

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Background color is [18, 18, 28] — return true if any pixel differs
      const BG_R = 18, BG_G = 18, BG_B = 28;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] !== BG_R || data[i + 1] !== BG_G || data[i + 2] !== BG_B) {
          return true;
        }
      }
      return false;
    });

    expect(hasPixelData).toBe(true);
  });
});
