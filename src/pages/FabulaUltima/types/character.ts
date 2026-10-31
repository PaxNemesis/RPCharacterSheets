import type { SupplementId } from './rules'

export type Num = number | null

export type AttributeKey = 'dex' | 'ins' | 'mig' | 'wlp'
export type StatusKey = 'slow' | 'dazed' | 'weak' | 'shaken' | 'enraged' | 'poisoned'
export type MartialKey = 'armor' | 'shields' | 'melee' | 'ranged'
export type Discipline = 'arcanism' | 'chimerism' | 'elementalism' | 'entropism' | 'illusionism' | 'ritualism' | 'spiritism'
export type SlotKey = 'mainHand' | 'offHand' | 'armor' | 'accessory'

export type FuSettings = {
  /** Supplements whose classes, Heroic Skills and spells the sheet offers. */
  books: Record<SupplementId, boolean>
}

export type FuIdentity = {
  name: string
  pronouns: string
  player: string
  identity: string
  theme: string
  origin: string
}

/** One emotion from each pair; the Bond's strength is how many are chosen. */
export type FuBond = {
  name: string
  respect: '' | 'admiration' | 'inferiority'
  trust: '' | 'loyalty' | 'mistrust'
  feeling: '' | 'affection' | 'hatred'
}

export type FuClassSkill = { name: string; level: Num; notes: string }

export type FuClass = {
  name: string
  level: Num
  /** For classes whose free benefit is +5 HP or MP: the player's pick. */
  benefitChoice: '' | 'hp' | 'mp'
  /** Free benefits of a class that isn't in the rulebooks turned on in Settings. */
  custom: {
    hp: Num
    mp: Num
    ip: Num
    martial: Record<MartialKey, boolean>
    ritualism: boolean
  }
  notes: string
  skills: FuClassSkill[]
}

export type ItemKind = '' | 'weapon' | 'shield' | 'armor' | 'accessory'

export type FuItem = {
  kind: ItemKind
  name: string
  martial: boolean
  quality: string
  category: string
  hands: '' | 'one' | 'two'
  range: '' | 'melee' | 'ranged'
  accuracyA: AttributeKey
  accuracyB: AttributeKey
  accuracyBonus: Num
  /** Damage is HR + this. */
  damage: Num
  damageType: string
  /** Armor with a fixed Defense, such as bronze plate; blank uses the DEX die. */
  defense: Num
  defenseBonus: Num
  magicDefenseBonus: Num
  initiative: Num
}

export type FuSpell = {
  name: string
  offensive: '' | 'yes'
  mp: string
  targets: string
  duration: string
  notes: string
}

export type FuEntry = { name: string; notes: string }
export type FuBackpackItem = { name: string; quantity: Num; notes: string }

/** Current and "other" bonus to a maximum, for HP, MP and IP. */
export type FuPool = { current: Num; other: Num }

export type FuCharacter = {
  settings: FuSettings
  identity: FuIdentity
  portrait: string
  /** Base die size per attribute: '6', '8', '10' or '12'. */
  attributes: Record<AttributeKey, string>
  statuses: Record<StatusKey, boolean>
  hp: FuPool
  mp: FuPool
  ip: FuPool
  modifiers: { defense: Num; magicDefense: Num; initiative: Num }
  xp: Num
  fabulaPoints: Num
  zenit: Num
  bonds: FuBond[]
  classes: FuClass[]
  heroicSkills: FuEntry[]
  equipment: Record<SlotKey, FuItem>
  backpack: FuBackpackItem[]
  spells: FuSpell[]
  arcana: FuEntry[]
  rituals: { disciplines: Record<Discipline, boolean>; notes: string }
  notes: { general: string; wealth: string }
}

/** Values worked out from the character; never stored. */
export type FuDerived = {
  /** Sum of class levels. */
  level: number
  base: (key: AttributeKey) => number
  /** The die after status effects, never below d6. */
  current: (key: AttributeKey) => number
  hpBonus: number
  mpBonus: number
  ipBonus: number
  maxHp: number
  maxMp: number
  maxIp: number
  crisis: number
  martial: Record<MartialKey, boolean>
  /** Ritual disciplines granted by classes. */
  disciplines: Discipline[]
  armorDefense: Num
  /** Bonuses from everything equipped. */
  gear: { defense: number; magicDefense: number; initiative: number }
  defense: number
  magicDefense: number
  initiative: number
  /** More than three classes below level 10 (p. 227). */
  tooManyClasses: boolean
  /** Martial items the classes don't allow, and a two-handed weapon with a full off-hand. */
  equipmentWarnings: string[]
}
