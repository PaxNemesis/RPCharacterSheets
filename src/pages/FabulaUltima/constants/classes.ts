import type { ClassData, FuSettings } from '../types'
import { bookEnabled } from './books'
import { SUPPLEMENT_CLASSES } from './classesSupplements'

const skills = (...list: [string, number][]) => list.map(([name, max]) => ({ name, max }))

// Core rulebook classes (pp. 176–219): free benefits, and each Skill with its maximum level.
const CORE_CLASSES: ClassData[] = [
  {
    name: 'Arcanist',
    page: 176,
    benefits: { mp: 5 },
    skills: skills(['Arcane Circle', 4], ['Arcane Regeneration', 2], ['Bind and Summon', 1], ['Emergency Arcanum', 6], ['Ritual Arcanism', 1]),
  },
  {
    name: 'Chimerist',
    page: 182,
    benefits: { mp: 5, ritualism: true },
    skills: skills(['Consume', 5], ['Feral Speech', 1], ['Pathogenesis', 1], ['Ritual Chimerism', 1], ['Spell Mimic', 10]),
  },
  {
    name: 'Darkblade',
    page: 184,
    benefits: { hp: 5, martial: ['melee', 'armor'] },
    skills: skills(['Agony', 5], ['Dark Blood', 1], ['Heart of Darkness', 1], ['Painful Lesson', 3], ['Shadow Strike', 5]),
  },
  {
    name: 'Elementalist',
    page: 186,
    benefits: { mp: 5, ritualism: true },
    skills: skills(['Cataclysm', 3], ['Elemental Magic', 10], ['Magical Artillery', 3], ['Ritual Elementalism', 1], ['Spellblade', 4]),
  },
  {
    name: 'Entropist',
    page: 190,
    benefits: { mp: 5, ritualism: true },
    skills: skills(['Absorb MP', 5], ['Entropic Magic', 10], ['Lucky Seven', 1], ['Ritual Entropism', 1], ['Stolen Time', 4]),
  },
  {
    name: 'Fury',
    page: 194,
    benefits: { hp: 5, martial: ['melee', 'armor'] },
    skills: skills(['Adrenaline', 5], ['Frenzy', 1], ['Indomitable Spirit', 4], ['Provoke', 5], ['Withstand', 5]),
  },
  {
    name: 'Guardian',
    page: 196,
    benefits: { hp: 5, martial: ['armor', 'shields'] },
    skills: skills(['Bodyguard', 1], ['Defensive Mastery', 5], ['Dual Shieldbearer', 1], ['Fortress', 5], ['Protect', 1]),
  },
  {
    name: 'Loremaster',
    page: 198,
    benefits: { mp: 5 },
    skills: skills(['Flash of Insight', 3], ['Focused', 5], ['Knowledge Is Power', 1], ['Quick Assessment', 6], ['Trained Memory', 1]),
  },
  {
    name: 'Orator',
    page: 200,
    benefits: { mp: 5 },
    skills: skills(['Condemn', 4], ['Encourage', 6], ['My Trust in You', 2], ['Persuasive', 2], ['Unexpected Ally', 1]),
  },
  {
    name: 'Rogue',
    page: 202,
    benefits: { ip: 2 },
    skills: skills(['Cheap Shot', 5], ['Dodge', 3], ['High Speed', 3], ['See You Later', 1], ['Soul Steal', 5]),
  },
  {
    name: 'Sharpshooter',
    page: 204,
    benefits: { hp: 5, martial: ['ranged', 'shields'] },
    skills: skills(['Barrage', 1], ['Crossfire', 1], ['Hawkeye', 5], ['Ranged Weapon Mastery', 4], ['Warning Shot', 4]),
  },
  {
    name: 'Spiritist',
    page: 206,
    benefits: { mp: 5, ritualism: true },
    skills: skills(['Healing Power', 2], ['Ritual Spiritism', 1], ['Spiritual Magic', 10], ['Support Magic', 1], ['Vismagus', 1]),
  },
  {
    name: 'Tinkerer',
    page: 210,
    benefits: { ip: 2, other: 'May start Projects.' },
    skills: skills(['Emergency Item', 1], ['Gadgets', 5], ['Potion Rain', 2], ['Secret Formula', 5], ['Visionary', 5]),
  },
  {
    name: 'Wayfarer',
    page: 216,
    benefits: { ip: 2 },
    skills: skills(['Faithful Companion', 5], ['Resourceful', 4], ['Tavern Talk', 3], ['Treasure Hunter', 2], ['Well-Traveled', 1]),
  },
  {
    name: 'Weaponmaster',
    page: 218,
    benefits: { hp: 5, martial: ['melee', 'shields'] },
    skills: skills(['Bladestorm', 1], ['Bone Crusher', 4], ['Breach', 3], ['Counterattack', 1], ['Melee Weapon Mastery', 4]),
  },
]

export const CLASSES: ClassData[] = [...CORE_CLASSES, ...SUPPLEMENT_CLASSES].sort((a, b) => a.name.localeCompare(b.name))

/** The rulebook class with this name, if its book is turned on. */
export const findClass = (settings: FuSettings, name: string) => {
  const key = name.trim().toLowerCase()
  return CLASSES.find((data) => data.name.toLowerCase() === key && bookEnabled(settings, data.book))
}
