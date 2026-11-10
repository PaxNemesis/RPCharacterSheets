/* oxlint-disable max-lines -- The whole saved character in one place, so it can be compared with createCharacter at a glance. */
import type { SupplementId } from './rules'

export type Num = number | null

export type AttributeKey = 'dex' | 'ins' | 'mig' | 'wlp'
export type StatusKey = 'slow' | 'dazed' | 'weak' | 'shaken' | 'enraged' | 'poisoned'
export type MartialKey = 'armor' | 'shields' | 'melee' | 'ranged'
export type Discipline = 'arcanism' | 'chimerism' | 'elementalism' | 'entropism' | 'illusionism' | 'ritualism' | 'spiritism'
export type SlotKey = 'mainHand' | 'offHand' | 'armor' | 'accessory'

export type FuSettings = {
  /** Supplements whose classes, Heroic Skills, spells and custom weapons the sheet offers. */
  books: Record<SupplementId, boolean>
  /** The Atlases' optional Quirk rule. */
  quirks: boolean
}

export type FuQuirk = {
  /** '' for none, 'custom', or "book:name" for a rulebook Quirk. */
  id: string
  /** Name of a custom Quirk. */
  name: string
  /** Survivor's option. */
  choice: '' | 'martial' | 'spell' | 'ip'
  notes: string
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

/** `max` is typed in for a custom class; a rulebook class's maximums come from its data. */
export type FuClassSkill = { name: string; level: Num; max?: Num; notes: string }

export type FuClass = {
  name: string
  /** For classes whose free benefit is +5 HP or MP: the player's pick. */
  benefitChoice: '' | 'hp' | 'mp'
  /** Free benefits of a class that isn't in the rulebooks turned on in Settings. */
  custom: {
    hp: Num
    mp: Num
    ip: Num
    martial: Record<MartialKey, boolean>
    /** Ritual disciplines granted as a free benefit; others can come from a "Ritual …" Skill. */
    disciplines: Partial<Record<Discipline, boolean>>
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
  /**
   * Other forms of an item that transforms, such as a gunbrella. The fields above are always the
   * current form's stats; `forms[form]` only holds its label until the item switches away from it.
   */
  forms?: FuItemForm[]
  form?: number
}

/** A form's own stats; the name and kind are shared by every form. */
export type FuItemForm = { label: string } & Omit<FuItem, 'kind' | 'name' | 'forms' | 'form'>

export type FuSpell = {
  name: string
  offensive: '' | 'yes'
  mp: string
  targets: string
  duration: string
  /** Book and page, e.g. "p. 208" or "LF p. 97". */
  page: string
  notes: string
}

export type FuEntry = { name: string; notes: string }

/** `source` is the name of the mastered class that granted it, or ':other' for anything else. */
export type FuHeroicSkill = { name: string; source: string; notes: string }
export type FuBackpackItem = { name: string; quantity: Num; notes: string }

export type Taste = 'bitter' | 'salty' | 'sour' | 'sweet' | 'umami'

/** The Floralist's discovered magiseeds and, during a conflict, the garden and its Growth Clock. */
export type FuFloralist = {
  discovered: string[]
  /** The player's notes per discovered magiseed, by name. */
  seedNotes: Record<string, string>
  /** The magiseed in the garden, or '' when it's empty. */
  garden: string
  /** Filled sections of the Growth Clock, 0 to 4. */
  growth: number
}

export type FuIngredient = { name: string; taste: Taste | ''; quantity: Num }

/** The Gourmet's ingredients and cookbook: an effect per taste pair, found by rolling a d12. */
export type FuGourmet = {
  ingredients: FuIngredient[]
  /** By taste pair, e.g. "bitter+salty": the d12 result ('' until found) and its choice. */
  combinations: Record<string, { effect: string; choice: string }>
  notes: string
}

/** Current and "other" bonus to a maximum, for HP, MP and IP. */
export type FuPool = { current: Num; other: Num }

export type ClarityKind = 'immunity' | 'pierce' | 'resistance'

/** One Clarity benefit: immunity to a status effect, or ignoring or resisting a damage type. */
export type FuClarity = { kind: ClarityKind | ''; choice: string; shared: boolean }

/** The Monk's Soul Beads during a conflict, and the Clarity benefits they power (LF pp. 101–102). */
export type FuMonk = {
  core: number
  resolve: number
  /** In the player's order; only the first ones, as many as the Resolve Beads allow, are active. */
  clarity: FuClarity[]
}

/** The Dancer's learned dances, and which were performed this turn and last turn (HF pp. 142–145). */
export type FuDancer = {
  learned: string[]
  /** The player's notes per learned dance, by name. */
  notes: Record<string, string>
  /** The dance performed this turn, or ''. */
  current: string
  /** The dance performed on the previous turn of this scene, or '': a different one costs less. */
  previous: string
}

/** A symbol on a creature: who bears it, and the damage type, status, action or Species chosen for it. */
export type FuActiveSymbol = { name: string; bearer: string; choice: string }

/** The Symbolist's learned symbols and those active right now (HF pp. 146–151). */
export type FuSymbolist = {
  learned: string[]
  notes: Record<string, string>
  active: FuActiveSymbol[]
}

/** The Chanter's learned keys and tones, and the verse being put together (HF pp. 136–139). */
export type FuChanter = {
  keys: string[]
  tones: string[]
  /** The player's notes per learned key or tone, by name. */
  notes: Record<string, string>
  verse: { volume: string; key: string; tone: string }
}

export type FuCharacter = {
  settings: FuSettings
  identity: FuIdentity
  portrait: string
  quirk: FuQuirk
  /** Base die size per attribute: '6', '8', '10' or '12'. */
  attributes: Record<AttributeKey, string>
  statuses: Record<StatusKey, boolean>
  /** Attributes raised one die size by an effect, up to d12. */
  boosts: Record<AttributeKey, boolean>
  hp: FuPool
  mp: FuPool
  ip: FuPool
  /** Extra bonuses, and martial equipment allowed by something other than classes or the Quirk. */
  modifiers: { defense: Num; magicDefense: Num; initiative: Num; martial: Record<MartialKey, boolean> }
  xp: Num
  fabulaPoints: Num
  zenit: Num
  bonds: FuBond[]
  classes: FuClass[]
  heroicSkills: FuHeroicSkill[]
  equipment: Record<SlotKey, FuItem>
  backpack: FuBackpackItem[]
  /** Unequipped weapons, armor and accessories, kept with their stats so they can be equipped again. */
  stored: FuItem[]
  spells: FuSpell[]
  arcana: FuEntry[]
  /** Disciplines added by hand on top of those from classes, notes per discipline, and general notes. */
  rituals: { disciplines: Record<Discipline, boolean>; disciplineNotes: Partial<Record<Discipline, string>>; notes: string }
  floralist: FuFloralist
  gourmet: FuGourmet
  monk: FuMonk
  dancer: FuDancer
  symbolist: FuSymbolist
  chanter: FuChanter
  notes: { general: string; wealth: string }
}

/** Values worked out from the character; never stored. */
export type FuDerived = {
  /** Sum of class levels. */
  level: number
  base: (key: AttributeKey) => number
  /** The die after boosts (up to d12) and then status effects (never below d6). */
  current: (key: AttributeKey) => number
  hpBonus: number
  mpBonus: number
  ipBonus: number
  maxHp: number
  maxMp: number
  maxIp: number
  crisis: number
  /** Martial equipment the character may equip, including what was allowed by hand. */
  martial: Record<MartialKey, boolean>
  /** Martial equipment granted by classes and the Quirk alone. */
  martialGranted: Record<MartialKey, boolean>
  /** Ritual disciplines granted by classes. */
  disciplines: Discipline[]
  /** The classes that grant each of those disciplines. */
  disciplineSources: Partial<Record<Discipline, string[]>>
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
