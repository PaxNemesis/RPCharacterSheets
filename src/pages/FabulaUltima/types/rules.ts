import type { AttributeKey, Discipline, MartialKey } from './character'

/** The rulebooks the sheet has data from. */
export type BookId = 'core' | 'high' | 'natural' | 'techno' | 'low' | 'necromancer' | 'aceOfCards'
export type SupplementId = Exclude<BookId, 'core'>

export type ClassData = {
  name: string
  /** Missing for the core rules. */
  book?: SupplementId
  page: number
  benefits: {
    hp?: number
    mp?: number
    ip?: number
    /** +5 HP or MP, the player's choice. */
    hpOrMp?: boolean
    martial?: MartialKey[]
    ritualism?: boolean
    /** Other free benefits, such as starting Projects. */
    other?: string
  }
  /** The class's Skills, their maximum Skill Level, and any ritual discipline the Skill unlocks. */
  skills: { name: string; max: number; ritual?: Discipline }[]
}

export type HeroicSkillData = {
  name: string
  book?: SupplementId
  page: number
  /** Permanent increases to maximum HP, MP or IP. */
  bonus?: { hp?: number; mp?: number; ip?: number }
}

export type QuirkData = {
  name: string
  book: SupplementId
  page: number
  /** Permanent increases to maximum HP and MP. */
  bonus?: { hp?: number; mp?: number }
  /** Survivor also lets the player pick martial equipment, a spell or +2 IP. */
  survivor?: boolean
}

export type SpellData = {
  name: string
  className: string
  book?: SupplementId
  page: number
  offensive: boolean
  mp: string
  targets: string
  duration: string
}

export type WeaponData = {
  name: string
  category: string
  page: number
  martial: boolean
  hands: 'one' | 'two'
  range: 'melee' | 'ranged'
  accuracy: [AttributeKey, AttributeKey]
  accuracyBonus?: number
  damage: number
}

export type DefensiveItemData = {
  name: string
  kind: 'armor' | 'shield'
  page: number
  martial: boolean
  /** Fixed Defense; missing means the DEX die. */
  defense?: number
  defenseBonus?: number
  magicDefenseBonus?: number
  initiative?: number
}
