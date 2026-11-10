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

test('picking a chassis fills in the steamjack, and its weapons attack with the jack’s MAT', async ({ page }) => {
  await openWith(page, { identity: { name: 'Test Marshal' } });
  await page.getByRole('tab', { name: 'Steamjacks' }).click();
  await page.getByRole('button', { name: '+ Add steamjack' }).click();

  await page.getByRole('combobox', { name: 'Chassis' }).fill('Nom');
  await page.getByRole('option', { name: 'Nomad' }).click();

  await expect(page.getByLabel('Size')).toHaveValue('heavy');
  await expect(page.getByLabel('PHY', { exact: true })).toHaveValue('11');
  // MAT = PRW 5 + aurum cortex 1; DEF and ARM come from the chassis.
  await expect(box(page, 'MAT', 'Total')).toHaveValue('6');
  await expect(box(page, 'RAT', 'Total')).toHaveValue('5');
  await expect(box(page, 'DEF', 'Total')).toHaveValue('10');
  await expect(box(page, 'ARM', 'Total')).toHaveValue('18');
  await expect(page.getByText('30 boxes', { exact: false })).toBeVisible();

  await page.getByRole('button', { name: '+ Add melee weapon' }).click();
  await page.getByRole('combobox', { name: 'Name, melee weapon 1' }).fill('Battle Bl');
  await page.getByRole('option', { name: 'Battle Blade' }).click();
  await expect(page.getByLabel('MAT, melee weapon 1')).toHaveValue('6');
  await expect(page.getByLabel('P+S, melee weapon 1')).toHaveValue('17');

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});
