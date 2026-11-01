import type { StatKey } from './character'

export type ExperienceLevel = 'Hero' | 'Veteran' | 'Epic'

/** The rulebooks the sheet has data from. */
export type BookId = 'core' | 'kng' | 'ua'
export type SupplementId = Exclude<BookId, 'core'>

export type RaceData = {
  name: string
  archetypes: string[]
  /** Starting value per stat; null where the race has no value (ARC is Gifted only). */
  start: Partial<Record<StatKey, number>>
  /** Hero, Veteran and Epic limits per stat; missing when the race cannot have the stat. */
  limits: Partial<Record<StatKey, [number, number, number]>>
  /** Racial DEF modifier, such as the gobber's +1. */
  defense?: number
  /** Abilities, connections and archetype benefits every character of the race starts with. */
  abilities?: string[]
  connections?: string[]
  archetypeBenefits?: string[]
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
  /** The supplement the career comes from; missing for the core rules. */
  book?: SupplementId
  page?: number
  prerequisites: string
  /** Can only be taken at character creation. */
  startingOnly?: boolean
  /** The other starting career must be one of these. */
  pairsWith?: string[]
  gold: number
  assets: string[]
  special?: string
  /** Archetype benefits the career gives a starting character, such as the Arcanist's Rune Reader. */
  archetypeBenefits?: string[]
  /** Mutually exclusive versions, such as a priest's faith or a sorcerer's element. */
  variants?: (Partial<CareerPackage> & { label: string })[]
  /** What the variant picker is called, e.g. "Faith". */
  variantLabel?: string
  /** Highest level each skill can reach in this career; `General Skills` covers all general skills. */
  maxima: Record<string, number>
  abilityList: string[]
}

/** Extra choices a supplement adds to existing careers, such as a new career ability. */
export type CareerAddition = {
  book: SupplementId
  careers: string[]
  abilityList?: string[]
  pairsWith?: string[]
}

/**
 * A kingdom version of one or two starting careers, such as the Stormguard (Man-at-Arms and
 * Stormblade). Additions go to the first career; removals apply to every listed career.
 */
export type CareerOption = {
  name: string
  book: SupplementId
  page: number
  careers: string[]
  requires: string
  pairsWith?: string[]
  add?: Partial<Omit<CareerPackage, 'skills'>> & {
    skills?: SkillGrant[]
    assets?: string[]
    abilityList?: string[]
    maxima?: Record<string, number>
  }
  remove?: { abilities?: string[]; skills?: string[]; assets?: string[]; archetypeBenefits?: string[] }
  /** Replaces the career's starting spells. */
  spells?: string[]
  /** Replaces the career's starting gold. */
  gold?: number
  note?: string
}

export type ArchetypeData = {
  name: string
  page: number
  /** What every character of the archetype gets, in short. */
  summary: string
  benefits: { name: string; page: number }[]
}

/** A rulebook weapon. Ranged weapons have `rng`; `note` holds values that depend on how it is used. */
export type WeaponData = {
  name: string
  book: BookId
  page: number
  skill: string
  mod: number | null
  pow: number | null
  rng?: string
  aoe?: string
  ammo?: string
  note?: string
}
