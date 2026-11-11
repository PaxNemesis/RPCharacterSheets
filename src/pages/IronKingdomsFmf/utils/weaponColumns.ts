import type { RepeatTableColumn } from '@/components/RepeatTable';
import type { IkMeleeWeapon, IkRangedWeapon, Num, StatKey } from '../types';
import { sum } from '@/utils/sum';
import type { WeaponPresets } from './weaponPresets';

type StatLookup = (key: StatKey) => Num;

type ColumnOptions = {
  presets?: WeaponPresets;
  /**
   * For a steamjack: its MAT or RAT, which already includes PRW or POI and its cortex. The weapon's
   * attack is then this + bonus + mod, and the table gets a location column.
   */
  jackAttack?: Num;
  /** A character's crippled Agility: –2 on attack rolls (p. 215). */
  attackPenalty?: Num;
};

/** RAT = POI (PRW for thrown weapons) + skill + attack modifier (p. 106), with a crippled Agility's –2 (p. 215). */
export const rangedAttack = (weapon: IkRangedWeapon, stat: StatLookup, penalty: Num = null) =>
  sum(stat(weapon.attackStat || 'poi'), weapon.skill, weapon.attackMod, penalty);

/** MAT = PRW + skill + attack modifier (p. 106), with a crippled Agility's –2 (p. 215). */
export const meleeAttack = (weapon: IkMeleeWeapon, stat: StatLookup, penalty: Num = null) =>
  sum(stat('prw'), weapon.skill, weapon.attackMod, penalty);

/** P+S = POW + STR (p. 215); blank for a weapon without POW. */
export const meleeDamage = ({ pow }: IkMeleeWeapon, stat: StatLookup) =>
  pow === null || pow === undefined ? null : sum(pow, stat('str'));

const LOCATION: RepeatTableColumn = { key: 'location', label: 'Loc', width: '52px' };
const PAGE: RepeatTableColumn = { key: 'page', label: 'Page', width: '64px' };

const nameColumn = (presets?: WeaponPresets): RepeatTableColumn => ({
  key: 'name',
  label: 'Name',
  width: 'minmax(120px, 2fr)',
  suggestions: presets?.names,
  onPick: presets?.pick,
});

const ATTACK_STATS = [
  { value: 'poi', label: 'POI' },
  // Short enough for the column; the panel's note says PRW is for thrown weapons.
  { value: 'prw', label: 'PRW' },
];

/** The skill column for a character; for a steamjack, a bonus, since it attacks with its MAT or RAT. */
const skillColumn = (jack: boolean): RepeatTableColumn => ({
  key: 'skill',
  label: jack ? 'Bonus' : 'Skill',
  width: '52px',
  type: 'number',
});

/** RAT = POI (PRW for thrown weapons) + skill + attack modifier (p. 106); a steamjack's RAT + bonus + mod. */
export function rangedWeaponColumns(
  stat: StatLookup,
  { presets, jackAttack, attackPenalty = null }: ColumnOptions = {},
): RepeatTableColumn[] {
  const jack = jackAttack !== undefined;
  return [
    nameColumn(presets),
    ...(jack
      ? [LOCATION]
      : [{ key: 'attackStat', label: 'Stat', width: '76px', type: 'select', options: ATTACK_STATS } as const]),
    skillColumn(jack),
    { key: 'attackMod', label: 'Mod', width: '52px', type: 'number' },
    {
      key: 'rat',
      label: 'RAT',
      width: '52px',
      type: 'calculated',
      calculate: (row) => {
        const weapon = row as IkRangedWeapon;
        return jack ? sum(jackAttack, weapon.skill, weapon.attackMod) : rangedAttack(weapon, stat, attackPenalty);
      },
    },
    { key: 'rng', label: 'RNG', width: '52px' },
    { key: 'aoe', label: 'AOE', width: '52px' },
    { key: 'pow', label: 'POW', width: '52px', type: 'number' },
    { key: 'ammo', label: 'Ammo', width: '64px' },
    { key: 'notes', label: 'Notes', width: 'minmax(120px, 2fr)' },
    PAGE,
  ];
}

/** MAT = PRW + skill + attack modifier; P+S = POW + STR (p. 106, 215). A steamjack uses its MAT + bonus + mod. */
export function meleeWeaponColumns(
  stat: StatLookup,
  { presets, jackAttack, attackPenalty = null }: ColumnOptions = {},
): RepeatTableColumn[] {
  const jack = jackAttack !== undefined;
  return [
    nameColumn(presets),
    ...(jack ? [LOCATION] : []),
    skillColumn(jack),
    { key: 'attackMod', label: 'Mod', width: '52px', type: 'number' },
    {
      key: 'mat',
      label: 'MAT',
      width: '52px',
      type: 'calculated',
      calculate: (row) => {
        const weapon = row as IkMeleeWeapon;
        return jack ? sum(jackAttack, weapon.skill, weapon.attackMod) : meleeAttack(weapon, stat, attackPenalty);
      },
    },
    { key: 'pow', label: 'POW', width: '52px', type: 'number' },
    {
      key: 'ps',
      label: 'P+S',
      width: '52px',
      type: 'calculated',
      calculate: (row) => meleeDamage(row as IkMeleeWeapon, stat),
    },
    { key: 'notes', label: 'Notes', width: 'minmax(120px, 2fr)' },
    PAGE,
  ];
}

export const createRangedWeapon = (): IkRangedWeapon & { location: string } => ({
  name: '',
  location: '',
  attackStat: 'poi',
  skill: null,
  attackMod: null,
  rng: '',
  aoe: '',
  pow: null,
  ammo: '',
  notes: '',
  page: '',
});

export const createMeleeWeapon = (): IkMeleeWeapon & { location: string } => ({
  name: '',
  location: '',
  skill: null,
  attackMod: null,
  pow: null,
  notes: '',
  page: '',
});
