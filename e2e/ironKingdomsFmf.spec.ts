/* oxlint-disable max-lines -- One spec file per page (see AGENTS.md); the Iron Kingdoms page has many tabs to cover. */
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

test.describe('steamjacks', () => {
  /** Opens the sheet with these steamjacks saved, on the Steamjacks tab. */
  async function openSteamjacks(page: Page, steamjacks: unknown[] = []) {
    await openWith(page, { identity: { name: 'Test Marshal' }, steamjacks });
    await page.getByRole('tab', { name: 'Steamjacks' }).click();
  }

  async function pickChassis(page: Page, name: string) {
    await page.getByRole('combobox', { name: 'Chassis' }).fill(name.slice(0, 3));
    await page.getByRole('option', { name, exact: true }).click();
  }

  /** A stat field in the Stats panel; the Combat panel repeats some labels, such as PER. */
  const jackStat = (page: Page, label: string) =>
    page
      .locator('section')
      .filter({ has: page.getByRole('heading', { name: 'Stats', exact: true }) })
      .getByLabel(label, { exact: true });

  /** A damage grid box by its label, such as "Column 2, row 4: Left arm". */
  const cell = (page: Page, label: string) => page.getByRole('button', { name: label, exact: true });

  // The Forager's left arm boxes: its grid has two rows without boxes on top.
  const FORAGER_LEFT_ARM = ['Column 2, row 4: Left arm', 'Column 1, row 5: Left arm', 'Column 2, row 5: Left arm'];

  test('picking a chassis fills in the steamjack, and its weapons attack with the jack’s MAT', async ({ page }) => {
    await openSteamjacks(page);
    await page.getByRole('button', { name: '+ Add steamjack' }).click();
    await pickChassis(page, 'Nomad');

    await expect(page.getByLabel('Size')).toHaveValue('heavy');
    await expect(jackStat(page, 'PHY')).toHaveValue('11');
    await expect(page.getByLabel('Grade')).toHaveValue('aurum');
    // MAT = PRW 5 + aurum cortex 1; DEF and ARM come from the chassis.
    await expect(box(page, 'MAT', 'Total')).toHaveValue('6');
    await expect(box(page, 'RAT', 'Total')).toHaveValue('5');
    await expect(box(page, 'Initiative', 'Total')).toHaveValue('12');
    await expect(box(page, 'DEF', 'Total')).toHaveValue('10');
    await expect(box(page, 'ARM', 'Total')).toHaveValue('18');
    await expect(page.getByText('0 of 30 boxes damaged.')).toBeVisible();

    await page.getByRole('button', { name: '+ Add melee weapon' }).click();
    await page.getByRole('combobox', { name: 'Name, melee weapon 1' }).fill('Battle Bl');
    await page.getByRole('option', { name: 'Battle Blade' }).click();
    await expect(page.getByLabel('MAT, melee weapon 1')).toHaveValue('6');
    await expect(page.getByLabel('P+S, melee weapon 1')).toHaveValue('17');
    await expect(page.getByLabel('Notes, melee weapon 1')).toHaveValue('p. 306. Heavy only. Reach');
  });

  test('the cortex grade sets INT, PER and the MAT/RAT bonus, and advancement is capped', async ({ page }) => {
    await openSteamjacks(page, [{ name: 'Rusty', stats: { prw: 5, poi: 4, spd: 5 } }]);

    await page.getByLabel('Grade').selectOption('arcanum');
    await expect(jackStat(page, 'INT')).toHaveValue('3');
    await expect(jackStat(page, 'PER')).toHaveValue('3');
    await expect(box(page, 'MAT', 'Cortex')).toHaveValue('2');
    await expect(box(page, 'MAT', 'Total')).toHaveValue('7');
    await expect(box(page, 'RAT', 'Total')).toHaveValue('6');

    await box(page, 'MAT', 'Adv.').fill('2');
    await expect(box(page, 'MAT', 'Total')).toHaveValue('9');
    await expect(page.getByText(/allows advancement of up to 2/)).toHaveCount(0);
    await box(page, 'MAT', 'Adv.').fill('3');
    await expect(page.getByText(/allows advancement of up to 2/)).toBeVisible();
  });

  test('marking every box of a system cripples it, and the damage survives a reload', async ({ page }) => {
    await openSteamjacks(page);
    await page.getByRole('button', { name: '+ Add steamjack' }).click();
    await pickChassis(page, 'Forager');

    for (const label of FORAGER_LEFT_ARM) await cell(page, label).click();
    await expect(page.getByText('3 of 22 boxes damaged.')).toBeVisible();
    await expect(page.getByRole('status').filter({ hasText: 'Crippled left arm' })).toBeVisible();

    await page.reload();
    await page.getByRole('tab', { name: 'Steamjacks' }).click();
    await expect(cell(page, `${FORAGER_LEFT_ARM[0]}, damaged`)).toBeVisible();
    await expect(page.getByRole('status').filter({ hasText: 'Crippled left arm' })).toBeVisible();

    // Clicking a damaged box repairs it, and the system is no longer crippled.
    await cell(page, `${FORAGER_LEFT_ARM[0]}, damaged`).click();
    await expect(page.getByRole('status').filter({ hasText: 'Crippled left arm' })).toHaveCount(0);
  });

  test('picking another chassis asks before clearing marked damage', async ({ page }) => {
    await openSteamjacks(page);
    await page.getByRole('button', { name: '+ Add steamjack' }).click();
    await pickChassis(page, 'Forager');
    await cell(page, FORAGER_LEFT_ARM[0]).click();

    // Declining keeps the Forager's stats and damage; only the chassis name changes.
    page.once('dialog', (dialog) => void dialog.dismiss());
    await pickChassis(page, 'Talon');
    await expect(page.getByRole('combobox', { name: 'Chassis' })).toHaveValue('Talon');
    await expect(jackStat(page, 'PHY')).toHaveValue('7');
    await expect(page.getByText('1 of 22 boxes damaged.')).toBeVisible();

    page.once('dialog', (dialog) => void dialog.accept());
    await pickChassis(page, 'Talon');
    await expect(jackStat(page, 'PHY')).toHaveValue('8');
    await expect(page.getByText('0 of 26 boxes damaged.')).toBeVisible();
  });

  test('weapon suggestions fit the jack’s size', async ({ page }) => {
    await openSteamjacks(page);
    await page.getByRole('button', { name: '+ Add steamjack' }).click();
    await pickChassis(page, 'Talon');
    await page.getByRole('button', { name: '+ Add ranged weapon' }).click();
    const name = page.getByRole('combobox', { name: 'Name, ranged weapon 1' });

    // The Cannon is for heavy steamjacks only; the Scattershot Cannon fits any.
    await name.fill('Cann');
    await expect(page.getByRole('option', { name: 'Scattershot Cannon' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Cannon', exact: true })).toHaveCount(0);

    await name.fill('');
    await pickChassis(page, 'Nomad');
    await name.fill('Cann');
    await expect(page.getByRole('option', { name: 'Cannon', exact: true })).toBeVisible();
  });

  test('each steamjack has its own tab, and closing one asks first', async ({ page }) => {
    await openSteamjacks(page, [{ name: 'Rusty' }, { name: 'Clank' }]);
    const tabs = page.getByRole('tablist', { name: 'Steamjacks' });
    await expect(tabs.getByRole('tab', { name: 'Rusty' })).toBeVisible();

    await tabs.getByRole('tab', { name: 'Clank' }).click();
    await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Clank');

    page.once('dialog', (dialog) => void dialog.dismiss());
    await page.getByRole('button', { name: 'Close Rusty' }).click();
    await expect(tabs.getByRole('tab', { name: 'Rusty' })).toBeVisible();

    page.once('dialog', (dialog) => void dialog.accept());
    await page.getByRole('button', { name: 'Close Rusty' }).click();
    await expect(tabs.getByRole('tab', { name: 'Rusty' })).toHaveCount(0);
    await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Clank');
  });

  test('height and weight together are as wide as the name', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'phone', 'On phones each line holds one or two fields.');
    await openSteamjacks(page, [{ name: 'Rusty' }]);
    const [name, height, weight] = await Promise.all(
      ['Name', 'Height', 'Weight'].map((label) => page.getByLabel(label, { exact: true }).boundingBox()),
    );
    expect(height!.x).toBeCloseTo(name!.x, 0);
    expect(weight!.x + weight!.width).toBeCloseTo(name!.x + name!.width, 0);
  });

  test('the tab fits the screen without scrolling sideways', async ({ page }) => {
    await openSteamjacks(page);
    await page.getByRole('button', { name: '+ Add steamjack' }).click();
    await pickChassis(page, 'Nomad');
    await page.getByRole('button', { name: '+ Add ranged weapon' }).click();
    await page.getByRole('button', { name: '+ Add melee weapon' }).click();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
});
