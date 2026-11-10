import { expect, test, type Page } from '@playwright/test';

const storageKey = 'rpcharactersheets:iron-kingdoms-fmf';

// A dwarf in plate armor (SPD −2, DEF −2) with Load Bearing, which lessens both penalties by 1.
const dwarf = {
  identity: { name: 'Test Dwarf', race: 'Dwarf' },
  stats: {
    phy: { value: 6, max: null },
    spd: { value: 4, max: null },
    str: { value: 5, max: null },
    agl: { value: 3, max: null },
    prw: { value: 4, max: null },
    poi: { value: 3, max: null },
    int: { value: 4, max: null },
    per: { value: 3, max: null },
  },
  armor: [{ name: 'Plate', spd: -2, def: -2, arm: 7, notes: '' }],
  abilities: [{ name: 'Load Bearing', description: '', page: '' }],
};

/** Opens the sheet with only the given character saved in the browser. */
async function openWith(page: Page, data: unknown) {
  await page.goto('iron-kingdoms-fmf');
  const state = { version: 3, savedAt: Date.now(), activeId: 'e2e', characters: [{ id: 'e2e', data }] };
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [storageKey, JSON.stringify(state)]);
  await page.reload();
}

const row = (page: Page, title: string) => page.getByRole('group', { name: title, exact: true });
const box = (page: Page, title: string, label: string) => row(page, title).getByLabel(label, { exact: true });

test('armor SPD lowers movement but not DEF or initiative', async ({ page }) => {
  await openWith(page, dwarf);

  await expect(box(page, 'Movement SPD', 'Armor')).toHaveValue('-1');
  await expect(box(page, 'Movement SPD', 'Total')).toHaveValue('3');
  // DEF = SPD 4 + AGL 3 + PER 3 + armor −1; the armor's SPD doesn't count.
  await expect(box(page, 'DEF', 'SPD')).toHaveValue('4');
  await expect(box(page, 'DEF', 'Armor')).toHaveValue('-1');
  await expect(box(page, 'DEF', 'Total')).toHaveValue('9');
  await expect(box(page, 'Initiative', 'Total')).toHaveValue('11');
});

test('misc modifiers add to movement and willpower and survive a reload', async ({ page }) => {
  await openWith(page, dwarf);

  await box(page, 'Movement SPD', 'Other').fill('2');
  await box(page, 'Willpower', 'Other').fill('1');
  await expect(box(page, 'Movement SPD', 'Total')).toHaveValue('5');
  await expect(box(page, 'Willpower', 'Total')).toHaveValue('11');

  // Reload at once: changes not yet autosaved are saved when the page closes.
  await page.reload();
  await expect(box(page, 'Movement SPD', 'Total')).toHaveValue('5');
  await expect(box(page, 'Willpower', 'Total')).toHaveValue('11');
});

test('the sheet fits the screen without scrolling sideways', async ({ page }) => {
  await openWith(page, dwarf);
  await expect(row(page, 'Movement SPD')).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});
