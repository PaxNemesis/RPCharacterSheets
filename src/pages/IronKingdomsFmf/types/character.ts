/* oxlint-disable max-lines -- The whole saved character in one place, so it can be compared with createCharacter at a glance. */
import type { SupplementId } from './rules'

export type Num = number | null

export type StatKey = 'phy' | 'spd' | 'str' | 'agl' | 'prw' | 'poi' | 'int' | 'arc' | 'per'
export type AspectKey = 'physique' | 'agility' | 'intellect'
export type JackStatKey = Exclude<StatKey, 'arc'>

export type IkSettings = {
  /** Use the core rulebook races for archetypes, starting stats and stat maximums. */
  raceRules: boolean
  /** Use the rulebook careers for starting packages and skill maximums. */
  careerRules: boolean
  magic: boolean
  mechanika: boolean
  steamjacks: boolean
  powerField: boolean
  /** Supplements whose careers, options and abilities the sheet offers. */
  books: Record<SupplementId, boolean>
}

export type IkIdentity = {
  name: string
  player: string
  race: string
  archetype: string
  /** Free-text careers, used when career rules are off. */
  careers: string
  /** Rulebook careers, used when career rules are on; the first two are the starting careers. */
  careerList: string[]
  /** Chosen version per career, e.g. { Sorcerer: 'Stone' }. */
  careerVariants: Record<string, string>
  /** Picks for the starting package's "choose one of…" skills, keyed by career and choice. */
  careerChoices: Record<string, string[]>
  /** Chosen kingdom career options, such as "Stormguard". */
  careerOptions: string[]
  /** A human's Exceptional Potential: +1 to PHY, AGL or INT. */
  humanBonus: '' | 'phy' | 'agl' | 'int'
  level: string
  xp: Num
  sex: string
  faith: string
  defining: string
  height: string
  weight: string
  age: string
  eyesHair: string
}

export type IkRangedWeapon = {
  name: string
  attackStat: 'poi' | 'prw'
  skill: Num
  attackMod: Num
  rng: string
  aoe: string
  pow: Num
  ammo: string
  notes: string
}

export type IkMeleeWeapon = {
  name: string
  skill: Num
  attackMod: Num
  pow: Num
  notes: string
}

export type IkSkill = { name: string; stat: StatKey | 'social' | ''; level: Num; page: string }
export type IkEntry = { name: string; description: string; page: string }
export type IkGear = { name: string; notes: string; quantity: Num }
export type IkArmor = { name: string; spd: Num; def: Num; arm: Num; notes: string }
export type IkSpell = {
  name: string
  cost: Num
  rng: string
  aoe: string
  pow: Num
  up: string
  off: string
  page: string
  description: string
}
export type MechanikaType = 'armor' | 'melee' | 'ranged' | 'other'
export type IkRune = { name: string; points: Num; page: string; notes: string }

/** A mechanikal device: housing, capacitor and one runeplate (pp. 279–286). */
export type IkMechanika = {
  name: string
  type: MechanikaType | ''
  housing: string
  capacitor: string
  power: Num
  lifespan: string
  runes: IkRune[]
  notes: string
}

export type JackGridCell = {
  /** '' = no box, 'hull' = plain box, or a system letter such as 'L' or 'C'. */
  type: string
  damaged: boolean
}

export type IkSteamjack = {
  name: string
  chassis: string
  height: string
  weight: string
  fuelLoad: string
  fuelUse: string
  image: string
  stats: Record<JackStatKey, Num>
  defense: { base: Num; mod: Num }
  armor: { base: Num; mod: Num }
  /** 36 cells, column by column (6 columns of 6). */
  grid: JackGridCell[]
  cortex: { imprint: string; fightingBonus: string; language: string; notes: string }
  rangedWeapons: (IkRangedWeapon & { location: string })[]
  meleeWeapons: (IkMeleeWeapon & { location: string })[]
  catastrophic: { area: string; notes: string }[]
  gear: { name: string; notes: string }[]
  powerAttacks: { name: string; description: string }[]
}

export type IkCharacter = {
  settings: IkSettings
  identity: IkIdentity
  portrait: string
  stats: Record<StatKey, { value: Num; max: Num }>
  modifiers: { defense: Num; armor: Num; initiative: Num; commandRange: Num }
  featPoints: Num
  rangedWeapons: IkRangedWeapon[]
  meleeWeapons: IkMeleeWeapon[]
  /** Marked vitality points per life spiral branch (branches 1–6). */
  damage: { marked: number[]; notes: string }
  powerField: { size: Num; marked: number }
  skills: IkSkill[]
  abilities: IkEntry[]
  archetypeBenefits: IkEntry[]
  connections: IkEntry[]
  gear: IkGear[]
  armor: IkArmor[]
  gold: Num
  wealth: string
  arcaneTradition: string
  spells: IkSpell[]
  mechanika: IkMechanika[]
  notes: { general: string; injuries: string; languages: string; religion: string }
  steamjacks: IkSteamjack[]
}

/** Values worked out from the character; never stored. */
export type IkDerived = {
  stat: (key: StatKey) => Num
  /** Maximum per stat: from the race and level with race rules on, otherwise as typed. */
  statMax: (key: StatKey) => Num
  overMax: StatKey[]
  racialDefense: Num
  /** Highest level a skill can reach, from careers and experience level; null if no career offers it. */
  skillMax: (name: string) => Num
  spellLimit: Num
  willpower: Num
  /** Whether the character has the Load Bearing ability, which lessens armor penalties (p. 164). */
  loadBearing: boolean
  /** The worn armor's total SPD modifier, after Load Bearing. */
  armorSpeed: Num
  /** SPD in the worn armor, used for movement (pp. 203, 251). */
  speed: Num
  armorDefense: Num
  armorArmor: Num
  defense: Num
  armor: Num
  initiative: Num
  commandSkill: Num
  commandRange: Num
  /** Vitality points per life spiral branch (branches 1–6). */
  branchSizes: number[]
  vitality: number
  crippled: AspectKey[]
}
