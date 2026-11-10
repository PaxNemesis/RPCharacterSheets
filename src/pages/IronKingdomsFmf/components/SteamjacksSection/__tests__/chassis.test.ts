import { describe, expect, it } from 'vitest';
import { CHASSIS, findChassis } from '../../../constants/chassis';
import { JACK_WEAPONS } from '../../../constants/steamjackWeapons';
import { createSteamjack } from '../../../utils/createCharacter';
import { chassisValues, gridFromRows, hasDamage } from '../utils/chassis';
import { jackCombat } from '../utils/jackCombat';

const jackFrom = (name: string) => chassisValues(findChassis(name)!, createSteamjack());

describe('chassis data', () => {
  it('has a damage grid of up to six rows of six for every chassis, with every system', () => {
    const wellFormed = (grid: string[]) =>
      grid.length <= 6 &&
      grid.every((row) => /^[.oLRMCH]{6}$/.test(row)) &&
      ['L', 'R', 'M', 'C'].every((system) => grid.join('').includes(system));
    expect(CHASSIS.filter((chassis) => !wellFormed(chassis.grid)).map((chassis) => chassis.name)).toEqual([]);
  });

  it('has DEF = SPD + AGL + PER for every chassis, as printed', () => {
    const wrong = CHASSIS.filter(({ stats, def }) => stats.spd + stats.agl + stats.per !== def);
    expect(wrong.map((chassis) => chassis.name)).toEqual([]);
  });

  it('works out the printed MAT, RAT and initiative from the stats and stock cortex', () => {
    expect(jackCombat(jackFrom('Docker'))).toMatchObject({ mat: 3, rat: 2, initiative: 8 });
    expect(jackCombat(jackFrom('Nomad'))).toMatchObject({ mat: 6, rat: 5, initiative: 12 });
    expect(jackCombat(jackFrom('Ironclad'))).toMatchObject({ mat: 7, rat: 6, initiative: 13 });
  });

  it('has unique chassis names, and weapons only for chassis that exist', () => {
    const names = CHASSIS.map((chassis) => chassis.name);
    expect(new Set(names).size).toBe(names.length);
    const forChassis = JACK_WEAPONS.flatMap((weapon) =>
      weapon.only && weapon.only !== 'light' && weapon.only !== 'heavy' ? [weapon.only] : [],
    );
    expect(forChassis.filter((name) => !findChassis(name))).toEqual([]);
  });
});

describe('picking a chassis', () => {
  it('lays a short grid out at the bottom, column by column', () => {
    const grid = gridFromRows(['oooooo', 'oLooRo', 'LLMCRR', '.MMCC.']);
    expect(grid).toHaveLength(36);
    // Column 1: two rows without boxes, then hull, hull, L and no box.
    expect(grid.slice(0, 6).map((cell) => cell.type)).toEqual(['', '', 'hull', 'hull', 'L', '']);
    expect(grid.every((cell) => !cell.damaged)).toBe(true);
  });

  it('fills in the chassis values and keeps the name, weapons and notes', () => {
    const jack = {
      ...createSteamjack(),
      name: 'Old Rusty',
      cortex: { ...createSteamjack().cortex, imprint: 'Sentinel' },
    };
    const next = chassisValues(findChassis('Talon')!, jack);
    expect(next).toMatchObject({
      name: 'Old Rusty',
      chassis: 'Talon',
      size: 'light',
      height: '9′',
      fuelLoad: '330 lbs',
    });
    expect(next.stats).toMatchObject({ phy: 8, spd: 6, prw: 5, int: 2 });
    expect(next.defense.base).toBe(12);
    expect(next.armor.base).toBe(16);
    expect(next.cortex).toMatchObject({ grade: 'aurum', imprint: 'Sentinel' });
    expect(next.grid.filter((cell) => cell.type).length).toBe(26);
  });

  it('knows when the grid has damage that a new chassis would clear', () => {
    const jack = jackFrom('Forager');
    expect(hasDamage(jack)).toBe(false);
    expect(
      hasDamage({ ...jack, grid: jack.grid.map((cell, index) => (index === 2 ? { ...cell, damaged: true } : cell)) }),
    ).toBe(true);
  });
});
