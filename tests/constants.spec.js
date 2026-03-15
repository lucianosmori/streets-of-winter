const { test, expect } = require('@playwright/test');

/**
 * Constants regression tests.
 * Verify game-balance constants have expected values.
 * If these fail, someone may have accidentally tweaked important tuning numbers.
 */

test.describe('Game Constants', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('screen dimensions correct', async ({ page }) => {
    const screenW = await page.evaluate(() => window.SCREEN_W);
    const screenH = await page.evaluate(() => window.SCREEN_H);

    expect(screenW).toBe(800);
    expect(screenH).toBe(400);
  });

  test('ground positions correct', async ({ page }) => {
    const groundTop = await page.evaluate(() => window.GROUND_TOP);
    const groundBottom = await page.evaluate(() => window.GROUND_BOTTOM);

    expect(groundTop).toBe(260);
    expect(groundBottom).toBe(365);
  });

  test('player health correct', async ({ page }) => {
    const maxHp = await page.evaluate(() => window.PLAYER_MAX_HP);
    expect(maxHp).toBe(100);
  });

  test('attack damages correct', async ({ page }) => {
    const punchDamage = await page.evaluate(() => window.ATTACKS.punch.damage);
    const kickDamage = await page.evaluate(() => window.ATTACKS.kick.damage);

    expect(punchDamage).toBe(12);
    expect(kickDamage).toBe(22);
  });

  test('attack ranges correct', async ({ page }) => {
    const punchRange = await page.evaluate(() => window.ATTACKS.punch.range);
    const kickRange = await page.evaluate(() => window.ATTACKS.kick.range);

    expect(punchRange).toBe(68);
    expect(kickRange).toBe(90);
  });

  test('special attack stats correct', async ({ page }) => {
    const specialDamage = await page.evaluate(() => window.SPECIAL_DAMAGE);
    const specialCost = await page.evaluate(() => window.SPECIAL_HP_COST);
    const specialRadius = await page.evaluate(() => window.SPECIAL_RADIUS);

    expect(specialDamage).toBe(35);
    expect(specialCost).toBe(20);
    expect(specialRadius).toBe(115);
  });

  test('knockback value correct', async ({ page }) => {
    const knockback = await page.evaluate(() => window.KNOCKBACK);
    expect(knockback).toBe(22);
  });

  test('iframes timing correct', async ({ page }) => {
    const iframes = await page.evaluate(() => window.HURT_IFRAMES);
    expect(iframes).toBe(0.45);
  });

  test('player configs exist', async ({ page }) => {
    const configs = await page.evaluate(() => window.PLAYER_CONFIGS);
    expect(Array.isArray(configs)).toBe(true);
    expect(configs.length).toBe(2);
    expect(configs[0].name).toBe('TAXPAYER');
    expect(configs[1].name).toBe('PRIYA');
  });
});
