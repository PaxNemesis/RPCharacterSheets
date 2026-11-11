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

test('the conflict bar meets the bottom of the screen on a short tab and at the end of a long one', async ({
  page,
}) => {
  const height = page.viewportSize()?.height ?? 0;
  const bottom = async () => {
    const box = await bar(page).boundingBox();
    return box && Math.round(box.y + box.height);
  };

  await openWith(page, monk, 'notes');
  expect(await bottom()).toBe(height);

  await openWith(page, monk, 'character');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  expect(await bottom()).toBe(height);
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
  await expect(page.locator('.bar-row-state')).toHaveText(/Turn 1$/);
  await expect(page.getByRole('button', { name: 'End turn' })).toBeVisible();
});

test('the drawer opens under the bar, and damage is typed into a popup', async ({ page }) => {
  await openWith(page, monk);
  const drawer = page.getByRole('region', { name: 'Conflict details' });
  await expect(drawer).toBeHidden();
  await page.getByRole('button', { name: 'Show conflict details' }).click();
  await expect(drawer).toBeVisible();

  await drawer.getByRole('button', { name: 'Damage' }).click();
  await page.getByRole('dialog', { name: 'Damage to HP' }).getByRole('spinbutton').fill('5');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('img', { name: 'HP 36 of 41' }).first()).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);

  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
});

test('opening the drawer covers the page without moving it', async ({ page }) => {
  await openWith(page, monk, 'character');
  const panel = page.getByRole('heading', { name: 'Attributes & status effects' });
  const before = await panel.boundingBox();
  await page.getByRole('button', { name: 'Show conflict details' }).click();
  await expect(page.getByRole('region', { name: 'Conflict details' })).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  expect((await panel.boundingBox())?.y).toBe(before?.y);
});

test('the HP, MP and IP panel takes damage and healing from its − and + buttons', async ({ page }) => {
  await openWith(page, monk, 'character');
  const panel = page.locator('.points-panel-container');
  await panel.getByRole('button', { name: 'Damage' }).click();
  await page.getByRole('dialog', { name: 'Damage to HP' }).getByRole('spinbutton').fill('5');
  await page.keyboard.press('Enter');
  await expect(panel.getByLabel('Current HP')).toHaveValue('36');

  await panel.getByRole('button', { name: 'Use' }).click();
  await page.keyboard.press('Enter');
  await expect(panel.getByLabel('Current IP')).toHaveValue('3');
});
