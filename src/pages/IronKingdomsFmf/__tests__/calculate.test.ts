import { describe, expect, it } from 'vitest';
import { calculate } from '../utils/calculate';
import { character, statsWith } from './character';

const hero = character({
  identity: { race: 'Human' },
  stats: statsWith({ phy: 7, spd: 6, str: 4, agl: 5, prw: 4, poi: 4, int: 4, per: 3 }),
});

describe('calculate', () => {
  it('splits each aspect’s vitality over its two branches, the odd point on the first', () => {
    const derived = calculate(hero);
    expect(derived.branchSizes).toEqual([4, 3, 3, 2, 2, 2]);
    expect(derived.vitality).toBe(16);
  });

  it('works out DEF, ARM, initiative and willpower from stats, armor and modifiers (p. 106)', () => {
    const armored = {
      ...hero,
      armor: [{ name: 'Plate', spd: -2, def: -2, arm: 7, notes: '', page: '' }],
      modifiers: { ...hero.modifiers, defense: 1, initiative: 2 },
    };
    const derived = calculate(armored);
    expect(derived.defense).toBe(6 + 5 + 3 - 2 + 1);
    expect(derived.armor).toBe(7 + 7);
    expect(derived.initiative).toBe(6 + 4 + 3 + 2);
    expect(derived.willpower).toBe(7 + 4);
  });

  it('leaves DEF and initiative alone for armor’s SPD modifier, which changes only SPD (pp. 106, 251)', () => {
    const plate = (spd: number) =>
      calculate({ ...hero, armor: [{ name: 'Plate', spd, def: -2, arm: 7, notes: '', page: '' }] });
    expect(plate(-2).defense).toBe(plate(0).defense);
    expect(plate(-2).initiative).toBe(plate(0).initiative);
    expect(plate(-2)).toMatchObject({ armorSpeed: -2, speed: 4 });
  });

  it('adds the other SPD and Willpower modifiers to movement SPD and Willpower', () => {
    const modified = { ...hero, modifiers: { ...hero.modifiers, speed: 1, willpower: 2 } };
    expect(calculate(modified)).toMatchObject({ speed: 7, willpower: 7 + 4 + 2, defense: calculate(hero).defense });
  });

  it('leaves movement SPD blank while SPD is blank', () => {
    const armored = { ...character(), armor: [{ name: 'Plate', spd: -2, def: -2, arm: 7, notes: '', page: '' }] };
    expect(calculate(armored).speed).toBeNull();
  });

  it('reduces armor’s SPD and DEF penalties by 1 with Load Bearing, but never into a bonus (p. 164)', () => {
    const wearing = (spd: number, def: number, abilities = [{ name: ' load bearing', description: '', page: '' }]) =>
      calculate({ ...hero, abilities, armor: [{ name: 'Armor', spd, def, arm: 5, notes: '', page: '' }] });
    expect(wearing(-2, -2)).toMatchObject({
      loadBearing: true,
      armorSpeed: -1,
      armorDefense: -1,
      speed: 5,
      defense: 6 + 5 + 3 - 1,
    });
    expect(wearing(0, 0)).toMatchObject({ armorSpeed: 0, armorDefense: 0 });
    expect(wearing(-2, -2, [])).toMatchObject({ loadBearing: false, armorSpeed: -2, armorDefense: -2 });
  });

  it('adds the race’s DEF bonus with race rules on', () => {
    const gobber = { ...hero, identity: { ...hero.identity, race: 'Gobber' } };
    expect(calculate(gobber).racialDefense).toBe(1);
    expect(calculate(gobber).defense).toBe(calculate(hero).defense! + 1);
  });

  it('leaves totals blank when none of their stats are filled in', () => {
    const derived = calculate(character());
    expect(derived.defense).toBeNull();
    expect(derived.willpower).toBeNull();
    expect(derived.spellLimit).toBeNull();
    expect(derived.vitality).toBe(0);
  });

  it('knows twice INT spells and a command range of INT plus the Command skill (pp. 106, 118)', () => {
    const commander = { ...hero, skills: [{ name: 'Command', stat: 'social' as const, level: 2, page: '' }] };
    expect(calculate(commander).spellLimit).toBe(8);
    expect(calculate(commander).commandRange).toBe(6);
  });

  it('cripples an aspect once both of its branches are full', () => {
    const hurt = (marked: number[]) => calculate({ ...hero, damage: { marked, notes: '' } }).crippled;
    expect(hurt([4, 2, 0, 0, 0, 0])).toEqual([]);
    expect(hurt([4, 3, 0, 0, 0, 0])).toEqual(['physique']);
    expect(hurt([0, 0, 3, 2, 2, 2])).toEqual(['agility', 'intellect']);
  });

  it('applies each crippled aspect’s penalty where it counts (p. 215)', () => {
    const hurt = (marked: number[]) => calculate({ ...hero, damage: { marked, notes: '' } });
    const whole = hurt([0, 0, 0, 0, 0, 0]);
    expect([whole.strengthPenalty, whole.attackPenalty, whole.defensePenalty]).toEqual([null, null, null]);

    // Physique: –2 STR, but the stat as typed still counts for its maximum.
    const weak = hurt([4, 3, 0, 0, 0, 0]);
    expect(weak.stat('str')).toBe(2);
    expect(weak.stat('phy')).toBe(7);
    // Agility: –2 on attack rolls, for the weapons to add.
    expect(hurt([0, 0, 3, 2, 0, 0]).attackPenalty).toBe(-2);
    // Intellect: –2 DEF.
    const dazed = hurt([0, 0, 0, 0, 2, 2]);
    expect(dazed.defensePenalty).toBe(-2);
    expect(dazed.defense).toBe(whole.defense! - 2);
  });

  it('flags stats above their maximum', () => {
    const strong = { ...hero, stats: { ...hero.stats, str: { value: 7, max: null } } };
    expect(calculate(strong).overMax).toEqual(['str']);
  });
});
