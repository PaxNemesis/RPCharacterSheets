import type { RepeatTableRow } from '@/components/RepeatTable';
import { bookEnabled, bookRef } from '../constants/books';
import { MELEE_WEAPONS, RANGED_WEAPONS } from '../constants/weapons';
import type { IkCharacter, IkMeleeWeapon, IkRangedWeapon, Num, WeaponData } from '../types';
import { compareNames } from '@/utils/alphabetical';

/** Rulebook weapons to suggest by name, and how to fill a row when one is picked. */
export type WeaponPresets = {
  names: string[];
  pick: (name: string, row: RepeatTableRow) => RepeatTableRow;
};

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** "Rifle", plus any one-handed or mounted values; the page has a column of its own. */
const describe = (weapon: WeaponData) => [weapon.skill, weapon.note].filter(Boolean).join('. ');

function presets(
  character: Pick<IkCharacter, 'settings' | 'skills'>,
  weapons: WeaponData[],
  fill: (weapon: WeaponData, skill: Num) => RepeatTableRow,
): WeaponPresets {
  const available = weapons.filter((weapon) => bookEnabled(character.settings, weapon.book));
  const skillLevel = (skill: string) => character.skills.find((row) => same(row.name ?? '', skill))?.level ?? null;
  return {
    names: available.map((weapon) => weapon.name).sort(compareNames),
    pick: (name, row) => {
      const weapon = available.find((w) => same(w.name, name));
      return weapon ? { ...row, ...fill(weapon, skillLevel(weapon.skill)) } : row;
    },
  };
}

export const rangedPresets = (character: Pick<IkCharacter, 'settings' | 'skills'>) =>
  presets(character, RANGED_WEAPONS, (weapon, skill): Partial<IkRangedWeapon> => ({
    name: weapon.name,
    attackStat: weapon.skill === 'Thrown Weapon' ? 'prw' : 'poi',
    skill,
    attackMod: weapon.mod,
    rng: weapon.rng ?? '',
    aoe: weapon.aoe ?? '',
    pow: weapon.pow,
    ammo: weapon.ammo ?? '',
    notes: describe(weapon),
    page: bookRef(weapon.book, weapon.page),
  }));

export const meleePresets = (character: Pick<IkCharacter, 'settings' | 'skills'>) =>
  presets(character, MELEE_WEAPONS, (weapon, skill): Partial<IkMeleeWeapon> => ({
    name: weapon.name,
    skill,
    attackMod: weapon.mod,
    pow: weapon.pow,
    notes: describe(weapon),
    page: bookRef(weapon.book, weapon.page),
  }));
