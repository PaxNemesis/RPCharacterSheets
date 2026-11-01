import { POWER_ATTACKS } from '../constants/powerAttacks'
import { GRID_COLUMNS, GRID_ROWS, JACK_STAT_KEYS } from '../constants/steamjack'
import { STAT_KEYS } from '../constants/stats'
import type { IkCharacter, IkMechanika, IkSkill, IkSteamjack } from '../types'

// The skills printed on the official character sheet.
const STARTING_SKILLS: Pick<IkSkill, 'name' | 'stat'>[] = [
  { name: 'Hand Weapon', stat: 'prw' },
  { name: 'Great Weapon', stat: 'prw' },
  { name: 'Pistol', stat: 'poi' },
  { name: 'Rifle', stat: 'poi' },
  { name: 'Detection', stat: 'per' },
  { name: 'Sneak', stat: 'agl' },
  { name: 'Command', stat: 'social' },
]

export const createSteamjack = (): IkSteamjack => ({
  name: '',
  chassis: '',
  height: '',
  weight: '',
  fuelLoad: '',
  fuelUse: '',
  image: '',
  stats: Object.fromEntries(JACK_STAT_KEYS.map((key) => [key, null])) as IkSteamjack['stats'],
  defense: { base: null, mod: null },
  armor: { base: null, mod: null },
  grid: Array.from({ length: GRID_COLUMNS * GRID_ROWS }, () => ({ type: 'hull', damaged: false })),
  cortex: { imprint: '', fightingBonus: '', language: '', notes: '' },
  rangedWeapons: [],
  meleeWeapons: [],
  catastrophic: [],
  gear: [],
  powerAttacks: POWER_ATTACKS.map((attack) => ({ ...attack })),
})

export const createMechanika = (): IkMechanika => ({
  name: '',
  type: '',
  housing: '',
  capacitor: '',
  power: null,
  lifespan: '',
  runes: [],
  notes: '',
})

export const createCharacter = (): IkCharacter => ({
  settings: { raceRules: true, careerRules: true, magic: true, mechanika: true, steamjacks: true, powerField: false, books: { kng: true, ua: true } },
  identity: {
    name: '',
    player: '',
    race: '',
    archetype: '',
    careers: '',
    careerList: ['', ''],
    careerVariants: {},
    careerChoices: {},
    careerOptions: [],
    humanBonus: '',
    level: 'Hero',
    xp: null,
    sex: '',
    faith: '',
    defining: '',
    height: '',
    weight: '',
    age: '',
    eyesHair: '',
  },
  portrait: '',
  stats: Object.fromEntries(STAT_KEYS.map((key) => [key, { value: null, max: null }])) as IkCharacter['stats'],
  modifiers: { defense: null, armor: null, initiative: null, commandRange: null },
  featPoints: null,
  rangedWeapons: [],
  meleeWeapons: [],
  damage: { marked: [0, 0, 0, 0, 0, 0], notes: '' },
  powerField: { size: null, marked: 0 },
  skills: STARTING_SKILLS.map((skill) => ({ ...skill, level: null })),
  abilities: [],
  archetypeBenefits: [],
  connections: [],
  gear: [],
  armor: [],
  gold: null,
  wealth: '',
  arcaneTradition: '',
  spells: [],
  mechanika: [],
  notes: { general: '', injuries: '', languages: '', religion: '' },
  steamjacks: [],
})
