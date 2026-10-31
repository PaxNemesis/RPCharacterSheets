import type { RepeatTableColumn } from '@/components/RepeatTable'
import type { IkMeleeWeapon, IkRangedWeapon, Num, StatKey } from '../types'
import { sum } from './sum'

type StatLookup = (key: StatKey) => Num

const LOCATION: RepeatTableColumn = { key: 'location', label: 'Loc', width: '52px' }
const ATTACK_STATS = [
  { value: 'poi', label: 'POI' },
  { value: 'prw', label: 'PRW (thrown)' },
]

/** RAT = POI (PRW for thrown weapons) + skill + attack modifier (p. 106). */
export function rangedWeaponColumns(stat: StatLookup, withLocation = false): RepeatTableColumn[] {
  return [
    { key: 'name', label: 'Name', width: 'minmax(120px, 2fr)' },
    ...(withLocation ? [LOCATION] : []),
    { key: 'attackStat', label: 'Stat', width: '76px', type: 'select', options: ATTACK_STATS },
    { key: 'skill', label: 'Skill', width: '52px', type: 'number' },
    { key: 'attackMod', label: 'Mod', width: '52px', type: 'number' },
    {
      key: 'rat',
      label: 'RAT',
      width: '52px',
      type: 'calculated',
      calculate: (row) => {
        const weapon = row as IkRangedWeapon
        return sum(stat(weapon.attackStat || 'poi'), weapon.skill, weapon.attackMod)
      },
    },
    { key: 'rng', label: 'RNG', width: '52px' },
    { key: 'aoe', label: 'AOE', width: '52px' },
    { key: 'pow', label: 'POW', width: '52px', type: 'number' },
    { key: 'ammo', label: 'Ammo', width: '64px' },
    { key: 'notes', label: 'Notes', width: 'minmax(120px, 2fr)' },
  ]
}

/** MAT = PRW + skill + attack modifier; P+S = POW + STR (p. 106, 215). */
export function meleeWeaponColumns(stat: StatLookup, withLocation = false): RepeatTableColumn[] {
  return [
    { key: 'name', label: 'Name', width: 'minmax(120px, 2fr)' },
    ...(withLocation ? [LOCATION] : []),
    { key: 'skill', label: 'Skill', width: '52px', type: 'number' },
    { key: 'attackMod', label: 'Mod', width: '52px', type: 'number' },
    {
      key: 'mat',
      label: 'MAT',
      width: '52px',
      type: 'calculated',
      calculate: (row) => {
        const weapon = row as IkMeleeWeapon
        return sum(stat('prw'), weapon.skill, weapon.attackMod)
      },
    },
    { key: 'pow', label: 'POW', width: '52px', type: 'number' },
    {
      key: 'ps',
      label: 'P+S',
      width: '52px',
      type: 'calculated',
      calculate: (row) => {
        const { pow } = row as IkMeleeWeapon
        return pow === null || pow === undefined ? null : sum(pow, stat('str'))
      },
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
