import type { StatKey } from '../types'

type SkillStat = StatKey | 'social'

// Governing stat for each skill, from the lists on pp. 172–173. Forgery and Sailing allow
// either of two stats; the first is used unless the player picks the other.
export const SKILL_STATS: Record<string, SkillStat> = {
  Archery: 'poi',
  Crossbow: 'poi',
  'Great Weapon': 'prw',
  'Hand Weapon': 'prw',
  Lance: 'prw',
  'Light Artillery': 'poi',
  Pistol: 'poi',
  Rifle: 'poi',
  Shield: 'prw',
  'Thrown Weapon': 'prw',
  'Unarmed Combat': 'prw',
  Alchemy: 'int',
  Bribery: 'social',
  Command: 'social',
  Craft: 'int',
  Cryptography: 'int',
  Deception: 'social',
  Disguise: 'int',
  'Escape Artist': 'agl',
  Etiquette: 'social',
  'Fell Calling': 'poi',
  'Forensic Science': 'int',
  Forgery: 'agl',
  Interrogation: 'int',
  Law: 'int',
  'Lock Picking': 'agl',
  'Mechanikal Engineering': 'int',
  Medicine: 'int',
  Navigation: 'per',
  Negotiation: 'social',
  Oratory: 'social',
  Pickpocket: 'agl',
  Research: 'int',
  'Rope Use': 'agl',
  Sailing: 'int',
  Seduction: 'social',
  Sneak: 'agl',
  Streetwise: 'per',
  Survival: 'per',
  Tracking: 'per',
  'Animal Handling': 'social',
  Climbing: 'agl',
  Detection: 'per',
  Driving: 'agl',
  Gambling: 'per',
  Intimidation: 'social',
  Jumping: 'phy',
  Lore: 'int',
  Riding: 'agl',
  Swimming: 'str',
}

/** Skills any character can learn, capped only by experience level (p. 119). */
export const GENERAL_SKILLS = [
  'Animal Handling',
  'Climbing',
  'Detection',
  'Driving',
  'Gambling',
  'Intimidation',
  'Jumping',
  'Lore',
  'Riding',
  'Swimming',
]

/** Skill names to suggest while typing. Craft and Lore take a specialization, e.g. "Lore (Trollkin)". */
export const SKILL_SUGGESTIONS = Object.keys(SKILL_STATS)

/** "Craft (gunsmithing)" → "Craft". */
export const baseSkillName = (name: string) => name.replace(/\s*\(.*\)\s*$/, '').trim()

export const knownSkillStat = (name: string): SkillStat | undefined => {
  const base = baseSkillName(name).toLowerCase()
  const match = Object.keys(SKILL_STATS).find((skill) => skill.toLowerCase() === base)
  return match ? SKILL_STATS[match] : undefined
}
