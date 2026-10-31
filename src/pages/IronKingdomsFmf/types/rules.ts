import type { StatKey } from './character'

export type ExperienceLevel = 'Hero' | 'Veteran' | 'Epic'

export type RaceData = {
  name: string
  archetypes: string[]
  /** Starting value per stat; null where the race has no value (ARC is Gifted only). */
  start: Partial<Record<StatKey, number>>
  /** Hero, Veteran and Epic limits per stat; missing when the race cannot have the stat. */
  limits: Partial<Record<StatKey, [number, number, number]>>
  /** Racial DEF modifier, such as the gobber's +1. */
  defense?: number
  /** Abilities and connections every character of the race starts with. */
  abilities?: string[]
  connections?: string[]
  /** Short reminders of other racial rules, with page references. */
  notes: string[]
}

export type SkillGrant = { name: string; level: number }
export type SkillChoice = { choose: number; options: SkillGrant[] }

export type CareerPackage = {
  abilities: string[]
  connections: string[]
  skills: (SkillGrant | SkillChoice)[]
  spells: string[]
  /** Permanent stat bonuses that also raise the racial maximum, e.g. a stone sorcerer's +1 PHY. */
  stats?: Partial<Record<StatKey, number>>
}

export type CareerData = CareerPackage & {
  name: string
  prerequisites: string
  /** Can only be taken at character creation. */
  startingOnly?: boolean
  /** The other starting career must be one of these. */
  pairsWith?: string[]
  gold: number
  assets: string[]
  special?: string
  /** Mutually exclusive versions, such as a priest's faith or a sorcerer's element. */
  variants?: (Partial<CareerPackage> & { label: string })[]
  /** Highest level each skill can reach in this career; `General Skills` covers all general skills. */
  maxima: Record<string, number>
  abilityList: string[]
}
