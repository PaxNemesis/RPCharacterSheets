import type { AspectKey, StatKey } from '../types'

export const ASPECTS: { key: AspectKey; label: string; primary: StatKey; secondary: StatKey[]; color: string }[] = [
  { key: 'physique', label: 'Physique', primary: 'phy', secondary: ['spd', 'str'], color: '#2f5e8c' },
  { key: 'agility', label: 'Agility', primary: 'agl', secondary: ['prw', 'poi'], color: '#8c2f2f' },
  { key: 'intellect', label: 'Intellect', primary: 'int', secondary: ['arc', 'per'], color: '#3f7a3a' },
]

export const STAT_LABELS: Record<StatKey, string> = {
  phy: 'PHY',
  spd: 'SPD',
  str: 'STR',
  agl: 'AGL',
  prw: 'PRW',
  poi: 'POI',
  int: 'INT',
  arc: 'ARC',
  per: 'PER',
}

export const STAT_KEYS = Object.keys(STAT_LABELS) as StatKey[]

export const SKILL_STAT_OPTIONS = [
  { value: '', label: '—' },
  ...STAT_KEYS.map((key) => ({ value: key, label: STAT_LABELS[key] })),
  { value: 'social', label: 'Social' },
]

export const CRIPPLED_EFFECTS: Record<AspectKey, string> = {
  physique: '-2 STR.',
  agility: '-2 on attack rolls.',
  intellect: '-2 DEF and cannot upkeep spells.',
}
