import type { ClassData, Discipline } from '../types'

const skills = (...list: [string, number, Discipline?][]) => list.map(([name, max, ritual]) => ({ name, max, ritual }))

// Classes from the Atlases and bonus PDFs: free benefits, and each Skill with its maximum level.
export const SUPPLEMENT_CLASSES: ClassData[] = [
  {
    name: 'Chanter',
    book: 'high',
    page: 136,
    benefits: { mp: 5 },
    skills: skills(['Magichant', 10], ['Resonance', 3], ["Siren's Song", 1], ['Sound Barrier', 5], ['Vibrato', 1]),
  },
  {
    name: 'Commander',
    book: 'high',
    page: 140,
    benefits: { hp: 5, martial: ['melee', 'ranged'] },
    skills: skills(["Bishop's Edict", 5], ['Charging Cavalry', 5], ['Crushing Chariot', 1], ["King's Castle", 4], ["Queen's Gambit", 6]),
  },
  {
    name: 'Dancer',
    book: 'high',
    page: 142,
    benefits: { hpOrMp: true },
    skills: skills(['Dance', 10], ['Follow My Lead', 1], ['Frenetic Footwork', 2], ['Quick-Change', 1], ['Wardancer', 5]),
  },
  {
    name: 'Symbolist',
    book: 'high',
    page: 146,
    benefits: { ip: 2 },
    skills: skills(['Magic Symbols', 3], ['Mirage', 1], ['Personal Touch', 5], ['Symbolic Connection', 1], ['Symbolism', 5]),
  },
  {
    name: 'Floralist',
    book: 'natural',
    page: 138,
    benefits: { hpOrMp: true },
    skills: skills(['Battle Gardening', 3], ['Chloromancy', 10], ['Graft', 1], ['Tree of Life', 5], ['Verdant Sway', 1, 'ritualism']),
  },
  {
    name: 'Gourmet',
    book: 'natural',
    page: 148,
    benefits: { ip: 2, other: 'May start Projects for foods and drinks.' },
    skills: skills(['Cooking', 5], ['Knife and Fork', 1], ['Made with Love', 3], ['Salt and Pepper', 1], ['Traveling Cook', 3]),
  },
  {
    name: 'Invoker',
    book: 'natural',
    page: 154,
    benefits: { hpOrMp: true },
    skills: skills(['Elemental Harmony', 2], ['Invocation', 3], ['Linked Invocation', 3], ['Ripples', 5], ['Wellspring Expansion', 5]),
  },
  {
    name: 'Merchant',
    book: 'natural',
    page: 158,
    benefits: { ip: 2 },
    skills: skills(['Expiration Date', 3], ["I've Heard of It!", 3], ['Private Stock', 3], ['Real Treasure', 3], ['Winds of Trade', 3]),
  },
  {
    name: 'Esper',
    book: 'techno',
    page: 150,
    benefits: { mp: 5 },
    skills: skills(['Cognitive Focus', 5], ['Hypercognition', 5], ['Navigator', 1], ['Psychic Gifts', 5], ['Psychokinesis', 1]),
  },
  {
    name: 'Mutant',
    book: 'techno',
    page: 154,
    benefits: { hp: 5 },
    skills: skills(['Akromorphosis', 3], ['Biophagy', 4], ['Ecdysis', 1], ['Genoclepsis', 2], ['Theriomorphosis', 6]),
  },
  {
    name: 'Pilot',
    book: 'techno',
    page: 158,
    benefits: { hp: 5, martial: ['melee', 'ranged'] },
    skills: skills(['Compression Tech', 1], ['Flexible Configuration', 4], ['Heart in the Engine', 3], ['Personal Vehicle', 5], ['Strong Grip', 1]),
  },
  {
    name: 'Hunter',
    book: 'low',
    page: 87,
    benefits: { ip: 2, martial: ['melee', 'ranged'] },
    skills: skills(['Lock-On', 1], ['Set Trap', 5], ['Track', 5], ['Vital Strike', 1], ['Wild Reflexes', 5]),
  },
  {
    name: 'Illusionist',
    book: 'low',
    page: 94,
    benefits: { mp: 5, ritualism: true },
    skills: skills(['Illusionist Magic', 10], ['Phantasmal Echo', 5], ['Phantasmal Recovery', 5], ['Phantasmal Recycling', 1], ['Ritual Illusionism', 1]),
  },
  {
    name: 'Monk',
    book: 'low',
    page: 100,
    benefits: { mp: 5, martial: ['melee', 'ranged'] },
    skills: skills(['Clarity', 3], ['Resonant Clarity', 3], ['Soul Renewal', 1], ['Spirit Shot', 2], ['Spiritual Fortress', 3]),
  },
  {
    name: 'Necromancer',
    book: 'necromancer',
    page: 2,
    benefits: { hpOrMp: true },
    skills: skills(['Beyond the Realms of Death', 5], ['Children of the Grave', 1], ['Fear Is the Key', 3], ['For Whom the Bell Tolls', 3], ['Rondo of Nightmare', 1]),
  },
  {
    name: 'Ace of Cards',
    book: 'aceOfCards',
    page: 2,
    benefits: { hpOrMp: true },
    skills: skills(['Double or Nothing', 1], ['High or Low', 1], ['Magic Cards', 3], ['Mulligan', 5], ['Trap Card', 4]),
  },
]
