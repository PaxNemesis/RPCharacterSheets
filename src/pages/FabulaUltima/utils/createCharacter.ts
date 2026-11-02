import type { FuBond, FuCharacter, FuClass, FuItem, ItemKind } from '../types'

export const createItem = (kind: ItemKind = ''): FuItem => ({
  kind,
  name: '',
  martial: false,
  quality: '',
  category: '',
  hands: '',
  range: '',
  accuracyA: 'dex',
  accuracyB: 'mig',
  accuracyBonus: null,
  damage: null,
  damageType: 'physical',
  defense: null,
  defenseBonus: null,
  magicDefenseBonus: null,
  initiative: null,
})

export const createClass = (): FuClass => ({
  name: '',
  benefitChoice: '',
  custom: {
    hp: null,
    mp: null,
    ip: null,
    martial: { armor: false, shields: false, melee: false, ranged: false },
    ritualism: false,
  },
  notes: '',
  // Starts at level 1: a class's level is the total of its Skill Levels.
  skills: [{ name: '', level: 1, notes: '' }],
})

export const createBond = (): FuBond => ({ name: '', respect: '', trust: '', feeling: '' })

export const createCharacter = (): FuCharacter => ({
  settings: {
    books: { high: true, natural: true, techno: true, low: true, necromancer: true, aceOfCards: true },
    quirks: true,
  },
  identity: { name: '', pronouns: '', player: '', identity: '', theme: '', origin: '' },
  portrait: '',
  quirk: { id: '', name: '', choice: '', notes: '' },
  attributes: { dex: '8', ins: '8', mig: '8', wlp: '8' },
  statuses: { slow: false, dazed: false, weak: false, shaken: false, enraged: false, poisoned: false },
  hp: { current: null, other: null },
  mp: { current: null, other: null },
  ip: { current: null, other: null },
  modifiers: { defense: null, magicDefense: null, initiative: null },
  xp: null,
  fabulaPoints: 3,
  zenit: null,
  bonds: [],
  classes: [],
  heroicSkills: [],
  equipment: {
    mainHand: createItem(),
    offHand: createItem(),
    armor: createItem('armor'),
    accessory: createItem('accessory'),
  },
  backpack: [],
  stored: [],
  spells: [],
  arcana: [],
  rituals: {
    disciplines: {
      arcanism: false,
      chimerism: false,
      elementalism: false,
      entropism: false,
      illusionism: false,
      ritualism: false,
      spiritism: false,
    },
    notes: '',
  },
  notes: { general: '', wealth: '' },
})
