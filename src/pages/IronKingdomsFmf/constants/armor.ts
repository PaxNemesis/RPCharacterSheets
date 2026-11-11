import type { ArmorData } from '../types';

// The armor of the core rules (pp. 251–253, warcaster armor pp. 289–290) and Kings, Nations, and Gods;
// Urban Adventure adds none. Modifiers only; costs and rules stay in the books.
export const ARMOR: ArmorData[] = [
  { name: 'Alchemist’s Leather', book: 'core', page: 251, spd: 0, def: -1, arm: 5 },
  { name: 'Armored Great Coat', book: 'core', page: 252, spd: 0, def: -1, arm: 5 },
  { name: 'Chain Mail', book: 'core', page: 252, spd: 0, def: -2, arm: 7 },
  { name: 'Custom Battle Armor', book: 'core', page: 252, spd: 0, def: -1, arm: 6 },
  { name: 'Leather Armor', book: 'core', page: 252, spd: 0, def: -1, arm: 5 },
  { name: 'Infantry Armor', book: 'core', page: 252, spd: 0, def: -2, arm: 7 },
  { name: 'Tailored Plate', book: 'core', page: 252, spd: 0, def: -1, arm: 7 },
  { name: 'Full Plate', book: 'core', page: 252, spd: -1, def: -3, arm: 8 },
  { name: 'Storm Knight Armor', book: 'core', page: 253, spd: -2, def: -3, arm: 9 },
  { name: 'Warcaster Armor, Light', book: 'core', page: 289, spd: 0, def: 0, arm: 5 },
  { name: 'Warcaster Armor, Medium', book: 'core', page: 289, spd: 0, def: -1, arm: 7 },
  { name: 'Warcaster Armor, Heavy', book: 'core', page: 290, spd: 0, def: -2, arm: 8 },
  { name: 'Stormsmith Armor', book: 'kng', page: 92, spd: 0, def: -1, arm: 5 },
  { name: 'Assault Kommando Armor', book: 'kng', page: 182, spd: 0, def: -2, arm: 7 },
  { name: 'Man-O-War Armor', book: 'kng', page: 183, spd: -3, def: -3, arm: 9 },
  { name: 'Winter Guard Armor', book: 'kng', page: 184, spd: 0, def: -2, arm: 7 },
  { name: 'Crucible Armor', book: 'kng', page: 307, spd: -1, def: -3, arm: 8 },
  { name: 'Ordic Royal Marine Armor', book: 'kng', page: 307, spd: 0, def: -1, arm: 6 },
  { name: 'Naval Warcaster Armor', book: 'kng', page: 307, spd: 0, def: -1, arm: 6 },
  { name: 'Bastion Heavy Plate', book: 'kng', page: 364, spd: -3, def: -4, arm: 10 },
  { name: 'Cleanser Armor', book: 'kng', page: 364, spd: -1, def: -3, arm: 8 },
  { name: 'Exemplar Plate', book: 'kng', page: 364, spd: -2, def: -3, arm: 9 },
  { name: 'Temple Flameguard Armor', book: 'kng', page: 364, spd: 0, def: -1, arm: 5 },
  { name: 'Vassal Armor', book: 'kng', page: 365, spd: 0, def: -2, arm: 7 },
];
