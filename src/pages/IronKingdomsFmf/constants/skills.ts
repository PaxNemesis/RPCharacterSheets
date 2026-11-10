import type { BookId, StatKey } from '../types';
import { compareNames } from '@/utils/alphabetical';
import { bookRef } from './books';

type SkillStat = StatKey | 'social';

// Governing stat for each skill, from the lists on pp. 172–173, plus the supplements' new skills
// (Heavy Artillery KNG p. 305, Stormsmithing KNG p. 90, Thrall Crafting UA p. 69). Forgery and
// Sailing allow either of two stats; the first is used unless the player picks the other.
export const SKILL_STATS: Record<string, SkillStat> = {
  Archery: 'poi',
  Crossbow: 'poi',
  'Great Weapon': 'prw',
  'Hand Weapon': 'prw',
  'Heavy Artillery': 'poi',
  Lance: 'prw',
  'Light Artillery': 'poi',
  Pistol: 'poi',
  Rifle: 'poi',
  Shield: 'prw',
  'Thrown Weapon': 'prw',
  'Unarmed Combat': 'prw',
  Alchemy: 'int',
  Bribery: 'social',
  Command: 'social',
  Craft: 'int',
  Cryptography: 'int',
  Deception: 'social',
  Disguise: 'int',
  'Escape Artist': 'agl',
  Etiquette: 'social',
  'Fell Calling': 'poi',
  'Forensic Science': 'int',
  Forgery: 'agl',
  Interrogation: 'int',
  Law: 'int',
  'Lock Picking': 'agl',
  'Mechanikal Engineering': 'int',
  Medicine: 'int',
  Navigation: 'per',
  Negotiation: 'social',
  Oratory: 'social',
  Pickpocket: 'agl',
  Research: 'int',
  'Rope Use': 'agl',
  Sailing: 'int',
  Seduction: 'social',
  Sneak: 'agl',
  Stormsmithing: 'per',
  Streetwise: 'per',
  Survival: 'per',
  'Thrall Crafting': 'int',
  Tracking: 'per',
  'Animal Handling': 'social',
  Climbing: 'agl',
  Detection: 'per',
  Driving: 'agl',
  Gambling: 'per',
  Intimidation: 'social',
  Jumping: 'phy',
  Lore: 'int',
  Riding: 'agl',
  Swimming: 'str',
};

const MILITARY = [
  'Archery',
  'Crossbow',
  'Great Weapon',
  'Hand Weapon',
  'Lance',
  'Light Artillery',
  'Pistol',
  'Rifle',
  'Shield',
  'Thrown Weapon',
  'Unarmed Combat',
];

// Page of each skill's entry: military skills share p. 172, the others have their own (pp. 173–194).
const SKILL_PAGES: Record<string, [BookId, number]> = {
  ...Object.fromEntries(MILITARY.map((skill) => [skill, ['core', 172]])),
  Alchemy: ['core', 173],
  'Animal Handling': ['core', 174],
  Bribery: ['core', 174],
  Climbing: ['core', 175],
  Command: ['core', 175],
  Craft: ['core', 176],
  Cryptography: ['core', 176],
  Deception: ['core', 177],
  Detection: ['core', 177],
  Disguise: ['core', 178],
  Driving: ['core', 179],
  'Escape Artist': ['core', 179],
  Etiquette: ['core', 180],
  'Fell Calling': ['core', 181],
  'Forensic Science': ['core', 181],
  Forgery: ['core', 181],
  Gambling: ['core', 182],
  Interrogation: ['core', 182],
  Intimidation: ['core', 183],
  Jumping: ['core', 183],
  Law: ['core', 184],
  'Lock Picking': ['core', 184],
  Lore: ['core', 185],
  'Mechanikal Engineering': ['core', 186],
  Medicine: ['core', 186],
  Navigation: ['core', 186],
  Negotiation: ['core', 187],
  Oratory: ['core', 189],
  Pickpocket: ['core', 189],
  Research: ['core', 190],
  Riding: ['core', 190],
  'Rope Use': ['core', 191],
  Sailing: ['core', 191],
  Seduction: ['core', 192],
  Sneak: ['core', 193],
  Streetwise: ['core', 193],
  Survival: ['core', 194],
  Swimming: ['core', 194],
  Tracking: ['core', 194],
  'Heavy Artillery': ['kng', 305],
  Stormsmithing: ['kng', 90],
  'Thrall Crafting': ['ua', 69],
};

/** Page reference for a skill, e.g. "185" or "KNG 90"; "Lore (Trollkin)" finds Lore. */
export const skillRef = (name: string) => {
  const base = baseSkillName(name).toLowerCase();
  const match = Object.keys(SKILL_PAGES).find((skill) => skill.toLowerCase() === base);
  return match ? bookRef(...SKILL_PAGES[match]) : '';
};

/** Skills any character can learn, capped only by experience level (p. 119). */
export const GENERAL_SKILLS = [
  'Animal Handling',
  'Climbing',
  'Detection',
  'Driving',
  'Gambling',
  'Intimidation',
  'Jumping',
  'Lore',
  'Riding',
  'Swimming',
];

/** Skill names to suggest while typing. Craft and Lore take a specialization, e.g. "Lore (Trollkin)". */
export const SKILL_SUGGESTIONS = Object.keys(SKILL_STATS).sort(compareNames);

/** "Craft (gunsmithing)" → "Craft". */
export const baseSkillName = (name: string) => name.replace(/\s*\(.*\)\s*$/, '').trim();

export const knownSkillStat = (name: string): SkillStat | undefined => {
  const base = baseSkillName(name).toLowerCase();
  const match = Object.keys(SKILL_STATS).find((skill) => skill.toLowerCase() === base);
  return match ? SKILL_STATS[match] : undefined;
};
