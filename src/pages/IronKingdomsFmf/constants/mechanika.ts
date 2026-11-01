import type { CapacitorData, MechanikaType, RuneData } from '../types'

/** A runeplate holds up to five rune points of runes, all of one type (p. 284). */
export const MAX_RUNE_POINTS = 5

export const MECHANIKA_TYPES: { value: MechanikaType; label: string }[] = [
  { value: 'armor', label: 'Armor' },
  { value: 'melee', label: 'Melee weapon' },
  { value: 'ranged', label: 'Ranged weapon' },
  { value: 'other', label: 'Other device' },
]

// Core rules pp. 282–283. The supplements add dedicated devices but no new capacitors.
export const CAPACITORS: CapacitorData[] = [
  { name: 'Alchemical Capacitor', page: 282, power: 3, lifespan: '1 week' },
  { name: 'Arcane Turbine', page: 282, power: 8, lifespan: '6 hours at a time, with coal and water' },
  { name: 'Arcanodynamic Accumulator', page: 283, power: 4, lifespan: '1 month' },
  { name: 'Clockwork Capacitor', page: 283, power: 3, lifespan: '1 day, rechargeable' },
  { name: 'Storm Chamber', page: 283, power: 5, lifespan: '1 year' },
]

const WEAPON: MechanikaType[] = ['melee', 'ranged']

// Core rules pp. 284–286. The supplements' mechanika comes with dedicated runeplates instead.
export const RUNES: RuneData[] = [
  { name: 'Accuracy', page: 284, types: WEAPON, points: 1 },
  { name: 'Aegis', page: 284, types: ['armor'], points: 1 },
  { name: 'Arcane Force', page: 284, types: ['melee'], points: 3 },
  { name: 'Balefire', page: 285, types: ['melee'], points: 1 },
  { name: 'Blast', page: 285, types: ['ranged'], points: 2, note: 'Firearms only' },
  { name: 'Blessed', page: 285, types: WEAPON, points: 2 },
  { name: 'Bond Plate', page: 285, types: WEAPON, points: 2 },
  { name: 'Cold', page: 285, types: ['melee'], points: 2 },
  { name: 'Compensator', page: 285, types: ['armor'], points: 1 },
  { name: 'Corruption', page: 285, types: WEAPON, points: 1 },
  { name: 'Disbinder', page: 285, types: ['melee'], points: 2 },
  { name: 'Electrocutioner', page: 285, types: ['melee'], points: 3 },
  { name: 'Flame', page: 285, types: ['melee'], points: 2 },
  { name: 'Fleet', page: 285, types: ['armor'], points: 3 },
  { name: 'Grievous Wounds', page: 285, types: ['melee'], points: 2 },
  { name: 'Halo of Fire', page: 285, types: ['armor', 'melee'], points: 2, note: 'As a melee rune, shields only' },
  { name: 'Heightened Strength', page: 286, types: ['armor'], points: 2 },
  { name: 'Light', page: 286, types: ['melee', 'ranged', 'armor'], points: 1 },
  { name: 'Mechanikal Seizure', page: 286, types: ['melee'], points: 2 },
  { name: 'Quicken', page: 286, types: ['armor'], points: 2 },
  { name: 'Repulsor', page: 286, types: ['melee'], points: 2, note: 'Shields only' },
  { name: 'Silencer', page: 286, types: ['ranged'], points: 1, note: 'Firearms only' },
  { name: 'Spell Ward', page: 286, types: ['armor'], points: 3 },
  { name: 'Stall', page: 286, types: ['melee'], points: 3 },
  { name: 'Steady', page: 286, types: ['armor'], points: 1 },
]

const base = (name: string) => name.replace(/\s*\(.*\)\s*$/, '').trim().toLowerCase()

/** "Clockwork capacitor (80gc)" finds the Clockwork Capacitor. */
export const findCapacitor = (name: string) => CAPACITORS.find((capacitor) => capacitor.name.toLowerCase() === base(name))
export const findRune = (name: string) => RUNES.find((rune) => rune.name.toLowerCase() === base(name))
