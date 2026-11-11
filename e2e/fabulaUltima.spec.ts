import { expect, test, type Page } from '@playwright/test';

const storageKey = 'rpcharactersheets:fabula-ultima';

const monk = {
  identity: { name: 'Test Monk' },
  classes: [{ name: 'Monk', skills: [{ name: 'Clarity', level: 1, notes: '' }] }],
};

/** Opens the sheet with only the given character saved in the browser, on the given tab. */
async function openWith(page: Page, data: unknown, panel = 'character') {
  await page.goto('fabula-ultima');
  const state = { version: 3, savedAt: Date.now(), activeId: 'e2e', characters: [{ id: 'e2e', data }] };
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [storageKey, JSON.stringify(state)]);
  await page.goto(`fabula-ultima/e2e?panel=${panel}`);
  await expect(page.locator('.conflict-bar-container')).toBeVisible();
}

const bar = (page: Page) => page.locator('.conflict-bar-container');

test('the conflict bar sits at the bottom of the screen, even on a short tab', async ({ page }) => {
  await openWith(page, monk, 'notes');
  const box = await bar(page).boundingBox();
  const height = page.viewportSize()?.height ?? 0;
  expect(box && Math.round(box.y + box.height)).toBeGreaterThan(height - 24);
});

test('the conflict bar never covers the end of a long tab', async ({ page }) => {
  await openWith(page, monk, 'character');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const last = page.locator('.fu-sheet-body .panel-container').last();
  const panel = await last.boundingBox();
  const barBox = await bar(page).boundingBox();
  expect(panel && barBox && panel.y + panel.height).toBeLessThanOrEqual(barBox?.y ?? 0);
});

test('a conflict and its turn survive a reload, and the Monk gains Resolve Beads', async ({ page }) => {
  await openWith(page, monk, 'soul-beads');
  await page.getByRole('button', { name: 'Start conflict' }).click();
  await page.getByRole('button', { name: 'Start turn' }).click();
  await expect(page.getByRole('group', { name: 'Core Beads: 3 of 4 marked' })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Resolve Beads: 2 of 4 marked' })).toBeVisible();

  await page.reload();
  await expect(page.getByRole('button', { name: /Turn 1/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'End turn' })).toBeVisible();
});

test('the drawer opens over the sheet without making the page scroll sideways', async ({ page }) => {
  await openWith(page, monk);
  await page.getByRole('button', { name: /No conflict/ }).click();
  const drawer = page.getByRole('region', { name: 'Conflict details' });
  await expect(drawer).toBeVisible();
  await drawer.getByRole('button', { name: 'Lose 1 HP' }).click();
  await expect(drawer.getByLabel('Current HP')).toHaveValue('40');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);

  await page.keyboard.press('Escape');
  await expect(page.getByRole('region', { name: 'Conflict details' })).toBeHidden();
});
