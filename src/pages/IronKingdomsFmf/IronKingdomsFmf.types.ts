export type Num = number | null

export type StatKey = 'phy' | 'spd' | 'str' | 'agl' | 'prw' | 'poi' | 'int' | 'arc' | 'per'
export type AspectKey = 'physique' | 'agility' | 'intellect'
export type JackStatKey = Exclude<StatKey, 'arc'>

export type IkSettings = {
  magic: boolean
  mechanika: boolean
  steamjacks: boolean
  powerField: boolean
}

export type IkIdentity = {
  name: string
  player: string
  race: string
  archetype: string
  careers: string
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

export type IkSkill = { name: string; stat: StatKey | 'social' | ''; level: Num }
export type IkEntry = { name: string; description: string; page: string }
export type IkGear = { name: string; notes: string; quantity: Num }
export type IkArmor = { name: string; spd: Num; def: Num; arm: Num; notes: string }
export type IkSpell = { name: string; cost: Num; rng: string; aoe: string; pow: Num; up: string; off: string }
export type IkMechanika = { name: string; runePlate: string; capacitor: string; charges: Num; notes: string }

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
  willpower: Num
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
