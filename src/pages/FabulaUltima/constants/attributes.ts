import type { AttributeKey, Discipline, MartialKey, StatusKey } from '../types'

export const ATTRIBUTE_KEYS: AttributeKey[] = ['dex', 'ins', 'mig', 'wlp']

export const ATTRIBUTES: Record<AttributeKey, { short: string; label: string }> = {
  dex: { short: 'DEX', label: 'Dexterity' },
  ins: { short: 'INS', label: 'Insight' },
  mig: { short: 'MIG', label: 'Might' },
  wlp: { short: 'WLP', label: 'Willpower' },
}

export const DICE = [6, 8, 10, 12]

/** Starting attribute spreads (p. 162). */
export const STARTING_SPREADS = ['d8 d8 d8 d8', 'd10 d8 d8 d6', 'd10 d10 d6 d6']

/** Each status effect lowers these attributes by one die size, to a minimum of d6 (p. 94). */
export const STATUSES: { key: StatusKey; label: string; attributes: AttributeKey[] }[] = [
  { key: 'slow', label: 'Slow', attributes: ['dex'] },
  { key: 'dazed', label: 'Dazed', attributes: ['ins'] },
  { key: 'weak', label: 'Weak', attributes: ['mig'] },
  { key: 'shaken', label: 'Shaken', attributes: ['wlp'] },
  { key: 'enraged', label: 'Enraged', attributes: ['dex', 'ins'] },
  { key: 'poisoned', label: 'Poisoned', attributes: ['mig', 'wlp'] },
]

export const MARTIAL: { key: MartialKey; label: string }[] = [
  { key: 'armor', label: 'Martial armor' },
  { key: 'shields', label: 'Martial shields' },
  { key: 'melee', label: 'Martial melee weapons' },
  { key: 'ranged', label: 'Martial ranged weapons' },
]

export const DISCIPLINES: { key: Discipline; label: string }[] = [
  { key: 'arcanism', label: 'Arcanism' },
  { key: 'chimerism', label: 'Chimerism' },
  { key: 'elementalism', label: 'Elementalism' },
  { key: 'entropism', label: 'Entropism' },
  { key: 'illusionism', label: 'Illusionism' },
  { key: 'ritualism', label: 'Ritualism' },
  { key: 'spiritism', label: 'Spiritism' },
]
