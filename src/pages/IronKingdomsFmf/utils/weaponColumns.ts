import type { RepeatTableColumn } from '@/components/RepeatTable'
import type { IkMeleeWeapon, IkRangedWeapon, Num, StatKey } from '../types'
import { sum } from '@/utils/sum'
import type { WeaponPresets } from './weaponPresets'

type StatLookup = (key: StatKey) => Num

/** RAT = POI (PRW for thrown weapons) + skill + attack modifier (p. 106). */
export const rangedAttack = (weapon: IkRangedWeapon, stat: StatLookup) =>
  sum(stat(weapon.attackStat || 'poi'), weapon.skill, weapon.attackMod)

/** MAT = PRW + skill + attack modifier (p. 106). */
export const meleeAttack = (weapon: IkMeleeWeapon, stat: StatLookup) => sum(stat('prw'), weapon.skill, weapon.attackMod)

/** P+S = POW + STR (p. 215); blank for a weapon without POW. */
export const meleeDamage = ({ pow }: IkMeleeWeapon, stat: StatLookup) =>
  pow === null || pow === undefined ? null : sum(pow, stat('str'))

const LOCATION: RepeatTableColumn = { key: 'location', label: 'Loc', width: '52px' }

const nameColumn = (presets?: WeaponPresets): RepeatTableColumn => ({
  key: 'name',
  label: 'Name',
  width: 'minmax(120px, 2fr)',
  suggestions: presets?.names,
  onPick: presets?.pick,
})
const ATTACK_STATS = [
  { value: 'poi', label: 'POI' },
  // Short enough for the column; the panel's note says PRW is for thrown weapons.
  { value: 'prw', label: 'PRW' },
]

/** RAT = POI (PRW for thrown weapons) + skill + attack modifier (p. 106). */
export function rangedWeaponColumns(stat: StatLookup, withLocation = false, presets?: WeaponPresets): RepeatTableColumn[] {
  return [
    nameColumn(presets),
    ...(withLocation ? [LOCATION] : []),
    { key: 'attackStat', label: 'Stat', width: '76px', type: 'select', options: ATTACK_STATS },
    { key: 'skill', label: 'Skill', width: '52px', type: 'number' },
    { key: 'attackMod', label: 'Mod', width: '52px', type: 'number' },
    {
      key: 'rat',
      label: 'RAT',
      width: '52px',
      type: 'calculated',
      calculate: (row) => rangedAttack(row as IkRangedWeapon, stat),
    },
    { key: 'rng', label: 'RNG', width: '52px' },
    { key: 'aoe', label: 'AOE', width: '52px' },
    { key: 'pow', label: 'POW', width: '52px', type: 'number' },
    { key: 'ammo', label: 'Ammo', width: '64px' },
    { key: 'notes', label: 'Notes', width: 'minmax(120px, 2fr)' },
  ]
}

/** MAT = PRW + skill + attack modifier; P+S = POW + STR (p. 106, 215). */
export function meleeWeaponColumns(stat: StatLookup, withLocation = false, presets?: WeaponPresets): RepeatTableColumn[] {
  return [
    nameColumn(presets),
    ...(withLocation ? [LOCATION] : []),
    { key: 'skill', label: 'Skill', width: '52px', type: 'number' },
    { key: 'attackMod', label: 'Mod', width: '52px', type: 'number' },
    {
      key: 'mat',
      label: 'MAT',
      width: '52px',
      type: 'calculated',
      calculate: (row) => meleeAttack(row as IkMeleeWeapon, stat),
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
  ]
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
})

export const createMeleeWeapon = (): IkMeleeWeapon & { location: string } => ({
  name: '',
  location: '',
  skill: null,
  attackMod: null,
  pow: null,
  notes: '',
})
